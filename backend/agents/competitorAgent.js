const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Competitor Analysis Agent — STEP 5 of the pipeline.
 * Analyzes competitors and finds strategic ranking opportunities.
 * Input: competitor websites, persona insights, research data
 * Output: keyword gaps, missing topics, ranking opportunities, competitor weaknesses
 */
async function competitorAgent(competitorWebsites, personaProfile, researchData) {
  const prompt = `You are a competitive content intelligence analyst. Analyze the competitors below and identify strategic content opportunities.

=== COMPETITOR WEBSITES ===
${(competitorWebsites || []).join(", ") || "No specific competitors provided — analyze general competition in this niche"}

=== AUDIENCE INTELLIGENCE ===
Reader Profile: ${personaProfile.buyerPersona || "General audience"}
Pain Points: ${(personaProfile.painPoints || []).join(", ")}
Fears: ${(personaProfile.fears || []).join(", ")}
Search Intent: ${(personaProfile.searchIntent || []).join(", ")}

=== RESEARCH DATA ===
Keywords: ${(researchData.keywords || []).join(", ")}
Trending Topics: ${(researchData.trendingTopics || []).join(", ")}
Contextual Queries: ${(researchData.contextualQueries || []).join(", ")}

Based on your knowledge of these competitors and the niche, identify:
1. What keywords are these competitors NOT ranking for?
2. What emotional angles are they ignoring?
3. What content topics are they missing entirely?
4. Where are they weak so we can outperform them?

Respond in this EXACT format:

[BEGIN_ANALYSIS]
KEYWORD_GAPS: (comma-separated list of 4-5 keywords competitors are missing)
MISSING_TOPICS: (comma-separated list of 4-5 content topics competitors don't cover)
RANKING_OPPORTUNITIES: (comma-separated list of 3-4 specific angles we can win on)
COMPETITOR_WEAKNESSES: (comma-separated list of 4-5 weaknesses in competitor content)
UNDERSERVED_INTENT: (comma-separated list of 3-4 audience needs that competitors ignore)
STRATEGY: (2-3 sentences on how our content should differentiate and outperform)
[END_ANALYSIS]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a competitive intelligence analyst. Focus on differentiation. Identify what competitors are NOT doing well. Focus on outperforming competitors strategically through content gaps and emotional angles." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_ANALYSIS]", "[END_ANALYSIS]");
  if (!block) return { keywordGaps: [], missingTopics: [], rankingOpportunities: [], competitorWeaknesses: [], underservedIntent: [], strategyNotes: "" };

  return {
    keywordGaps: extractList(block, "KEYWORD_GAPS"),
    missingTopics: extractList(block, "MISSING_TOPICS"),
    rankingOpportunities: extractList(block, "RANKING_OPPORTUNITIES"),
    competitorWeaknesses: extractList(block, "COMPETITOR_WEAKNESSES"),
    underservedIntent: extractList(block, "UNDERSERVED_INTENT"),
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
