const mongoose = require("mongoose");
const { generateEmbedding } = require("./embeddingService");

async function retrieveRelevantKnowledge(query) {
  const queryEmbedding = await generateEmbedding(query);

  const results = await mongoose.connection.db
    .collection("fashionknowledges")
    .aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit: 3,
        },
      },
      {
        $project: {
          _id: 0,
          text: 1,
          category: 1,
          tags: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ])
    .toArray();

  return results;
}

module.exports = { retrieveRelevantKnowledge };