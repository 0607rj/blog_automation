const Blog = require("../models/Blog");
const MemoryContext = require("../models/MemoryContext");

/**
 * Memory Agent — STEP 6 of the pipeline.
 * Retrieves historical context from MongoDB.
 * NO Groq call — purely database-driven.
 * Prevents repetitive content generation.
 */
async function memoryAgent(domain) {
  const domainKey = (domain || "GENERAL").toUpperCase();

  // Get existing memory context for this domain
  let memory = await MemoryContext.findOne({ niche: domainKey });

  // If no memory exists, build it from existing blogs
  if (!memory) {
    const existingBlogs = await Blog.find().sort({ createdAt: -1 }).limit(50);

    memory = {
      generatedTitles: existingBlogs.map(b => b.title),
      usedKeywords: existingBlogs.flatMap(b => b.tags || []),
      usedCategories: [...new Set(existingBlogs.map(b => b.category).filter(Boolean))],
      avoidTopics: [],
      strategyHistory: [],
      successfulTopics: [],
      successfulKeywords: [],
    };
  }

  return {
    previousTitles: memory.generatedTitles || [],
    previousKeywords: [...new Set(memory.usedKeywords || [])],
    previousCategories: memory.usedCategories || [],
    avoidTopics: memory.avoidTopics || [],
    strategyHistory: memory.strategyHistory || [],
    successfulTopics: memory.successfulTopics || [],
    successfulKeywords: memory.successfulKeywords || [],
    totalBlogsGenerated: (memory.generatedTitles || []).length,
  };
}

/**
 * Update memory after a blog is generated.
 */
async function updateMemory(domain, blogTitle, keywords, category, strategy) {
  const domainKey = (domain || "GENERAL").toUpperCase();

  let memory = await MemoryContext.findOne({ niche: domainKey });

  if (!memory) {
    memory = new MemoryContext({
      niche: domainKey,
      generatedTitles: [],
      usedKeywords: [],
      usedCategories: [],
      avoidTopics: [],
      strategyHistory: [],
      successfulTopics: [],
      successfulKeywords: [],
    });
  }

  memory.generatedTitles.push(blogTitle);
  memory.usedKeywords.push(...(keywords || []));
  if (category && !memory.usedCategories.includes(category)) {
    memory.usedCategories.push(category);
  }
  if (strategy) memory.strategyHistory.push(strategy);
  memory.lastUpdated = new Date();

  await memory.save();
}

module.exports = { memoryAgent, updateMemory };
