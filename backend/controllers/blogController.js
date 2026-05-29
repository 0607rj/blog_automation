const mongoose = require("mongoose");
const Blog = require("../models/Blog");

/**
 * GET /api/blogs
 * Fetch all blogs with basic details (and support backward compatibility).
 */
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    const formattedBlogs = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      slug: blog.slug || blog.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, ""),
      excerpt: blog.excerpt || blog.summary || "",
      summary: blog.summary,
      content: blog.content,
      category: blog.category,
      likes: blog.likes || 0,
      dislikes: blog.dislikes || 0,
      featuredImage: blog.featuredImage || "",
      createdAt: blog.createdAt,
    }));

    return res.status(200).json({
      success: true,
      blogs: formattedBlogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Could not fetch blogs. Please try again later.",
      details: error.message,
    });
  }
};

/**
 * GET /api/blogs/:slugOrId
 * Fetch full details of a blog by its slug or ID.
 */
const getBlogBySlug = async (req, res) => {
  const { slugOrId } = req.params;

  try {
    // 1. Try to find the blog by slug
    let blog = await Blog.findOne({ slug: slugOrId });

    // 2. Fallback: If not found and it is a valid ObjectId, try finding by ID
    if (!blog && mongoose.Types.ObjectId.isValid(slugOrId)) {
      blog = await Blog.findById(slugOrId);
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: `Blog post not found with slug or ID: '${slugOrId}'`,
      });
    }

    // Construct structured response matching all requirements
    const responseBlog = {
      _id: blog._id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      fullContent: blog.content, // Alias for ease of integration
      summary: blog.summary,
      excerpt: blog.excerpt || blog.summary,
      category: blog.category,
      headings: {
        h1: blog.h1 || blog.title,
        h2s: blog.h2s || [],
      },
      tags: blog.tags || [],
      seo: {
        metaDescription: blog.metaDescription || "",
        keywords: blog.seoKeywords || [],
        emotionalHook: blog.emotionalHook || "",
      },
      seoFields: { // Alias for ease of integration
        metaDescription: blog.metaDescription || "",
        keywords: blog.seoKeywords || [],
        emotionalHook: blog.emotionalHook || "",
      },
      faq: blog.faq || [],
      cta: blog.cta || "",
      wordCount: blog.wordCount || 0,
      readingTime: blog.readingTime || 1,
      likes: blog.likes || 0,
      dislikes: blog.dislikes || 0,
      featuredImage: blog.featuredImage || "",
      createdAt: blog.createdAt,
    };

    return res.status(200).json({
      success: true,
      blog: responseBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while retrieving the blog post.",
      details: error.message,
    });
  }
};

/**
 * PATCH /api/blogs/:id/rate
 * Rate a blog (like or dislike).
 */
const rateBlog = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!["like", "dislike"].includes(type)) {
    return res.status(400).json({
      success: false,
      error: "Invalid rating type. Must be 'like' or 'dislike'.",
    });
  }

  try {
    const update = type === "like" ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
    const blog = await Blog.findByIdAndUpdate(id, update, { new: true });

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to update blog rating.",
      details: error.message,
    });
  }
};

/**
 * GET /api/blogs/:id/related
 * Fetch related blogs by category.
 */
const getRelatedBlogs = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found.",
      });
    }

    const related = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    return res.status(200).json({
      success: true,
      related,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Could not fetch related blogs.",
      details: error.message,
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  rateBlog,
  getRelatedBlogs,
};
