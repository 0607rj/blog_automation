/**
 * AUTONOMOUS PIPELINE
 * The complete autonomous execution flow that runs every 15 days.
 * 
 * AGENT ORDER:
 * 1. Opportunity Analysis Agent (select audience + location)
 * 2. Persona Intelligence Agent (Gemini + Groq Fallback)
 * 3. Research Agent (Gemini + DeepSeek R1 + Groq Fallback)
 * 4. Competitor Agent (DeepSeek R1 + Groq Fallback)
 * 5. Orchestrator Agent (Groq)
 * 6. Content Generation Agent (Groq)
 * 7. Validation Agent (Groq)
 * 8. MongoDB Storage
 * 9. Memory Update + Frontend Auto Update
 */
const { v4: uuidv4 } = require("uuid");

// Models
const Blog = require("../models/Blog");
const PipelineRun = require("../models/PipelineRun");
const OpportunityScore = require("../models/OpportunityScore");
const Persona = require("../models/Persona");
const ResearchHistory = require("../models/ResearchHistory");
const CompetitorAnalysis = require("../models/CompetitorAnalysis");

// Agents
const opportunityAgent = require("./opportunityAgent");
const domainDetectionAgent = require("./domainDetectionAgent");
const personaTemplateLoader = require("./personaTemplateLoader");
const personaAgent = require("./personaAgent");
const researchAgent = require("./researchAgent");
const competitorAgent = require("./competitorAgent");
const { memoryAgent, updateMemory } = require("./memoryAgent");
const orchestratorAgent = require("./orchestratorAgent");
const blogGeneratorAgent = require("./blogGeneratorAgent");
const validationAgent = require("./validationAgent");

// Config
const { getCompetitorURLs } = require("../config/competitors");

/**
 * Run the complete autonomous pipeline.
 * @param {object} options - { runType, sseWriter, onStepUpdate }
 * @returns {object} Pipeline run result
 */
