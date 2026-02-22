var path = require("path");
var UseColRef = require("../models/Tailor");
var cloudinary = require("cloudinary").v2;
const Tesseract = require("tesseract.js");
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



function Login(req, resp) {
    let { email, pwd } = req.body;

    UseColRef.findOne({ email: email })
        .then((user) => {
            if (!user) return resp.status(401).json({ status: false, msg: "User not found" });

         
            if (pwd === user.pwd) {
                resp.status(200).json({ status: true, msg: "Login successful", user: user });
            } else {
                resp.status(401).json({ status: false, msg: "Invalid password" });
            }
        })
        .catch((err) => {
            resp.status(500).json({ status: false, msg: err.message });
        });
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

        // ✅ Save Properly Structured Data
        let CustColRef = new UseColRef({
            email: req.body.email,
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
            aadharCard: aadhaarUrl,   // if your schema uses this name

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
        });

        let doc = await CustColRef.save();

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



cloudinary.config({
    cloud_name: 'dstzxbqkc',
    api_key: '545895537255412',
    api_secret: '39NRt4cclzYfhcuY8YAItXTwxkU'
});



module.exports = { Signup, Login,TailorDetails,doExtractAadhaar };


