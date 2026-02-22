var mongoose = require("mongoose");

let colDesign = {

  email: { type: String, required: true, index: true, unique: true },
  pwd: String,
  UserType: String,

  shopName: String,
  ownerName: String,
  phone: String,
  specializationCategory: String,
  specializationType: String,
  workType: String,
  gender: String,
  gst: String,
  experience: String,
  socialLink: String,
  otherInfo: String,

  profilePhoto: String,
  aadhaarNumber: String,   

  shopAddress: {
    personalAddress: String,
    landmark: String,
    floorNumber: String,
    area: String,
    shopTimings: String,
    city: String,
    state: String,
    pincode: String,
  }
};

var ver = { versionKey: false };

let SchemaClass = mongoose.Schema;
let collectionTailor = new SchemaClass(colDesign, ver);

let UseColRef = mongoose.model("Tailor", collectionTailor, "tailors");

module.exports = UseColRef;