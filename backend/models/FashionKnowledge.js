const mongoose = require("mongoose");

const fashionKnowledgeSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    embedding: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "FashionKnowledge",
  fashionKnowledgeSchema
);