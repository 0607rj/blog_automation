const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogBySlug,
  rateBlog,
  getRelatedBlogs,
} = require("../controllers/blogController");

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOUNTING DOMAIN BLOG API
// ═══════════════════════════════════════════════════════════════════════════════

// ─── GET /blogs ──
// Fetches all blogs sorted by latest
router.get("/blogs", getAllBlogs);

// ─── GET /blogs/:slugOrId ──
// Fetch a single blog by slug or ID
router.get("/blogs/:slugOrId", getBlogBySlug);

// ─── PATCH /blogs/:id/rate ──
// Like or dislike a blog
router.patch("/blogs/:id/rate", rateBlog);

// ─── GET /blogs/:id/related ──
// Fetch related blogs based on category
router.get("/blogs/:id/related", getRelatedBlogs);

module.exports = router;
