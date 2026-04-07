var mongoose = require("mongoose");

let colDesign = {

  tailorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },

  // 🔗 optional link with existing app customer
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },



  email: {
  type: String,
  required: true
},

  name: String,
  phone: String,
  address: String,

  outfit: String,
  lastVisit: String,

  measurements: {
    chest: String,
    waist: String,
    hip: String,
    shoulder: String,
    sleeve: String,
    length: String
  },
  deliveryDate: {
  type: String,
  default: ""
},
status: {
  type: String,
  default: "Pending"
},

};

let schema = new mongoose.Schema(colDesign, { versionKey: false });

module.exports = mongoose.model("TailorCustomer", schema, "tailorCustomers");