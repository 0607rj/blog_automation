const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Research Agent — Performs contextual + SEO research.
 * Input: persona profile, niche
 * Output: keywords, search queries, topic clusters, intent analysis
 */
async function researchAgent(personaProfile, niche) {
  const prompt = `You are an SEO and content research specialist. Based on the persona and niche below, perform contextual research.

NICHE: ${niche}
TARGET AUDIENCE: ${personaProfile.buyerPersona || "General audience"}
THEIR PAIN POINTS: ${(personaProfile.painPoints || []).join(", ")}
WHAT THEY SEARCH FOR: ${(personaProfile.searchIntent || []).join(", ")}

Perform research and respond in this EXACT format:

[BEGIN_RESEARCH]
TRENDING_KEYWORDS: (comma-separated list of 6-8 high-value keywords for this niche)
SEARCH_QUERIES: (comma-separated list of 5-6 questions users ask on Google, ChatGPT, and Perplexity about this niche)
TOPIC_CLUSTERS: (comma-separated list of 4-5 related topic groups for content strategy)
USER_INTENT: (2-3 sentences explaining what this audience really wants when they search)
[END_RESEARCH]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a senior SEO researcher. Provide real, specific, actionable research. Optimize for both traditional search engines AND AI search engines like Perplexity." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_RESEARCH]", "[END_RESEARCH]");
  if (!block) return { trendingKeywords: [], searchQueries: [], topicClusters: [], userIntentAnalysis: "" };

  return {
    trendingKeywords: extractList(block, "TRENDING_KEYWORDS"),
    searchQueries: extractList(block, "SEARCH_QUERIES"),
    topicClusters: extractList(block, "TOPIC_CLUSTERS"),
    userIntentAnalysis: extractField(block, "USER_INTENT"),
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

module.exports = researchAgent;
