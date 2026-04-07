var path = require("path");
var UseColRef = require("../models/Tailor");
var cloudinary = require("cloudinary").v2;

 Tesseract = require("tesseract.js");
const crypto = require("crypto");//aadhaar hash krdo


const SECRET_KEY = "mySuperSecretKey123"; 

function Signup(req, resp) {
    console.log(req.body);

    let CustColRef = new UseColRef({
        email: req.body.email,
        pwd: req.body.pwd,      
        UserType: req.body.UserType
    });

    CustColRef.save()
        .then((doc) => {
            resp.status(200).json({ status: true, msg: "record saved", doc: doc });
        })
        .catch((err) => {
            resp.status(200).json({ status: false, msg: err.message });
        });
}




var TailorModel = require("../models/Tailor");

async function getTailorByEmail(req, res) {
  try {
    const { email } = req.params;

    const user = await TailorModel.findOne({ email });

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

    if (user && user.pwd === pwd) {
      return res.json({
        status: true,
        user,
        role: "Customer"
      });
    }

    // Tailor check
    user = await Tailor.findOne({ email });

    if (user && user.pwd === pwd) {
      return res.json({
        status: true,
        user,
        role: "Tailor"
      });
    }

    res.status(401).json({ msg: "Invalid credentials" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

async function TailorDetails(req, resp) {
    try {
        console.log("Incoming body:", req.body);
        console.log("Incoming files:", req.files);

        let profileUrl = null;
        let aadhaarUrl = null;

        // ✅ Profile Photo Upload
        if (req.files && req.files.profilePhoto) {
            let file = req.files.profilePhoto;
            let fileName = Date.now() + "_" + file.name;

            let uploadPath = path.join(__dirname, "..", "uploads", fileName);
            await file.mv(uploadPath);

            let result = await cloudinary.uploader.upload(uploadPath);
            profileUrl = result.secure_url;
        }

        // ✅ Aadhaar Photo Upload
        if (req.files && req.files.aadhaarPhoto) {
            let file = req.files.aadhaarPhoto;
            let fileName = Date.now() + "_aadhaar_" + file.name;

            let uploadPath = path.join(__dirname, "..", "uploads", fileName);
            await file.mv(uploadPath);

            let result = await cloudinary.uploader.upload(uploadPath);
            aadhaarUrl = result.secure_url;
        }

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
        console.log("ERROR:", err);
        resp.status(500).json({ status: false, msg: err.message });
    }
}





async function doExtractAadhaar(req, resp) {

    try {
        if (!req.files || !req.files.aadhaarPhoto) {
            return resp.status(400).json({ status: false, msg: "No file uploaded" });
        }

        let file = req.files.aadhaarPhoto;
        let fileName = Date.now() + "_" + file.name;
        let uploadPath = path.join(__dirname, "..", "uploads", fileName);

        await file.mv(uploadPath);

        const result = await Tesseract.recognize(uploadPath, "eng");
        let text = result.data.text;

        console.log("OCR TEXT:", text);

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
        console.log("OCR ERROR:", err);
        resp.status(500).json({ status: false, msg: err.message });
    }
}


function encrypt(text) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(SECRET_KEY).digest(),
    Buffer.alloc(16, 0)
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
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

    const { mobile, rating, review } = req.body;

    const tailor = await UseColRef.findOne({ phone: mobile });

    if (!tailor)
      return res.status(404).json({ msg: "Tailor not found" });

    tailor.reviews.push({
      customerName: "Customer",
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


const tailors = await UseColRef.find(filter)

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
    const { email } = req.body;

    if (!req.files || !req.files.image) {
      return res.json({ status: false, msg: "No image uploaded" });
    }

    let file = req.files.image;
    let fileName = Date.now() + "_" + file.name;
    let uploadPath = path.join(__dirname, "..", "uploads", fileName);

    await file.mv(uploadPath);

    let result = await cloudinary.uploader.upload(uploadPath);

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
    res.status(500).json({ error: err.message });
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

    const tailor = await UseColRef.findById(id);

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




cloudinary.config({
    cloud_name: 'dstzxbqkc',
    api_key: '545895537255412',
    api_secret: '39NRt4cclzYfhcuY8YAItXTwxkU'
});


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