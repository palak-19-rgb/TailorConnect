var path = require("path");
var UseColRef = require("../models/Customer"); 
var cloudinary = require("cloudinary").v2;



cloudinary.config({
   cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});






const bcrypt = require("bcrypt");

async function Signup(req, resp) {
    try {
        const hashed = await bcrypt.hash(req.body.pwd, 10);

        let CustColRef = new UseColRef({
            email: req.body.email,
            pwd: hashed,              // ✅ hashed store hoga
            UserType: req.body.UserType
        });

        const doc = await CustColRef.save();
        resp.status(200).json({ status: true, msg: "record saved", doc: doc });

    } catch (err) {
        resp.status(200).json({ status: false, msg: err.message });
    }
}




async function getCustomerByEmail(req, res) {
  try {
    const { email } = req.params;

    const user = await UseColRef.findOne({ email }).select("-pwd");

    if (!user) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




async function CustomerDetails(req, resp) {
    try {
        console.log("Incoming body:", req.body);
        console.log("Incoming files:", req.files);

        let imageUrl = null;

        // ✅ SAFE FILE CHECK
        if (req.files && req.files.profilepic) {

            let file = req.files.profilepic;
            let fileName = Date.now() + "_" + file.name;

            let uploadPath = path.join(__dirname, "..", "uploads", fileName);

            await file.mv(uploadPath);

            let result = await cloudinary.uploader.upload(uploadPath);
            console.log("Cloudinary URL:", result.secure_url);

            imageUrl = result.secure_url;
        }

        // ✅ CREATE OBJECT MANUALLY (same schema names)
 let updateData = {
  name: req.body.name,
  gender: req.body.gender,
  dob: req.body.dob,
  phone: req.body.phone,
  address: {
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode,
    country: req.body.country
  }
};

// ✅ sirf tabhi pic update hogi jab new image aaye
if (imageUrl) {
  updateData.picurl = imageUrl;
}

let doc = await UseColRef.findOneAndUpdate(
  { email: req.body.email },
  updateData,
  { new: true }
);
        console.log("Saved in MongoDB:", doc);

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



async function checkCustomer(req, res) {
  try {
   const { email } = req.params;
const customer = await UseColRef.findOne({ email }).select("-pwd");
    if (!customer) {
      return res.json({ exists: false });
    }

    res.json({
      exists: true,
      customer: customer
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function getSavedTailors(req, res) {
  try {
    const { email } = req.params;

   const customer = await UseColRef.findOne({ email })
  .select("-pwd")                         
  .populate({
    path: "savedTailors",
    model: "Tailor",
    select: "-pwd"                        
  });
    console.log("POPULATED:", customer?.savedTailors);

    if (!customer) return res.json([]);

    res.json(customer.savedTailors);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function saveTailor(req, res) {
  try {
const { email, tailorId } = req.body;
const customer = await UseColRef.findOne({ email });

    if (!customer) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    // 👇 duplicate save na ho
   if (!customer.savedTailors.some(id => id.toString() === tailorId)) {
  customer.savedTailors.push(tailorId);
  await customer.save();
}

    res.json({ success: true, msg: "Tailor saved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function removeTailor(req, res) {
  try {
   const { email, tailorId } = req.body;
const customer = await UseColRef.findOne({ email });

    if (!customer) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    // ❌ remove logic
    customer.savedTailors = customer.savedTailors.filter(
      (id) => id.toString() !== tailorId
    );

    await customer.save();

    res.json({ success: true, msg: "Removed" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}





module.exports = { Signup,getCustomerByEmail, CustomerDetails,checkCustomer,getSavedTailors,saveTailor,removeTailor };