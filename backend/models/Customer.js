var mongoose = require("mongoose");

let colDesign = {
    email: { type: String, required: true, index: true, unique: true },
    pwd: String,
    UserType: String,

//for CustomerProfile Scheema updated
 name: String,
    gender: String,
    dob: String,
    phone: String,
    picurl: String,

    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    }

};
let schemaOptions = { versionKey: false };
let CustomerSchema = new mongoose.Schema(colDesign, schemaOptions);
let UserColRef = mongoose.model("Customer", CustomerSchema,"customers");

module.exports = UserColRef;