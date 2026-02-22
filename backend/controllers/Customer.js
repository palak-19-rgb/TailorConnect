var path = require("path");
var UseColRef = require("../models/Customer"); 
var cloudinary = require("cloudinary").v2;

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
            if (!user)
                return resp.status(401).json({ status: false, msg: "User not found" });

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
        let CustColRef = new UseColRef({
            name: req.body.name,
            gender: req.body.gender,
            dob: req.body.dob,
            phone: req.body.phone,
            email: req.body.email,
            picurl: imageUrl,

            address: {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode,
                country: req.body.country
            }
        });

        let doc = await CustColRef.save();

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

cloudinary.config({
    cloud_name: 'dstzxbqkc',
    api_key: '545895537255412',
    api_secret: '39NRt4cclzYfhcuY8YAItXTwxkU'
});

module.exports = { Signup, Login, CustomerDetails };