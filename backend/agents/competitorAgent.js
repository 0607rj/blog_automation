const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Competitor Analysis Agent — Identifies content gaps and ranking opportunities.
 * Input: research data, niche
 * Output: weaknesses, gaps, opportunities, strategy
 */
async function competitorAgent(researchData, niche) {
  const prompt = `You are a competitive content analyst. Analyze the content landscape for the niche below and identify opportunities.

NICHE: ${niche}
TRENDING KEYWORDS: ${(researchData.trendingKeywords || []).join(", ")}
WHAT USERS ASK: ${(researchData.searchQueries || []).join(", ")}

Analyze what existing blogs in this niche typically do WRONG or MISS, then respond in this EXACT format:

[BEGIN_ANALYSIS]
COMPETITOR_WEAKNESSES: (comma-separated list of 4-5 common weaknesses in competitor content)
CONTENT_GAPS: (comma-separated list of 4-5 topics competitors don't cover well)
RANKING_OPPORTUNITIES: (comma-separated list of 3-4 specific angles we can win on)
STRATEGY: (2-3 sentences on how our content should be different and better)
[END_ANALYSIS]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a competitive intelligence analyst. Do NOT suggest duplicating competitors. Identify gaps and opportunities to create BETTER content." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_ANALYSIS]", "[END_ANALYSIS]");
  if (!block) return { competitorWeaknesses: [], contentGaps: [], rankingOpportunities: [], strategyNotes: "" };

  return {
    competitorWeaknesses: extractList(block, "COMPETITOR_WEAKNESSES"),
    contentGaps: extractList(block, "CONTENT_GAPS"),
    rankingOpportunities: extractList(block, "RANKING_OPPORTUNITIES"),
    strategyNotes: extractField(block, "STRATEGY"),
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

module.exports = competitorAgent;
