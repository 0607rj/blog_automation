const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { _id: false });

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      default: "",
    },
    h1: {
      type: String,
      default: "",
    },
    h2s: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "Editorial",
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    faq: {
      type: [faqSchema],
      default: [],
    },
    cta: {
      type: String,
      default: "",
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    // Business context that generated this blog
    businessContext: {
      companyName: String,
      domain: String,
      industry: String,
    },
    // Validation score
    validationScore: {
      type: Number,
      default: 100,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Blog", blogSchema);
