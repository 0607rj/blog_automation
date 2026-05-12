const express = require("express");
const router = express.Router();

// ─── Models ───
const Blog = require("../models/Blog");

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOUNTING DOMAIN BLOG API
// ═══════════════════════════════════════════════════════════════════════════════

// ─── GET /blogs ──
// Fetches all blogs sorted by latest
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch blogs." });
  }
});

// ─── GET /blogs/:id ──
// Fetch a single blog by ID
router.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch blog." });
  }
});

// ─── PATCH /blogs/:id/rate ──
// Like or dislike a blog
router.patch("/blogs/:id/rate", async (req, res) => {
  const { type } = req.body;
  try {
    const update = type === "like" ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update rating." });
  }
});

// ─── GET /blogs/:id/related ──
// Fetch related blogs based on category
router.get("/blogs/:id/related", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    const related = await Blog.find({ _id: { $ne: blog._id }, category: blog.category })
      .sort({ createdAt: -1 }).limit(3);
    return res.status(200).json({ success: true, related });
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch related blogs." });
  }
});

module.exports = router;
