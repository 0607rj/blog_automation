const express = require("express");
const router = express.Router();

// ─── Models ───
const Blog = require("../models/Blog");
const Persona = require("../models/Persona");
const ResearchHistory = require("../models/ResearchHistory");
const CompetitorAnalysis = require("../models/CompetitorAnalysis");

// ─── Agents (Full Pipeline) ───
const domainDetectionAgent = require("../agents/domainDetectionAgent");
const personaTemplateLoader = require("../agents/personaTemplateLoader");
const personaAgent = require("../agents/personaAgent");
const researchAgent = require("../agents/researchAgent");
const competitorAgent = require("../agents/competitorAgent");
const { memoryAgent, updateMemory } = require("../agents/memoryAgent");
const orchestratorAgent = require("../agents/orchestratorAgent");
const blogGeneratorAgent = require("../agents/blogGeneratorAgent");
const validationAgent = require("../agents/validationAgent");

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTION AI PIPELINE — 11-Step Autonomous Marketing Engine
// ═══════════════════════════════════════════════════════════════════════════════

router.post("/pipeline-stream", async (req, res) => {
  // SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Critical for preventing buffering
  res.flushHeaders();

  const sendStep = (step, status, data) => {
    res.write(`data: ${JSON.stringify({ step, status, data })}\n\n`);
  };

  // Extract business inputs from request body
  const {
    companyName,
    productDescription,
    productFeatures,
    competitors,
    businessGoal,
    targetRegion,
    tonePreference,
    industry,
  } = req.body;

  const businessContext = {
    companyName: companyName || "",
    productDescription: productDescription || "",
    productFeatures: productFeatures || [],
    competitors: competitors || [],
    businessGoal: businessGoal || "Generate SEO traffic and leads",
    targetRegion: targetRegion || "Global",
    tonePreference: tonePreference || "Professional",
    industry: industry || "",
  };

  try {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // ══════════════════════════════════════════════════════════════
    // STEP 1: DOMAIN DETECTION AGENT
    // ══════════════════════════════════════════════════════════════
    sendStep("domainDetection", "running", { message: "Detecting your business domain..." });
    const domainResult = await domainDetectionAgent(businessContext);
    sendStep("domainDetection", "done", domainResult);
    await delay(1200);

    // ══════════════════════════════════════════════════════════════
    // STEP 2: PERSONA TEMPLATE LOADER
    // ══════════════════════════════════════════════════════════════
    sendStep("personaLoader", "running", { message: "Loading relevant audience personas..." });
    const selectedTemplates = personaTemplateLoader(domainResult);
    const templateSummary = {
      count: selectedTemplates.length,
      labels: selectedTemplates.map(t => t.label),
    };
    sendStep("personaLoader", "done", templateSummary);
    await delay(1000);

    // ══════════════════════════════════════════════════════════════
    // STEP 3: PERSONA AGENT
    // ══════════════════════════════════════════════════════════════
    sendStep("persona", "running", { message: "Synthesizing audience psychology..." });
    const personaResult = await personaAgent(selectedTemplates, businessContext);
    await Persona.create({
      domain: domainResult.domain,
      companyName: businessContext.companyName,
      selectedTemplates: selectedTemplates.map(t => t.label),
      profile: personaResult,
    });
    sendStep("persona", "done", personaResult);
    await delay(1500);

    // ══════════════════════════════════════════════════════════════
    // STEP 4: RESEARCH AGENT
    // ══════════════════════════════════════════════════════════════
    sendStep("research", "running", { message: "Researching trends, keywords & AI search queries..." });
    const researchResult = await researchAgent(personaResult, businessContext);
    await ResearchHistory.create({
      domain: domainResult.domain,
      companyName: businessContext.companyName,
      ...researchResult,
    });
    sendStep("research", "done", researchResult);
    await delay(1500);

    // ══════════════════════════════════════════════════════════════
    // STEP 5: COMPETITOR ANALYSIS AGENT
    // ══════════════════════════════════════════════════════════════
    sendStep("competitor", "running", { message: "Analyzing competitor gaps & opportunities..." });
    const competitorResult = await competitorAgent(
      businessContext.competitors,
      personaResult,
      researchResult
    );
    await CompetitorAnalysis.create({
      domain: domainResult.domain,
      companyName: businessContext.companyName,
      competitorWebsites: businessContext.competitors,
      ...competitorResult,
    });
    sendStep("competitor", "done", competitorResult);
    await delay(1200);

    // ══════════════════════════════════════════════════════════════
    // STEP 6: MEMORY AGENT
    // ══════════════════════════════════════════════════════════════
    sendStep("memory", "running", { message: "Checking content history & avoiding repetition..." });
    const memoryResult = await memoryAgent(domainResult.domain);
    sendStep("memory", "done", memoryResult);
    await delay(1000);

    // ══════════════════════════════════════════════════════════════
    // STEP 7: ORCHESTRATOR AGENT
    // ══════════════════════════════════════════════════════════════
    sendStep("orchestrator", "running", { message: "Building strategic content blueprint..." });
    const blueprint = await orchestratorAgent(personaResult, researchResult, competitorResult, memoryResult, domainResult);
    sendStep("orchestrator", "done", blueprint);
    await delay(1500);

    // ══════════════════════════════════════════════════════════════
    // STEP 8: CONTENT GENERATION AGENT
    // ══════════════════════════════════════════════════════════════
    sendStep("generator", "running", { message: "Writing production-quality content..." });
    const blogResult = await blogGeneratorAgent(blueprint, personaResult, researchResult, competitorResult);
    sendStep("generator", "done", { title: blogResult.title, wordCount: blogResult.wordCount });
    await delay(1200);

    // ══════════════════════════════════════════════════════════════
    // STEP 9: VALIDATION LAYER
    // ══════════════════════════════════════════════════════════════
    sendStep("validation", "running", { message: "Validating content quality..." });
    const validationResult = await validationAgent(blogResult, blueprint, personaResult, researchResult, competitorResult);
    sendStep("validation", "done", validationResult);
    await delay(1000);

    // ══════════════════════════════════════════════════════════════
    // STEP 10: STREAM CONTENT WORD BY WORD
    // ══════════════════════════════════════════════════════════════
    sendStep("streaming", "running", { message: "Streaming content live..." });
    const words = blogResult.content.split(" ");
    for (let i = 0; i < words.length; i++) {
      res.write(`data: ${JSON.stringify({ step: "word", status: "streaming", data: words[i] + " " })}\n\n`);
      // Use a slightly longer delay for smoother UI updates
      await new Promise(r => setTimeout(r, 40));
    }

    // ══════════════════════════════════════════════════════════════
    // STEP 11: SAVE TO MONGODB
    // ══════════════════════════════════════════════════════════════
    const readingTime = Math.max(1, Math.ceil((blogResult.wordCount || 0) / 200));

    const blog = new Blog({
      title: blogResult.title,
      content: blogResult.content,
      summary: blogResult.summary,
      metaDescription: blogResult.metaDescription,
      h1: blogResult.h1,
      h2s: blogResult.h2s,
      category: blogResult.category,
      tags: blogResult.tags,
      faq: blogResult.faq,
      cta: blogResult.cta,
      wordCount: blogResult.wordCount,
      readingTime,
      businessContext: {
        companyName: businessContext.companyName,
        domain: domainResult.domain,
        industry: domainResult.industry,
      },
      validationScore: validationResult.score,
      description: `${businessContext.companyName} | ${domainResult.domain}`,
    });
    await blog.save();

    // Update memory with this new blog
    await updateMemory(
      domainResult.domain,
      blogResult.title,
      blogResult.tags,
      blogResult.category,
      blueprint.contentAngle
    );

    sendStep("complete", "done", {
      blogId: blog._id,
      title: blog.title,
      category: blog.category,
      validationScore: validationResult.score,
      wordCount: blogResult.wordCount,
      readingTime,
    });
    res.write("event: done\ndata: [DONE]\n\n");
    res.end();

  } catch (err) {
    console.error("Pipeline error:", err);
    sendStep("error", "failed", { message: err.message });
    res.end();
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// EXISTING ROUTES (kept intact)
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
