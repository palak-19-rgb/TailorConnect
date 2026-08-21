require("dotenv").config();

const mongoose = require("mongoose");
const { retrieveRelevantKnowledge } = require("../services/ragService");

async function testRag() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected\n");

    const query = "What fabric is best for a formal wedding?";

    console.log("QUERY:");
    console.log(query);
    console.log("\nRETRIEVED RESULTS:\n");

    const results = await retrieveRelevantKnowledge(query);

    console.dir(results, { depth: null });

    await mongoose.disconnect();
  } catch (error) {
    console.error("RAG TEST ERROR:", error);
  }
}

testRag();