/**
 * DASHBOARD API ROUTES
 * API endpoints for the autonomous intelligence dashboard.
 */
const express = require("express");
const router = express.Router();

const Blog = require("../models/Blog");
const PipelineRun = require("../models/PipelineRun");
const OpportunityScore = require("../models/OpportunityScore");
const MemoryContext = require("../models/MemoryContext");

const { executeAutonomousRun, getSchedulerStatus } = require("../scheduler/cronScheduler");
const { runAutonomousPipeline } = require("../agents/autonomousPipeline");

// ═══════════════════════════════════════════════════════════════════
// GET /api/dashboard/stats — System-wide statistics
// ═══════════════════════════════════════════════════════════════════
router.get("/stats", async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const autonomousBlogs = await Blog.countDocuments({ generatedBy: "autonomous" });
    const totalRuns = await PipelineRun.countDocuments();
    const successfulRuns = await PipelineRun.countDocuments({ status: "completed" });
    const failedRuns = await PipelineRun.countDocuments({ status: "failed" });

    const latestBlog = await Blog.findOne().sort({ createdAt: -1 }).select("title category audienceCategory createdAt validationScore");
    const latestRun = await PipelineRun.findOne().sort({ startedAt: -1 }).select("runId status selectedAudienceCategory durationMs startedAt");

    const avgValidation = await Blog.aggregate([
      { $group: { _id: null, avg: { $avg: "$validationScore" } } }
    ]);

    // Category distribution
    const categoryDist = await Blog.aggregate([
      { $group: { _id: "$audienceCategory", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Location distribution (Filtered out for UI privacy)
    const locationDist = [];

    const scheduler = getSchedulerStatus();

    return res.json({
      success: true,
      stats: {
        totalBlogs,
        autonomousBlogs,
        totalRuns,
        successfulRuns,
        failedRuns,
        avgValidationScore: Math.round(avgValidation[0]?.avg || 0),
        categoryDistribution: categoryDist,
        locationDistribution: locationDist,
        latestBlog,
        latestRun,
        scheduler
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch dashboard stats." });
  }
});

// ═══════════════════════════════════════════════════════════════════
// GET /api/dashboard/pipeline-runs — History of autonomous runs
// ═══════════════════════════════════════════════════════════════════
router.get("/pipeline-runs", async (req, res) => {
  try {
    const runs = await PipelineRun.find()
      .sort({ startedAt: -1 })
      .limit(20)
      .select("runId runType status selectedAudienceCategory opportunityScore generatedBlogTitle durationMs startedAt completedAt error failedAtStep selectionReasoning");
    
    return res.json({ success: true, runs });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch pipeline runs." });
  }
});

// ═══════════════════════════════════════════════════════════════════
// GET /api/dashboard/pipeline-runs/:runId — Single run with full agent outputs
// ═══════════════════════════════════════════════════════════════════
router.get("/pipeline-runs/:runId", async (req, res) => {
  try {
    const run = await PipelineRun.findOne({ runId: req.params.runId });
    if (!run) return res.status(404).json({ error: "Pipeline run not found." });
    return res.json({ success: true, run });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch pipeline run." });
  }
});

// ═══════════════════════════════════════════════════════════════════
// GET /api/dashboard/opportunities — Current opportunity scores
// ═══════════════════════════════════════════════════════════════════
router.get("/opportunities", async (req, res) => {
  try {
    const latest = await OpportunityScore.find()
      .sort({ analyzedAt: -1 })
      .limit(5);
    
    return res.json({ success: true, opportunities: latest });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch opportunity scores." });
  }
});

// ═══════════════════════════════════════════════════════════════════
// GET /api/dashboard/insights — Latest research/competitor/persona insights
// ═══════════════════════════════════════════════════════════════════
router.get("/insights", async (req, res) => {
  try {
    const latestRun = await PipelineRun.findOne({ status: "completed" })
      .sort({ startedAt: -1 })
      .select("agentOutputs selectedAudienceCategory startedAt");

    const memory = await MemoryContext.findOne({ niche: "ACCOUNTING" });

    return res.json({
      success: true,
      insights: {
        latestAgentOutputs: latestRun?.agentOutputs || null,
        selectedCategory: latestRun?.selectedAudienceCategory || null,
        analyzedAt: latestRun?.startedAt || null,
        memoryStats: memory ? {
          totalTitles: (memory.generatedTitles || []).length,
          totalKeywords: (memory.usedKeywords || []).length,
          totalHooks: (memory.successfulHooks || []).length,
          totalStrategies: (memory.emotionalStrategies || []).length,
          locationPatterns: (memory.locationPatterns || []).length,
          competitorGaps: (memory.competitorGapHistory || []).length,
        } : null
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch insights." });
  }
});

// ═══════════════════════════════════════════════════════════════════
// POST /api/dashboard/trigger — Manually trigger autonomous pipeline
// ═══════════════════════════════════════════════════════════════════
router.post("/trigger", async (req, res) => {
  try {
    const scheduler = getSchedulerStatus();
    if (scheduler.isRunning) {
      return res.status(409).json({ error: "Pipeline is already running." });
    }

    // Start pipeline in background (don't await)
    executeAutonomousRun("manual_trigger");

    return res.json({
      success: true,
      message: "Autonomous pipeline triggered. Monitor progress via SSE stream.",
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to trigger pipeline." });
  }
});

// ═══════════════════════════════════════════════════════════════════
// GET /api/dashboard/stream — SSE stream for live pipeline status
// ═══════════════════════════════════════════════════════════════════
router.get("/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const scheduler = getSchedulerStatus();
  if (scheduler.isRunning) {
    // If already running, stream current status
    res.write(`data: ${JSON.stringify({ step: "info", status: "running", data: { message: "Pipeline is currently running..." } })}\n\n`);
  }

  // Start pipeline with SSE writer
  try {
    const result = await runAutonomousPipeline({
      runType: "manual_trigger",
      sseWriter: (chunk) => {
        try { res.write(chunk); } catch (e) { /* client disconnected */ }
      }
    });

    res.write(`event: done\ndata: [DONE]\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ step: "error", status: "failed", data: { message: err.message } })}\n\n`);
    res.end();
  }
});

// ═══════════════════════════════════════════════════════════════════
// GET /api/dashboard/scheduler — Scheduler status
// ═══════════════════════════════════════════════════════════════════
router.get("/scheduler", async (req, res) => {
  try {
    return res.json({ success: true, scheduler: getSchedulerStatus() });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get scheduler status." });
  }
});

module.exports = router;
