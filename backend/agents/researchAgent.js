const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Research Agent — STEP 4 of the pipeline.
 * Performs contextual + SEO + AI-search research.
 * Input: persona insights, product context, business goals
 * Output: keywords, trending topics, contextual queries, topic clusters, search patterns
 */
async function researchAgent(personaProfile, businessContext) {
  const prompt = `You are an SEO and content research specialist optimizing for BOTH traditional search engines AND AI search systems (ChatGPT, Perplexity, Google AI Overview).

=== BUSINESS CONTEXT ===
Company: ${businessContext.companyName || "General"}
Product: ${businessContext.productDescription || "General"}
Features: ${(businessContext.productFeatures || []).join(", ") || "Not specified"}
Business Goal: ${businessContext.businessGoal || "Generate traffic and leads"}
Target Region: ${businessContext.targetRegion || "Global"}

=== AUDIENCE INTELLIGENCE ===
Ideal Reader: ${personaProfile.buyerPersona || "General audience"}
Pain Points: ${(personaProfile.painPoints || []).join(", ")}
Goals: ${(personaProfile.goals || []).join(", ")}
What They Search: ${(personaProfile.searchIntent || []).join(", ")}
Psychological Triggers: ${(personaProfile.psychologicalTriggers || []).join(", ")}

Perform deep contextual and SEO research. Think about:
1. What would this audience type into Google?
2. What would they ask ChatGPT or Perplexity?
3. What trending topics relate to their pain points?
4. What keyword clusters can we own?

Respond in this EXACT format:

[BEGIN_RESEARCH]
KEYWORDS: (comma-separated list of 6-8 high-value SEO keywords)
TRENDING_TOPICS: (comma-separated list of 4-5 trending topics in this space)
CONTEXTUAL_QUERIES: (comma-separated list of 5-6 natural-language questions users ask on AI search platforms)
TOPIC_CLUSTERS: (comma-separated list of 4-5 related topic groups for content strategy)
SEARCH_PATTERNS: (2-3 sentences explaining how this audience searches and what intent drives them)
[END_RESEARCH]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a senior SEO researcher and AI-search optimization specialist. Provide real, specific, actionable research. Focus on intent-based research and contextual search understanding. Think like modern AI search systems." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_RESEARCH]", "[END_RESEARCH]") || raw;

  const result = {
    keywords: extractList(block, "KEYWORDS"),
    trendingTopics: extractList(block, "TRENDING_TOPICS"),
    contextualQueries: extractList(block, "CONTEXTUAL_QUERIES"),
    topicClusters: extractList(block, "TOPIC_CLUSTERS"),
    searchPatterns: extractField(block, "SEARCH_PATTERNS"),
  };

  // Fallback if everything is empty to ensure UI is never blank
  if (result.keywords.length === 0) {
    result.keywords = ["SEO Optimization", "Content Strategy", "Market Trends"];
    result.trendingTopics = ["Digital Transformation", "AI Adoption"];
    result.contextualQueries = ["How to improve results?"];
  }

  return result;
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
