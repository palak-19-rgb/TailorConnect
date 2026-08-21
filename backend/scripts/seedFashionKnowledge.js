require("dotenv").config();

const mongoose = require("mongoose");

const FashionKnowledge = require("../models/FashionKnowledge");
const fashionKnowledge = require("../data/fashionKnowledge");
const { generateEmbedding } = require("../services/embeddingService");

async function seedFashionKnowledge() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await FashionKnowledge.deleteMany({});

    for (const item of fashionKnowledge) {
      console.log(`Generating embedding for: ${item.text}`);

      const embedding = await generateEmbedding(item.text);

      await FashionKnowledge.create({
        ...item,
        embedding,
      });

      console.log("Inserted successfully");
    }

    console.log("Fashion knowledge seeded successfully!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedFashionKnowledge();