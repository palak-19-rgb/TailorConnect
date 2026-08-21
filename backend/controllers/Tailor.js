var path = require("path");
var UseColRef = require("../models/Tailor");
var cloudinary = require("cloudinary").v2;
const Tesseract = require("tesseract.js");
const crypto = require("crypto");//aadhaar hash krdo
const { uploadImage, withTemporaryImage } = require("../middleware/upload");




cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


const SECRET_KEY = process.env.AADHAAR_SECRET_KEY;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function requireTailor(req, res) {
  if (req.user.role !== "Tailor") {
    res.status(403).json({ msg: "Tailor access required" });
    return false;
  }
  return true;
}
async function Signup(req, resp) {
    try {
        const hashed = await bcrypt.hash(req.body.pwd, 10);

        let CustColRef = new UseColRef({
            email: req.body.email,
            pwd: hashed,           // ✅ hashed
            UserType: req.body.UserType
        });

        const doc = await CustColRef.save();
        resp.status(200).json({ status: true, msg: "record saved", doc: doc });

    } catch(err) {
        resp.status(200).json({ status: false, msg: err.message });
    }
}




var TailorModel = require("../models/Tailor");

async function getTailorByEmail(req, res) {
  try {
    const { email } = req.params;

    const user = await TailorModel.findOne({ email }).select(
      "email shopName ownerName phone specializationCategory specializationType workType gender gst experience socialLink otherInfo profilePhoto shopAddress reviews portfolio"
    );

    if (!user) {
      return res.status(404).json({ msg: "Tailor not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




const Customer = require("../models/Customer");
const Tailor = require("../models/Tailor");

async function Login(req, res) {
  const { email, pwd } = req.body;
  try {
    // Customer check
    let user = await Customer.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(pwd, user.pwd);
      if (match) {
        const userObj = user.toObject();
        delete userObj.pwd;                                              // ✅ password hataya
        const token = jwt.sign(
          { email, role: "Customer" },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );                                                                // ✅ token banaya
        return res.json({ status: true, user: userObj, role: "Customer", token });
      }
    }

    // Tailor check
    user = await Tailor.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(pwd, user.pwd);
      if (match) {
        const userObj = user.toObject();
        delete userObj.pwd;                                              // ✅ password hataya
        const token = jwt.sign(
          { email, role: "Tailor" },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );                                                                // ✅ token banaya
        return res.json({ status: true, user: userObj, role: "Tailor", token });
      }
    }

    res.status(401).json({ msg: "Invalid credentials" });

  } catch (err) {

    console.log("LOGIN ERROR:", err);

    res.status(500).json({ msg: err.message });
  }
}



async function TailorDetails(req, resp) {
    try {
        if (!requireTailor(req, resp)) return;
        let profileUrl = null;
        let aadhaarUrl = null;

        // ✅ Profile Photo Upload
        if (req.files && req.files.profilePhoto) {
            let result = await uploadImage(req.files.profilePhoto, cloudinary, "tailorconnect/profiles");
            profileUrl = result.secure_url;
        }

        // ✅ Aadhaar Photo Upload
        if (req.files && req.files.aadhaarPhoto) {
            let result = await uploadImage(req.files.aadhaarPhoto, cloudinary, "tailorconnect/aadhaar");
            aadhaarUrl = result.secure_url;
        }

      // The authenticated token, not a client-provided email, determines the record.
      req.body.email = req.user.email;
      let doc = await UseColRef.findOneAndUpdate(
  { email: req.body.email },   // ⭐ SAME USER
  {
    shopName: req.body.shopName,
    ownerName: req.body.ownerName,
    phone: req.body.phone,
    gender: req.body.gender,
    gst: req.body.gst,
    experience: req.body.experience,
    workType: req.body.workType,
    socialLink: req.body.socialLink,
    otherInfo: req.body.otherInfo,
    aadhaarNumber: encrypt(req.body.aadhaarNumber),

    profilePhoto: profileUrl,
    aadharCard: aadhaarUrl,

    shopAddress: {
      personalAddress: req.body.personalAddress,
      landmark: req.body.landmark,
      floorNumber: req.body.floorNumber,
      area: req.body.area,
      shopTimings: req.body.shopTimings,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode
    }
  },
  { new: true }
);

        resp.status(200).json({
            status: true,
            msg: "record saved",
            doc: doc
        });

    } catch (err) {
        resp.status(err.statusCode || 500).json({ status: false, msg: err.message });
    }
}





async function doExtractAadhaar(req, resp) {

    try {
        if (!requireTailor(req, resp)) return;
        if (!req.files || !req.files.aadhaarPhoto) {
            return resp.status(400).json({ status: false, msg: "No file uploaded" });
        }

        const result = await withTemporaryImage(
          req.files.aadhaarPhoto,
          (tempPath) => Tesseract.recognize(tempPath, "eng")
        );
        let text = result.data.text;

        // Aadhaar Pattern (12 digits)
        let aadhaarMatch = text.match(/\d{4}\s?\d{4}\s?\d{4}/);
        let aadhaarno = aadhaarMatch
            ? aadhaarMatch[0].replace(/\s/g, "")
            : "";

        // DOB
        let dobMatch = text.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
        let dob = "";
        if (dobMatch) {
            dob = `${dobMatch[3]}-${dobMatch[2]}-${dobMatch[1]}`;
        }

        // Gender
        let gender = "";
        if (/female/i.test(text)) gender = "Female";
        else if (/male/i.test(text)) gender = "Male";

        resp.status(200).json({
            status: true,
            aadhaarNumber: aadhaarno,
            dob,
            gender
        });

    } catch (err) {
        resp.status(err.statusCode || 500).json({ status: false, msg: err.message });
    }
}


function encrypt(text) {
  if (!text) return undefined;                                          // ✅ undefined crash se bachao

  const iv = crypto.randomBytes(16);                                     // ✅ random IV
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(SECRET_KEY).digest(),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;                          // ✅ IV ko bhi store karo
}


// 🔥 GET Tailor By Mobile
async function getTailorProfile(req, resp) {
  try {
    const { mobile } = req.params;

    const tailor = await UseColRef.findOne({ phone: mobile });

    if (!tailor) {
      return resp.status(404).json({
        status: false,
        msg: "Tailor not found"
      });
    }

    resp.status(200).json({
      status: true,
      name: tailor.shopName,
      ownerName: tailor.ownerName,
      phone: tailor.phone,
      id: tailor._id
    });

  } catch (err) {
    resp.status(500).json({
      status: false,
      msg: err.message
    });
  }
}




async function addReview(req, res) {

  try {
    if (req.user.role !== "Customer") {
      return res.status(403).json({ msg: "Customer access required" });
    }

    const { mobile, rating, review } = req.body;

    const customer = await Customer.findOne({ email: req.user.email }).select("name email");
    if (!customer) {
      return res.status(403).json({ msg: "Customer account not found" });
    }

    const tailor = await UseColRef.findOne({ phone: mobile });

    if (!tailor)
      return res.status(404).json({ msg: "Tailor not found" });

    tailor.reviews.push({
      customerName: customer.name || customer.email,
      rating: rating,
      review: review
    });

    await tailor.save();

    res.json({ status: true, msg: "Review Added" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}


// ================== GET REVIEWS ==================
async function getReviews(req, res) {

  try {

    const { mobile } = req.params;
    const tailor = await UseColRef.findOne({ phone: mobile });

    if (!tailor)
      return res.status(404).json({ msg: "Tailor not found" });

    res.json(tailor.reviews || []);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}



async function getTailors(req,res){

try{

const {city,experience,workType} = req.query

let filter={}

if(city){
filter["shopAddress.city"] = { $regex: city, $options: "i" }
}

if(experience){
filter.experience = { $gte: Number(experience) }
}

if(workType){
filter.workType = workType
}


const tailors = await UseColRef.find(filter).select("email shopName ownerName phone specializationCategory specializationType workType gender gst experience socialLink otherInfo profilePhoto shopAddress reviews portfolio")

// 👇 Important check
if(tailors.length === 0){
return res.json({message:"Tailor doesn't exist"})
}

res.json(tailors)

}catch(err){
res.status(500).json({error:err.message})
}
}


// ================= PORTFOLIO =================

// ADD PORTFOLIO IMAGE
async function addPortfolio(req, res) {
  try {
    if (!requireTailor(req, res)) return;
    const email = req.user.email;

    if (!req.files || !req.files.image) {
      return res.json({ status: false, msg: "No image uploaded" });
    }

    let result = await uploadImage(req.files.image, cloudinary, "tailorconnect/portfolio");

    const tailor = await UseColRef.findOne({ email });

    if (!tailor) return res.json({ msg: "Tailor not found" });

    if (!tailor.portfolio) tailor.portfolio = [];
    if (!Array.isArray(tailor.portfolio)) {
  tailor.portfolio = [];}

    tailor.portfolio.push({
  imageUrl: result.secure_url,
  public_id: result.public_id,
  tag: req.body.tag || "Bridal",
  description: req.body.description || "",
  createdAt: new Date()
});

    await tailor.save();

    res.json({ status: true, msg: "Portfolio Added" });

  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

// GET PORTFOLIO
async function getPortfolio(req, res) {
  try {
    const { email } = req.params;

    const tailor = await UseColRef.findOne({ email });

    if (!tailor) return res.json({ msg: "Tailor not found" });

    res.json(tailor.portfolio || []);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE PORTFOLIO IMAGE
async function deletePortfolio(req, res) {
  try {
    if (!requireTailor(req, res)) return;
    req.body.email = req.user.email;
    const { email, imageId } = req.body;

    const tailor = await UseColRef.findOne({ email });

    if (!tailor) {
      return res.status(404).json({ msg: "Tailor not found" });
    }

 
    const img = tailor.portfolio.id(imageId);

    if (!img) {
      return res.status(404).json({ msg: "Image not found" });
    }

    // 🔥 CLOUDINARY DELETE
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // 🔥 REMOVE FROM DB
    img.deleteOne();

    await tailor.save();

    res.json({ status: true, msg: "Deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}


async function updatePortfolio(req, res) {
  try {
    if (!requireTailor(req, res)) return;
    req.body.email = req.user.email;
    const { email, images } = req.body;   // ✅ yaha se aayega data

    const tailor = await UseColRef.findOne({ email });

    if (!tailor) {
      return res.status(404).json({ msg: "Tailor not found" });
    }

    tailor.portfolio = images;

    await tailor.save();

    res.json({ status: true, msg: "Portfolio Updated" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}



async function updateSingleImage(req, res) {
  try {
    if (!requireTailor(req, res)) return;
    req.body.email = req.user.email;
    const { email, image } = req.body;

    const tailor = await UseColRef.findOne({ email });

    if (!tailor) {
      return res.status(404).json({ msg: "Tailor not found" });
    }

    tailor.portfolio = tailor.portfolio.map((img) =>
      img._id.toString() === image._id
        ? { ...img._doc, ...image }
        : img
    );

    await tailor.save();

    res.json({ status: true, msg: "Image updated" });

  } catch (err) {   // ✅ YE MISSING HOGA
    res.status(500).json({ msg: err.message });
  }
}

// 🔥 FULL PROFILE WITH PORTFOLIO + REVIEWS
async function getFullTailorProfile(req, res) {
  try {
    const { id } = req.params;

    const tailor = await UseColRef.findById(id).select("email shopName ownerName phone specializationCategory specializationType workType gender gst experience socialLink otherInfo profilePhoto shopAddress reviews portfolio");

    if (!tailor) {
      return res.status(404).json({
        status: false,
        msg: "Tailor not found"
      });
    }

    res.json({
      status: true,
      data: tailor
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}






module.exports = {
  Signup,
  Login,
  TailorDetails,
  doExtractAadhaar,
  getTailorProfile,
  addReview,
  getReviews,
  getTailors,
  addPortfolio,
  getPortfolio,
  deletePortfolio,  
  updatePortfolio,
  updateSingleImage,
  getFullTailorProfile,
  getTailorByEmail
};
