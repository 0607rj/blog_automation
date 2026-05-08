const mongoose = require("mongoose");

const personaSchema = new mongoose.Schema({
  niche: { type: String, required: true },
  audience: { type: String, required: true },
  profile: {
    buyerPersona: String,
    painPoints: [String],
    goals: [String],
    emotions: [String],
    searchIntent: [String],
    behavioralPatterns: [String],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Persona", personaSchema);
