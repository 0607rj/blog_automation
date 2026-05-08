const Blog = require("../models/Blog");
const MemoryContext = require("../models/MemoryContext");

/**
 * Memory Agent — Retrieves historical context from MongoDB.
 * NO Groq call — purely database-driven.
 * Input: niche
 * Output: past titles, used keywords, categories, avoid-topics
 */
async function memoryAgent(niche) {
  // Get existing memory context for this niche
  let memory = await MemoryContext.findOne({ niche: niche.toUpperCase() });

  // If no memory exists, build it from existing blogs
  if (!memory) {
    const existingBlogs = await Blog.find().sort({ createdAt: -1 }).limit(50);

    memory = {
      generatedTitles: existingBlogs.map(b => b.title),
      usedKeywords: existingBlogs.flatMap(b => b.tags || []),
      usedCategories: [...new Set(existingBlogs.map(b => b.category).filter(Boolean))],
      avoidTopics: [],
      strategyHistory: [],
    };
  }

  return {
    previousTitles: memory.generatedTitles || [],
    previousKeywords: [...new Set(memory.usedKeywords || [])],
    previousCategories: memory.usedCategories || [],
    avoidTopics: memory.avoidTopics || [],
    strategyHistory: memory.strategyHistory || [],
    totalBlogsGenerated: (memory.generatedTitles || []).length,
  };
}

/**
 * Update memory after a blog is generated.
 */
async function updateMemory(niche, blogTitle, keywords, category, strategy) {
  const nicheKey = niche.toUpperCase();

  let memory = await MemoryContext.findOne({ niche: nicheKey });

  if (!memory) {
    memory = new MemoryContext({
      niche: nicheKey,
      generatedTitles: [],
      usedKeywords: [],
      usedCategories: [],
      avoidTopics: [],
      strategyHistory: [],
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
