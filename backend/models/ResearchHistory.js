const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema({
  niche: { type: String, required: true },
  audience: String,
  trendingKeywords: [String],
  searchQueries: [String],
  topicClusters: [String],
  userIntentAnalysis: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ResearchHistory", researchSchema);
