const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room: String,
  text: String,
  sender: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("Message", messageSchema);