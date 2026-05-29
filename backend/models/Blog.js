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
      default: "ACCOUNTING",
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
    // NEW: Autonomous system fields
    audienceCategory: {
      type: String,
      default: "",
    },
    targetLocation: {
      type: String,
      default: "",
    },
    generatedBy: {
      type: String,
      enum: ["manual", "autonomous"],
      default: "manual",
    },
    pipelineRunId: {
      type: String,
      default: "",
    },
    opportunityScore: {
      type: Number,
      default: 0,
    },
    // SEO tracking
    seoKeywords: {
      type: [String],
      default: [],
    },
    emotionalHook: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    excerpt: {
      type: String,
      default: "",
    },
    featuredImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: false }
);

blogSchema.pre("save", async function (next) {
  try {
    if (!this.slug && this.title) {
      let baseSlug = this.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (!baseSlug) {
        baseSlug = "post";
      }

      let slug = baseSlug;
      let counter = 1;
      const Blog = this.constructor;

      while (true) {
        const existing = await Blog.findOne({ slug, _id: { $ne: this._id } });
        if (!existing) {
          break;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      this.slug = slug;
    }
    if (!this.excerpt) {
      this.excerpt = this.summary || "";
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Blog", blogSchema);
