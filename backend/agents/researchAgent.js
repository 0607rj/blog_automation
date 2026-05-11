const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Research Agent — STEP 4 of the pipeline.
 * Performs deep human search psychology, AI-search behavior, and emotional intent analysis.
 */
async function researchAgent(personaProfile, businessContext) {
  const prompt = `You are a behavioral researcher and human search psychology specialist optimizing for BOTH traditional search engines AND AI search systems (ChatGPT, Perplexity, Google AI Overview).

=== BUSINESS CONTEXT ===
Company: ${businessContext.companyName || "General"}
Product: ${businessContext.productDescription || "General"}
Features: ${(businessContext.productFeatures || []).join(", ") || "Not specified"}
Business Goal: ${businessContext.businessGoal || "Generate traffic and leads"}

=== AUDIENCE INTELLIGENCE (PSYCHOLOGY) ===
Ideal Reader: ${personaProfile.buyerPersona || "General audience"}
Identity Belief: ${personaProfile.identityBelief || "Not specified"}
Emotional Frustrations: ${(personaProfile.emotionalFrustrations || []).join(", ")}
Hidden Fears: ${(personaProfile.hiddenFears || []).join(", ")}
Visible Pain Symptoms: ${(personaProfile.visiblePainSymptoms || []).join(", ")}
Psychological Triggers: ${(personaProfile.psychologicalTriggers || []).join(", ")}
Objections: ${(personaProfile.objections || []).join(", ")}
Trust Builders: ${(personaProfile.trustBuilders || []).join(", ")}
Transformation: From "${personaProfile.beforeState || "Pain"}" to "${personaProfile.afterState || "Success"}"

Perform deep contextual, behavioral, and AI-search research. Think about:
1. WHY do they search? (Emotional intent: fear, confusion, aspiration, urgency)
2. How do they ask questions inside AI tools like ChatGPT or Perplexity? (Conversational, long-tail)
3. What platform-specific content do they trust? (YouTube education, Reddit authenticity, etc.)
4. What transformation are they desperately seeking?

Respond in this EXACT format:

[BEGIN_RESEARCH]
EMOTIONAL_SEARCH_PATTERNS: (comma-separated list of 3-4 emotional drivers behind their searches)
AI_SEARCH_QUERIES: (comma-separated list of 4-5 conversational questions they ask ChatGPT/Perplexity)
TRADITIONAL_KEYWORDS: (comma-separated list of 4-5 high-value Google SEO keywords)
TRUST_SIGNALS: (comma-separated list of 3-4 elements they need to see to trust a piece of content)
TRANSFORMATION_PSYCHOLOGY: (2-3 sentences explaining the emotional transformation they want)
CONTENT_PREFERENCE: (comma-separated list of 3-4 formats/platforms they prefer)
[END_RESEARCH]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a behavioral researcher and AI-search optimization specialist. Analyze WHY users search, not just WHAT they search. Focus on human psychology, trust patterns, and conversational AI search behavior." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1200,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_RESEARCH]", "[END_RESEARCH]") || raw;

  const result = {
    emotionalSearchPatterns: extractList(block, "EMOTIONAL_SEARCH_PATTERNS"),
    aiSearchQueries: extractList(block, "AI_SEARCH_QUERIES"),
    keywords: extractList(block, "TRADITIONAL_KEYWORDS"), // keeping keywords for downstream compatibility
    trustSignals: extractList(block, "TRUST_SIGNALS"),
    transformationPsychology: extractField(block, "TRANSFORMATION_PSYCHOLOGY"),
    contentPreference: extractList(block, "CONTENT_PREFERENCE"),
    contextualQueries: extractList(block, "AI_SEARCH_QUERIES"), // backward compatibility
    trendingTopics: extractList(block, "EMOTIONAL_SEARCH_PATTERNS"), // backward compatibility
  };

  // Fallback if empty
  if (result.keywords.length === 0) {
    result.keywords = ["Problem solving", "Expert advice"];
    result.aiSearchQueries = ["How do I fix my problem?"];
    result.emotionalSearchPatterns = ["Frustration", "Urgency"];
    result.trustSignals = ["Social proof", "Clear steps"];
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
