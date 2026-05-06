const express = require("express");
const router = express.Router();
const blogAgent = require("../agent/blogAgent");
const Blog = require("../models/Blog");

// ─── POST /generate-blog ──────────────────────────────────────────────────────
router.post("/generate-blog", async (req, res) => {
  const { title, category, description } = req.body;

  try {
    // Fetch unique existing categories to help the AI decide
    const existingCategories = await Blog.distinct("category");
    
    const blogData = await blogAgent(category, description, title, existingCategories);
    
    // Save to MongoDB
    const blog = new Blog({
      title: blogData.title,
      content: blogData.content,
      summary: blogData.summary,
      category: blogData.category,
      description: description || "",
    });
    await blog.save();
    console.log(`💾 Blog saved: "${blog.title}"`);
    
    return res.status(201).json({ success: true, blog });
  } catch (error) {
    console.error("❌ API Error:", error.message);
    return res.status(400).json({ error: error.message });
  }
});


// ─── GET /blogs ───────────────────────────────────────────────────────────────
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch blogs." });
  }
});

// ─── PATCH /blogs/:id/rate ───────────────────────────────────────────────────
router.patch("/blogs/:id/rate", async (req, res) => {
  const { type } = req.body; // 'like' or 'dislike'
  try {
    const update = type === "like" ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update rating." });
  }
});

module.exports = router;

