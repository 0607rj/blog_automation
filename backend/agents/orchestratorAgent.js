const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Orchestrator Agent — STEP 7 of the pipeline. The brain.
 * Combines ALL agent outputs and decides the final content strategy.
 * Input: persona, research, competitor analysis, memory context
 * Output: detailed blog blueprint — exact instructions for the content agent
 */
async function orchestratorAgent(persona, research, competitor, memory, domainResult) {
  const detectedCategory = (domainResult.industry || domainResult.domain || "GENERAL").split(" ")[0].toUpperCase();
  const prompt = `You are a senior content strategist and the BRAIN of an AI marketing engine. Based on intelligence from 5 specialized agents, create a precise content strategy.

=== PERSONA INTELLIGENCE ===
Target Reader: ${persona.buyerPersona || "General"}
Pain Points: ${(persona.painPoints || []).join(", ")}
Goals: ${(persona.goals || []).join(", ")}
Fears: ${(persona.fears || []).join(", ")}
Emotions: ${(persona.emotions || []).join(", ")}
Psychological Triggers: ${(persona.psychologicalTriggers || []).join(", ")}

=== RESEARCH INTELLIGENCE ===
Keywords: ${(research.keywords || []).join(", ")}
Trending Topics: ${(research.trendingTopics || []).join(", ")}
Contextual AI Queries: ${(research.contextualQueries || []).join(", ")}
Topic Clusters: ${(research.topicClusters || []).join(", ")}
Search Patterns: ${research.searchPatterns || "General informational"}

=== COMPETITOR INTELLIGENCE ===
Keyword Gaps: ${(competitor.keywordGaps || []).join(", ")}
Missing Topics: ${(competitor.missingTopics || []).join(", ")}
Competitor Weaknesses: ${(competitor.competitorWeaknesses || []).join(", ")}
Ranking Opportunities: ${(competitor.rankingOpportunities || []).join(", ")}
Underserved Intent: ${(competitor.underservedIntent || []).join(", ")}
Strategy Notes: ${competitor.strategyNotes || "None"}

=== MEMORY CONTEXT ===
Previously Written Titles (DO NOT repeat): ${(memory.previousTitles || []).slice(0, 10).join(", ") || "None yet"}
Previously Used Keywords: ${(memory.previousKeywords || []).slice(0, 15).join(", ") || "None yet"}
Topics to Avoid: ${(memory.avoidTopics || []).join(", ") || "None"}
Total Blogs Generated: ${memory.totalBlogsGenerated || 0}

Now create a DETAILED content strategy. Think strategically:
- Which keyword gap should we target?
- Which emotional angle will resonate most?
- Which competitor weakness should we exploit?
- What title will stand out in search results AND AI answers?

Respond in this EXACT format:

[BEGIN_BLUEPRINT]
BLOG_TITLE: (a compelling, SEO-optimized title that is NOT similar to any previously written title)
EMOTIONAL_TONE: (the emotional angle — e.g. empowering, reassuring, urgent, motivational)
TARGET_KEYWORDS: (comma-separated, 5-6 keywords to naturally include)
CONTENT_ANGLE: (2-3 sentences describing the unique angle this blog should take)
SECTIONS_TO_COVER: (comma-separated list of 4-5 specific H2 sections the blog should have)
CTA_STRATEGY: (1-2 sentences describing what action the reader should take)
RANKING_STRATEGY: (1-2 sentences on how this blog should rank — what gap it fills)
CATEGORY: (one word category)
WORD_COUNT: (recommended word count, between 800-1200)
[END_BLUEPRINT]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are the chief strategist of an AI content marketing engine. Make data-driven decisions. Prioritize audience psychology, ranking opportunities, and engagement. Never suggest generic topics. Think like a CMO." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_BLUEPRINT]", "[END_BLUEPRINT]");
  if (!block) return { blogTitle: "Untitled", emotionalTone: "informative", targetKeywords: [], contentAngle: "", sectionsToCover: [], ctaStrategy: "", rankingStrategy: "", category: "GENERAL", wordCount: 800 };

  return {
    blogTitle: extractField(block, "BLOG_TITLE"),
    emotionalTone: extractField(block, "EMOTIONAL_TONE"),
    targetKeywords: extractList(block, "TARGET_KEYWORDS"),
    contentAngle: extractField(block, "CONTENT_ANGLE"),
    sectionsToCover: extractList(block, "SECTIONS_TO_COVER"),
    ctaStrategy: extractField(block, "CTA_STRATEGY"),
    rankingStrategy: extractField(block, "RANKING_STRATEGY"),
    category: extractField(block, "CATEGORY").split(" ")[0].toUpperCase() || detectedCategory,
    wordCount: parseInt(extractField(block, "WORD_COUNT")) || 800,
  };
}

function extractBlock(text, start, end) {
  const s = text.indexOf(start);
  const e = text.indexOf(end, s + start.length);
  if (s === -1 || e === -1) return null;
  return text.substring(s + start.length, e).trim();
}

function extractField(block, key) {
  const match = block.match(new RegExp(`${key}:\\s*(.+)`, "i"));
  return match ? match[1].trim() : "";
}

function extractList(block, key) {
  const val = extractField(block, key);
  return val ? val.split(",").map(s => s.trim()).filter(s => s.length > 0) : [];
}

module.exports = orchestratorAgent;
