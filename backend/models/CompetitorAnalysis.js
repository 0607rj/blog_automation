const mongoose = require("mongoose");

const competitorAnalysisSchema = new mongoose.Schema({
  niche: { type: String, required: true },
  audience: String,
  competitorWeaknesses: [String],
  contentGaps: [String],
  rankingOpportunities: [String],
  strategyNotes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CompetitorAnalysis", competitorAnalysisSchema);
