const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Orchestrator Agent — The brain. Combines ALL agent outputs and decides what to write.
 * Input: persona, research, competitor analysis, memory context
 * Output: a detailed "blog blueprint" — exact instructions for the final blog agent
 */
async function orchestratorAgent(persona, research, competitor, memory) {
  const prompt = `You are a senior content strategist. Based on the intelligence gathered by multiple research agents, create a precise blog blueprint.

=== PERSONA INTELLIGENCE ===
Target Reader: ${persona.buyerPersona || "General"}
Pain Points: ${(persona.painPoints || []).join(", ")}
Goals: ${(persona.goals || []).join(", ")}
Emotions: ${(persona.emotions || []).join(", ")}

=== RESEARCH INTELLIGENCE ===
Trending Keywords: ${(research.trendingKeywords || []).join(", ")}
User Questions: ${(research.searchQueries || []).join(", ")}
Topic Clusters: ${(research.topicClusters || []).join(", ")}
User Intent: ${research.userIntentAnalysis || "Informational"}

=== COMPETITOR INTELLIGENCE ===
Competitor Weaknesses: ${(competitor.competitorWeaknesses || []).join(", ")}
Content Gaps: ${(competitor.contentGaps || []).join(", ")}
Ranking Opportunities: ${(competitor.rankingOpportunities || []).join(", ")}
Strategy: ${competitor.strategyNotes || "None"}

=== MEMORY CONTEXT ===
Previously Written Titles (DO NOT repeat): ${(memory.previousTitles || []).slice(0, 10).join(", ") || "None yet"}
Previously Used Keywords: ${(memory.previousKeywords || []).slice(0, 15).join(", ") || "None yet"}
Topics to Avoid: ${(memory.avoidTopics || []).join(", ") || "None"}
Total Blogs Generated: ${memory.totalBlogsGenerated || 0}

Now create a DETAILED blog blueprint. Respond in this EXACT format:

[BEGIN_BLUEPRINT]
BLOG_TITLE: (a compelling, SEO-optimized title that is NOT similar to any previously written title)
EMOTIONAL_TONE: (the emotional angle — e.g. empowering, reassuring, urgent)
TARGET_KEYWORDS: (comma-separated, 4-5 keywords to naturally include)
CONTENT_ANGLE: (1-2 sentences describing the unique angle this blog should take)
SECTIONS_TO_COVER: (comma-separated list of 3-4 specific sections the blog should have)
CATEGORY: (one word category)
WORD_COUNT: (recommended word count, between 400-600)
[END_BLUEPRINT]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are the chief strategist of an AI content marketing engine. Make data-driven decisions. Never suggest generic topics." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_BLUEPRINT]", "[END_BLUEPRINT]");
  if (!block) return { blogTitle: "Untitled", emotionalTone: "informative", targetKeywords: [], contentAngle: "", sectionsToCover: [], category: "GENERAL", wordCount: 400 };

  return {
    blogTitle: extractField(block, "BLOG_TITLE"),
    emotionalTone: extractField(block, "EMOTIONAL_TONE"),
    targetKeywords: extractList(block, "TARGET_KEYWORDS"),
    contentAngle: extractField(block, "CONTENT_ANGLE"),
    sectionsToCover: extractList(block, "SECTIONS_TO_COVER"),
    category: extractField(block, "CATEGORY").split(" ")[0].toUpperCase() || "GENERAL",
    wordCount: parseInt(extractField(block, "WORD_COUNT")) || 450,
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
