const express = require("express");
const router = express.Router();
const blogAgent = require("../agent/blogAgent");
const Blog = require("../models/Blog");

// ─── GET /generate-stream (SSE for real-time typing) ─────────────────────────
router.get("/generate-stream", async (req, res) => {
  const { title, description } = req.query;

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const existingCategories = await Blog.distinct("category");
    const blogAgent = require("../agent/blogAgent");
    const blogData = await blogAgent(undefined, description, title, existingCategories);

    // Stream word by word for typing animation effect
    const words = blogData.content.split(" ");
    for (let i = 0; i < words.length; i++) {
      res.write(`data: ${words[i]} \n\n`);
      // Small delay between words to create typing effect
      await new Promise(r => setTimeout(r, 30));
    }

    res.write("event: done\ndata: [DONE]\n\n");
    res.end();
  } catch (err) {
    res.write(`data: [ERROR] ${err.message}\n\n`);
    res.end();
  }
});

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
      tags: blogData.tags || [],
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

// ─── GET /blogs/:id/related ──────────────────────────────────────────────────
router.get("/blogs/:id/related", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Find up to 3 other blogs in the same category, excluding the current one
    const related = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    return res.status(200).json({ success: true, related });
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch related blogs." });
  }
});

module.exports = router;

