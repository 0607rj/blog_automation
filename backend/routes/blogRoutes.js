const express = require("express");
const router = express.Router();

// ─── Models ───
const Blog = require("../models/Blog");
const Persona = require("../models/Persona");
const ResearchHistory = require("../models/ResearchHistory");
const CompetitorAnalysis = require("../models/CompetitorAnalysis");

// ─── Agents ───
const personaAgent = require("../agents/personaAgent");
const researchAgent = require("../agents/researchAgent");
const competitorAgent = require("../agents/competitorAgent");
const { memoryAgent, updateMemory } = require("../agents/memoryAgent");
const orchestratorAgent = require("../agents/orchestratorAgent");
const blogGeneratorAgent = require("../agents/blogGeneratorAgent");

// ═══════════════════════════════════════════════════════════════════════════════
// AI Pipeline Workflow
// ═══════════════════════════════════════════════════════════════════════════════

router.get("/pipeline-stream", async (req, res) => {
  const { audience, niche } = req.query;

  // SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendStep = (step, status, data) => {
    res.write(`data: ${JSON.stringify({ step, status, data })}\n\n`);
  };

  try {
    // ── STEP 1: Persona Agent ──
    sendStep("persona", "running", { message: "Understanding your audience..." });
    const personaResult = await personaAgent(audience || "General", niche || "General");
    await Persona.create({ niche, audience, profile: personaResult });
    sendStep("persona", "done", personaResult);

    // ── STEP 2: Research Agent ──
    sendStep("research", "running", { message: "Researching trends and keywords..." });
    const researchResult = await researchAgent(personaResult, niche);
    await ResearchHistory.create({ niche, audience, ...researchResult });
    sendStep("research", "done", researchResult);

    // ── STEP 3: Competitor Agent ──
    sendStep("competitor", "running", { message: "Analyzing competitor gaps..." });
    const competitorResult = await competitorAgent(researchResult, niche);
    await CompetitorAnalysis.create({ niche, audience, ...competitorResult });
    sendStep("competitor", "done", competitorResult);

    // ── STEP 4: Memory Agent ──
    sendStep("memory", "running", { message: "Checking content history..." });
    const memoryResult = await memoryAgent(niche || "General");
    sendStep("memory", "done", memoryResult);

    // ── STEP 5: Orchestrator Agent ──
    sendStep("orchestrator", "running", { message: "Building content strategy..." });
    const blueprint = await orchestratorAgent(personaResult, researchResult, competitorResult, memoryResult);
    sendStep("orchestrator", "done", blueprint);

    // ── STEP 6: Blog Generator Agent ──
    sendStep("generator", "running", { message: "Writing your blog..." });
    const blogResult = await blogGeneratorAgent(blueprint, personaResult);
    sendStep("generator", "done", { title: blogResult.title });

    // ── STEP 7: Stream the blog content word by word ──
    sendStep("streaming", "running", { message: "Streaming content..." });
    const words = blogResult.content.split(" ");
    for (let i = 0; i < words.length; i++) {
      res.write(`data: ${JSON.stringify({ step: "word", status: "streaming", data: words[i] + " " })}\n\n`);
      await new Promise(r => setTimeout(r, 25));
    }

    // ── STEP 8: Save to MongoDB ──
    const blog = new Blog({
      title: blogResult.title,
      content: blogResult.content,
      summary: blogResult.summary,
      category: blogResult.category,
      tags: blogResult.tags,
      description: `Audience: ${audience} | Niche: ${niche}`,
    });
    await blog.save();

    // Update memory with this new blog
    await updateMemory(niche || "General", blogResult.title, blogResult.tags, blogResult.category, blueprint.contentAngle);

    sendStep("complete", "done", { blogId: blog._id, title: blog.title, category: blog.category });
    res.write("event: done\ndata: [DONE]\n\n");
    res.end();

  } catch (err) {
    sendStep("error", "failed", { message: err.message });
    res.end();
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// EXISTING ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── GET /blogs ──
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch blogs." });
  }
});

// ─── PATCH /blogs/:id/rate ──
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
