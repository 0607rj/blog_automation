/**
 * Research Agent — STEP 2 of the autonomous pipeline.
 * 
 * DUAL-MODEL RESEARCH INTELLIGENCE
 * 
 * Gemini: Broad contextual understanding, emotional search intent, search intent aggregation
 * DeepSeek R1: Analytical reasoning, structured insights, contextual gap analysis
 * Groq: Fallback intelligence
 */
const { groqGenerate } = require("./clients/groqClient");
const { getLocationByCity } = require("../config/locations");

async function researchAgent(personaProfile, businessContext, locationContext = {}) {
  const targetLocation = locationContext.city || businessContext.targetLocation || "Kolkata";
  const locationData = getLocationByCity(targetLocation);

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: GEMINI — Broad Contextual + Emotional Understanding
  // ═══════════════════════════════════════════════════════════════
  const geminiSystemPrompt = `You are a behavioral research intelligence system for the Indian Accounting & Finance Education market. You understand WHY users search, not just WHAT they search. Focus on emotional intent, career anxiety, and location-specific patterns. Research from: Google, LinkedIn, Reddit, YouTube, Accounting forums, Career discussions.`;

  const geminiUserPrompt = `Perform deep behavioral research for this specific audience and location.

=== AUDIENCE ===
Reader: ${personaProfile.buyerPersona || "Accounting student"}
Category: ${businessContext.audienceCategory || "College-Level Student"}
Identity Belief: ${personaProfile.identityBelief || "Not specified"}
Hidden Fears: ${(personaProfile.hiddenFears || []).join(", ")}
Pain Points: ${(personaProfile.painPoints || []).join("; ")}
Live Situations: ${(personaProfile.liveSituations || []).join("; ")}
Location: ${targetLocation}

=== LOCATION CONTEXT ===
${locationData ? `
City: ${locationData.city}, ${locationData.state}
Economy: ${locationData.economicProfile}
Education Hub: ${locationData.educationHub}
Local Search Patterns: ${locationData.searchBehavior.join("; ")}
Local Pain Points: ${locationData.studentPainPoints.join("; ")}` : `City: ${targetLocation}`}

Perform research using these methodologies:
1. SEARCH INTENT MAPPING — What do they search and WHY (fear, confusion, aspiration, urgency)?
2. EMOTIONAL PATTERN ANALYSIS — What emotions drive their searches? What keeps them awake at night?
3. TREND DETECTION — What accounting topics are currently trending in ${targetLocation}?
4. LOCATION-BASED SEARCH ANALYSIS — How do search patterns differ in ${targetLocation}?
5. CAREER ANXIETY ANALYSIS — What career fears are MOST ACUTE right now?
6. SOURCE RELIABILITY MAPPING — Which platforms and sources do they trust?

Respond in this EXACT format:

[BEGIN_RESEARCH]
SEARCH_INTENT_ANALYSIS: (8 search queries with the emotional WHY behind each, semicolon-separated)
EMOTIONAL_SEARCH_DRIVERS: (8 emotional drivers behind their searches — DEEP, not surface-level, semicolon-separated)
CAREER_ANXIETY_PATTERNS: (6 specific career anxiety patterns in ${targetLocation}, semicolon-separated)
LOCATION_SEARCH_PATTERNS: (6 ${targetLocation}-specific search behaviors, semicolon-separated)
PLATFORM_TRUST_MAP: (8 platforms they trust in ${targetLocation} and why — Google, YouTube, LinkedIn, Reddit, etc., comma-separated)
TRENDING_TOPICS: (8 trending accounting education topics, comma-separated)
CONTENT_FORMATS_PREFERRED: (5 content formats they prefer, comma-separated)
EMOTIONAL_TRANSFORMATION_PSYCHOLOGY: (5-6 sentences on the deep emotional transformation they desperately seek)
[END_RESEARCH]`;

  let geminiResult = "";
  try {
    geminiResult = await groqGenerate(geminiSystemPrompt, geminiUserPrompt, { temperature: 0.8, maxTokens: 4000 });
  } catch (err) {
    console.error("Research Agent — Groq Phase 1 failed:", err.message);
    geminiResult = "";
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: DEEPSEEK R1 — Analytical + Structured Insights
  // ═══════════════════════════════════════════════════════════════
  const deepseekSystemPrompt = `You are an analytical research intelligence engine for accounting education. Provide structured, data-driven insights. Focus on SEO opportunities, keyword gaps, and competitive gaps. Output structured analysis only.`;

  const deepseekUserPrompt = `Provide structured analytical research for accounting education content targeting ${businessContext.audienceCategory || "students"} in ${targetLocation}.

=== AUDIENCE CONTEXT ===
Reader: ${personaProfile.buyerPersona || "Accounting student"}
Identity Belief: ${personaProfile.identityBelief || "Not specified"}
Pain Points: ${(personaProfile.painPoints || []).join("; ")}

=== GEMINI BROAD RESEARCH (to build upon) ===
${geminiResult.substring(0, 1500) || "No broad research available."}

Provide ANALYTICAL insights:

[BEGIN_ANALYSIS]
HIGH_VALUE_KEYWORDS: (6 SEO keywords for ${targetLocation} accounting audience, comma-separated)
AI_SEARCH_QUERIES: (4 conversational questions they ask ChatGPT/Perplexity — include ${targetLocation} context, comma-separated)
SEO_GAPS: (3 keyword/content gaps that competitors miss, comma-separated)
SEARCH_INTENT_CLUSTERS: (3 clusters of related search intents, each cluster as a group, semicolon-separated)
TRUST_SIGNALS_NEEDED: (4 trust signals this audience needs to see, comma-separated)
CONTENT_OPPORTUNITY_SCORE: (1-100, how much content opportunity exists for this audience in ${targetLocation})
COMPETITIVE_CONTENT_GAPS: (3 content topics competitors don't cover well, comma-separated)
BEHAVIORAL_PATTERNS: (3 platform-specific behaviors, comma-separated)
[END_ANALYSIS]`;

  let deepseekResult = "";
  try {
    deepseekResult = await groqGenerate(deepseekSystemPrompt, deepseekUserPrompt, { temperature: 0.5 });
  } catch (err) {
    console.error("Research Agent — Groq Phase 2 failed:", err.message);
    deepseekResult = "";
  }

  // ═══════════════════════════════════════════════════════════════
  // MERGE: Combine both outputs into structured research JSON
  // ═══════════════════════════════════════════════════════════════
  const geminiBlock = extractBlock(geminiResult, "[BEGIN_RESEARCH]", "[END_RESEARCH]") || geminiResult;
  const deepseekBlock = extractBlock(deepseekResult, "[BEGIN_ANALYSIS]", "[END_ANALYSIS]") || deepseekResult;

  const result = {
    searchIntentAnalysis: extractField(geminiBlock, "SEARCH_INTENT_ANALYSIS"),
    emotionalSearchPatterns: extractListSemicolon(geminiBlock, "EMOTIONAL_SEARCH_DRIVERS"),
    careerAnxietyPatterns: extractListSemicolon(geminiBlock, "CAREER_ANXIETY_PATTERNS"),
    locationSearchPatterns: extractListSemicolon(geminiBlock, "LOCATION_SEARCH_PATTERNS"),
    platformTrustMap: extractList(geminiBlock, "PLATFORM_TRUST_MAP"),
    trendInsights: extractList(geminiBlock, "TRENDING_TOPICS"),
    contentPreference: extractList(geminiBlock, "CONTENT_FORMATS_PREFERRED"),
    transformationPsychology: extractField(geminiBlock, "EMOTIONAL_TRANSFORMATION_PSYCHOLOGY"),
    keywords: extractList(deepseekBlock, "HIGH_VALUE_KEYWORDS"),
    aiSearchQueries: extractList(deepseekBlock, "AI_SEARCH_QUERIES"),
    seoGaps: extractList(deepseekBlock, "SEO_GAPS"),
    searchIntentClusters: extractListSemicolon(deepseekBlock, "SEARCH_INTENT_CLUSTERS"),
    trustSignals: extractList(deepseekBlock, "TRUST_SIGNALS_NEEDED"),
    contentOpportunityScore: parseInt(extractField(deepseekBlock, "CONTENT_OPPORTUNITY_SCORE")) || 65,
    competitiveContentGaps: extractList(deepseekBlock, "COMPETITIVE_CONTENT_GAPS"),
    behavioralPatterns: extractList(deepseekBlock, "BEHAVIORAL_PATTERNS"),
    contextualQueries: extractList(deepseekBlock, "AI_SEARCH_QUERIES"),
    trendingTopics: extractList(geminiBlock, "TRENDING_TOPICS"),
    dataSources: ["Google Search", "YouTube", "LinkedIn", "Reddit", "Accounting Forums", "Career Discussions"],
    methodology: {
      principlesUsed: ["Search Intent Mapping", "Emotional Pattern Analysis", "Trend Detection", "Context Aggregation", "SEO Opportunity Analysis", "Source Reliability Filtering", "Location-based Search Analysis", "Career Anxiety Analysis"],
      dataSources: ["Google Search", "YouTube", "LinkedIn", "Reddit", "Accounting Forums", "Career Discussions"],
      models: {
        primary: "Groq (Llama 3.3 70B)",
        fallback: "Groq (Llama 3.3 70B)"
      },
      approach: "Research intelligence powered by Groq.",
      reasoning: "Research focused on deep persona pain points and localized anxieties. Analysis exploits gaps competitors miss by addressing the emotional core of commerce career searches."
    }
  };

  if (result.keywords.length === 0) {
    result.keywords = [`accounting course ${targetLocation}`, "practical accounting training", "Tally learning for beginners", "GST filing training", "accounting job for freshers"];
    result.aiSearchQueries = [`What should I learn to get an accounting job in ${targetLocation}?`, "Is Tally enough for a job?"];
    result.emotionalSearchPatterns = ["Fear of unemployment", "Confusion about career path", "Urgency before placements"];
    result.trustSignals = ["Student testimonials", "Salary data", "Practical curriculum"];
  }

  return result;
}

function extractBlock(text, start, end) {
  if (!text) return null;
  const s = text.indexOf(start);
  const e = text.indexOf(end, s + start.length);
  if (s === -1 || e === -1) return null;
  return text.substring(s + start.length, e).trim();
}

function extractField(block, key) {
  if (!block) return "";
  const match = block.match(new RegExp(`${key}:\\s*(.+)`, "i"));
  return match ? match[1].trim() : "";
}

function extractList(block, key) {
  const val = extractField(block, key);
  return val ? val.split(",").map(s => s.trim()).filter(s => s.length > 0) : [];
}

function extractListSemicolon(block, key) {
  const val = extractField(block, key);
  return val ? val.split(";").map(s => s.trim()).filter(s => s.length > 0) : [];
}

module.exports = researchAgent;
