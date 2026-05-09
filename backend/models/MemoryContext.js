const mongoose = require("mongoose");

const memoryContextSchema = new mongoose.Schema({
  niche: { type: String, required: true },
  generatedTitles: [String],
  usedKeywords: [String],
  usedCategories: [String],
  avoidTopics: [String],
  strategyHistory: [String],
  successfulTopics: [String],
  successfulKeywords: [String],
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MemoryContext", memoryContextSchema);