async function runAutonomousPipeline(options = {}) {
  const runId = uuidv4();
  const runType = options.runType || "autonomous";
  const sseWriter = options.sseWriter || null;
  const onStepUpdate = options.onStepUpdate || (() => {});

  const sendStep = (step, status, data) => {
    const logEntry = { step, status, message: data?.message || step, timestamp: new Date() };
    onStepUpdate(logEntry);
    if (sseWriter) {
      sseWriter(`data: ${JSON.stringify({ step, status, data })}\n\n`);
    }
  };

  // Create pipeline run record
  const pipelineRun = new PipelineRun({
    runId,
    runType,
    status: "running",
    startedAt: new Date(),
    stepLog: []
  });

  try {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // ══════════════════════════════════════════════════════════════
    // STEP 0: OPPORTUNITY ANALYSIS — Select Audience + Location
    // ══════════════════════════════════════════════════════════════
    sendStep("opportunity", "running", {
      message: "Analyzing market opportunities across 3 audience categories...",
      methodology: "Groq Opportunity Intelligence (Llama 3.1 70B)"
    });
    pipelineRun.currentStep = "opportunity";

    const opportunityResult = await opportunityAgent();
    
    const selectedCategory = opportunityResult.selectedCategory;
    const selectedLocation = opportunityResult.selectedLocation;

    // Save opportunity scores
    const oppScore = new OpportunityScore({
      targetLocation: selectedLocation,
      categoryScores: opportunityResult.categoryScores,
      selectedCategory,
      selectionReasoning: opportunityResult.selectionReasoning,
      marketTrends: opportunityResult.marketTrends,
      competitorWeaknesses: opportunityResult.competitorWeaknesses,
      emotionalOpportunities: opportunityResult.emotionalOpportunities,
      seoGaps: opportunityResult.seoGaps,
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      methodology: opportunityResult.methodology
    });
    await oppScore.save();

    pipelineRun.selectedAudienceCategory = selectedCategory;
    pipelineRun.selectedLocation = selectedLocation;
    pipelineRun.opportunityScore = (opportunityResult.categoryScores.find(c => c.category === selectedCategory) || {}).totalScore || 0;
    pipelineRun.selectionReasoning = opportunityResult.selectionReasoning;
    pipelineRun.agentOutputs = { opportunityAnalysis: opportunityResult };

    sendStep("opportunity", "done", {
      selectedCategory,
      scores: opportunityResult.categoryScores?.map(c => ({ category: c.category, score: c.totalScore })),
      reasoning: opportunityResult.selectionReasoning,
      methodology: opportunityResult.methodology
    });
    await delay(1000);

    // Build business context from autonomous selection
    const businessContext = {
      companyName: "AccountIQ",
      productDescription: "Autonomous AI-powered accounting education content",
      productFeatures: ["Practical accounting training", "GST filing", "Tally ERP", "Interview preparation"],
      competitors: getCompetitorURLs(),
      audienceCategory: selectedCategory,
      educationBackground: selectedCategory === "Working Professional" ? "Commerce Graduate" : "Commerce",
      experienceLevel: selectedCategory === "Working Professional" ? "Experienced" : "Beginner",
      primaryGoal: selectedCategory === "Working Professional" ? "Increase Salary" : "Get First Job",
      biggestProblem: selectedCategory === "12th Pass Commerce Student" ? "No career direction" : 
                      selectedCategory === "Working Professional" ? "Career stagnation" : "No practical accounting exposure",
      businessGoal: "Generate SEO traffic and student enrollment",
      industry: "Accounting & Finance Education",
      targetLocation: selectedLocation
    };

    // ══════════════════════════════════════════════════════════════
    // STEP 1: DOMAIN DETECTION (Deterministic)
    // ══════════════════════════════════════════════════════════════
    sendStep("domainDetection", "running", {
      message: `Routing to ${selectedCategory} sub-domain...`,
      methodology: "Deterministic Domain Routing"
    });
    const domainResult = domainDetectionAgent(businessContext);
    sendStep("domainDetection", "done", domainResult);
    await delay(500);

    // ══════════════════════════════════════════════════════════════
    // STEP 2: PERSONA TEMPLATE LOADER
    // ══════════════════════════════════════════════════════════════
    sendStep("personaLoader", "running", {
      message: `Loading ${selectedCategory} persona template...`,
      methodology: "Intelligent Template Selection"
    });
    const selectedTemplates = personaTemplateLoader(domainResult);
    sendStep("personaLoader", "done", {
      count: selectedTemplates.length,
      labels: selectedTemplates.map(t => t.label),
      matchedCategory: selectedCategory
    });
    await delay(500);

    // ══════════════════════════════════════════════════════════════
    // STEP 3: PERSONA AGENT (Enriched with Pains + Locations)
    // ══════════════════════════════════════════════════════════════
    sendStep("persona", "running", {
      message: `Enriching ${selectedCategory} persona with psychological context...`,
      methodology: "Psychological Persona Enrichment (Groq/Llama 3.1)"
    });
    pipelineRun.currentStep = "persona";

    const personaResult = await personaAgent(selectedTemplates, businessContext, { city: selectedLocation });
    
    await Persona.create({
      domain: domainResult.domain,
      companyName: businessContext.companyName,
      selectedTemplates: selectedTemplates.map(t => t.label),
      profile: personaResult,
    });

    pipelineRun.agentOutputs.personaIntelligence = personaResult;
    sendStep("persona", "done", personaResult);
    await delay(1000);

    // ══════════════════════════════════════════════════════════════
    // STEP 4: RESEARCH AGENT (Deep Pain Point Analysis)
    // ══════════════════════════════════════════════════════════════
    sendStep("research", "running", {
      message: `Dual-model research for ${selectedCategory}...`,
      methodology: "8-Methodology Research Intelligence (Groq/Llama 3.1)"
    });
    pipelineRun.currentStep = "research";

    const researchResult = await researchAgent(personaResult, businessContext, { city: selectedLocation });
    
    await ResearchHistory.create({
      domain: domainResult.domain,
      companyName: businessContext.companyName,
      keywords: researchResult.keywords,
      trendingTopics: researchResult.trendInsights,
      contextualQueries: researchResult.aiSearchQueries,
      searchPatterns: researchResult.searchIntentAnalysis,
    });

    pipelineRun.agentOutputs.researchIntelligence = researchResult;
    sendStep("research", "done", researchResult);
    await delay(1000);

    // ══════════════════════════════════════════════════════════════
    // STEP 5: COMPETITOR AGENT (Hardcoded Competitor URLs)
    // ══════════════════════════════════════════════════════════════
    sendStep("competitor", "running", {
      message: "Analyzing 9 hardcoded competitors for emotional/trust gaps...",
      methodology: "7-Framework Competitive Intelligence (Groq/Llama 3.1)"
    });
    pipelineRun.currentStep = "competitor";

    const competitorResult = await competitorAgent(
      businessContext.competitors,
      personaResult,
      researchResult
    );
    
    await CompetitorAnalysis.create({
      domain: domainResult.domain,
      companyName: businessContext.companyName,
      competitorWebsites: businessContext.competitors,
      keywordGaps: competitorResult.keywordGaps,
      missingTopics: competitorResult.missingTopics,
      competitorWeaknesses: competitorResult.competitorWeaknesses,
      strategyNotes: competitorResult.strategyNotes,
    });

    pipelineRun.agentOutputs.competitorIntelligence = competitorResult;
    sendStep("competitor", "done", competitorResult);
    await delay(1000);

    // ══════════════════════════════════════════════════════════════
    // STEP 6: MEMORY AGENT (Self-Learning)
    // ══════════════════════════════════════════════════════════════
    sendStep("memory", "running", {
      message: "Querying self-learning memory system...",
      methodology: "MongoDB-Backed Long-Term Memory"
    });
    const memoryResult = await memoryAgent(domainResult.domain);
    sendStep("memory", "done", memoryResult);
    await delay(500);

    // ══════════════════════════════════════════════════════════════
    // STEP 7: ORCHESTRATOR (Central Brain)
    // ══════════════════════════════════════════════════════════════
    sendStep("orchestrator", "running", {
      message: "Central brain synthesizing all intelligence...",
      methodology: "Multi-Intelligence Synthesis (Groq)"
    });
    pipelineRun.currentStep = "orchestrator";

    const blueprint = await orchestratorAgent(personaResult, researchResult, competitorResult, memoryResult, domainResult);

    pipelineRun.agentOutputs.orchestratorBlueprint = blueprint;
    sendStep("orchestrator", "done", blueprint);
    await delay(1000);

    // ══════════════════════════════════════════════════════════════
    // STEP 8: CONTENT GENERATION (No Location Mention Rule)
    // ══════════════════════════════════════════════════════════════
    sendStep("generator", "running", {
      message: `Writing psychology-driven content (Location privacy active)...`,
      methodology: "Persona-Driven Content Synthesis (Groq)"
    });
    pipelineRun.currentStep = "generator";

    const blogResult = await blogGeneratorAgent(blueprint, personaResult, researchResult, competitorResult);
    sendStep("generator", "done", { title: blogResult.title, wordCount: blogResult.wordCount });
    await delay(1000);

    // ══════════════════════════════════════════════════════════════
    // STEP 9: VALIDATION (7-Dimension)
    // ══════════════════════════════════════════════════════════════
    sendStep("validation", "running", {
      message: "Running 7-dimension quality validation...",
      methodology: "Multi-Dimension Quality Assessment (Groq)"
    });
    pipelineRun.currentStep = "validation";

    const validationResult = await validationAgent(blogResult, blueprint, personaResult, researchResult, competitorResult);

    pipelineRun.agentOutputs.validationResult = validationResult;
    sendStep("validation", "done", validationResult);
    await delay(500);

    // ══════════════════════════════════════════════════════════════
    // STEP 10: SAVE TO MONGODB
    // ══════════════════════════════════════════════════════════════
    sendStep("saving", "running", { message: "Saving to MongoDB..." });

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
      // Autonomous fields
      audienceCategory: selectedCategory,
      targetLocation: selectedLocation, // Stored in backend but not mentioned in text
      generatedBy: runType === "manual_trigger" ? "manual" : "autonomous",
      pipelineRunId: runId,
      opportunityScore: pipelineRun.opportunityScore,
      seoKeywords: blueprint.targetKeywords || [],
      emotionalHook: blueprint.emotionalHook || "",
      createdAt: new Date()
    });
    
    console.log(`💾 Attempting to save blog: "${blog.title}"...`);
    const savedBlog = await blog.save();
    console.log(`✅ Blog saved successfully with ID: ${savedBlog._id}`);

    // Update memory with self-learning data
    await updateMemory(
      domainResult.domain,
      blogResult.title,
      blogResult.tags,
      blogResult.category,
      blueprint.contentAngle,
      {
        hook: blueprint.emotionalHook,
        personaInsight: `${selectedCategory}: ${personaResult.buyerPersona}`,
        competitorPattern: competitorResult.strategyNotes,
        emotionalStrategy: blueprint.emotionalAngle,
        researchInsight: researchResult.transformationPsychology
      }
    );

    // Update pipeline run
    pipelineRun.status = "completed";
    pipelineRun.generatedBlogId = savedBlog._id;
    pipelineRun.generatedBlogTitle = savedBlog.title;
    pipelineRun.completedAt = new Date();
    pipelineRun.durationMs = Date.now() - pipelineRun.startedAt.getTime();
    await pipelineRun.save();

    const finalResult = {
      runId,
      status: "completed",
      blogId: savedBlog._id,
      title: savedBlog.title,
      category: savedBlog.category,
      audienceCategory: selectedCategory,
      validationScore: validationResult.score,
      wordCount: blogResult.wordCount,
      readingTime,
      opportunityScore: pipelineRun.opportunityScore,
      durationMs: pipelineRun.durationMs,
    };

    sendStep("complete", "done", finalResult);

    return finalResult;

  } catch (err) {
    console.error("❌ Autonomous Pipeline Error:", err);
    pipelineRun.status = "failed";
    pipelineRun.error = err.message;
    pipelineRun.failedAtStep = pipelineRun.currentStep;
    pipelineRun.completedAt = new Date();
    pipelineRun.durationMs = Date.now() - pipelineRun.startedAt.getTime();
    await pipelineRun.save();

    sendStep("error", "failed", { message: err.message, failedAt: pipelineRun.currentStep });

    return { runId, status: "failed", error: err.message, failedAt: pipelineRun.currentStep };
  }
}

module.exports = { runAutonomousPipeline };
