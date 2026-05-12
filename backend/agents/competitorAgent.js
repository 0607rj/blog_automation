/**
 * Competitor Analysis Agent — STEP 3 of the autonomous pipeline.
 * 
 * Uses: DeepSeek R1 via OpenRouter (Primary), Groq (Fallback)
 * 
 * Analyzes hardcoded primary competitors for:
 * - SWOT Analysis
 * - Emotional Gap Analysis
 * - Trust Gap Analysis
 * - SEO Gap Analysis
 */
const { deepseekGenerate } = require("./clients/openRouterClient");
const { fallbackGenerate } = require("./clients/fallbackClient");
const { PRIMARY_COMPETITORS, getCompetitorContext } = require("../config/competitors");

async function competitorAgent(competitorWebsites, personaProfile, researchData) {
  // Use hardcoded competitors + any additional ones passed in
  const allCompetitors = getCompetitorContext();
  const additionalCompetitors = (competitorWebsites || []).filter(c => 
    !PRIMARY_COMPETITORS.some(pc => pc.url.includes(c) || c.includes(pc.url))
  );

  const systemPrompt = `You are a professional competitive intelligence strategist specializing in the Indian Accounting & Finance Education market. You analyze competitors through both strategic (SWOT) and psychological (emotional/trust gaps) lenses. Focus on actionable differentiation opportunities.`;

  const userPrompt = `Perform a comprehensive competitive intelligence analysis for the Indian accounting education market.

=== PRIMARY COMPETITORS (Strictly use and compete against these) ===
${allCompetitors}
${additionalCompetitors.length > 0 ? `\nAdditional: ${additionalCompetitors.join(", ")}` : ""}

=== AUDIENCE INTELLIGENCE ===
Reader: ${personaProfile.buyerPersona || "Accounting student"}
Identity Belief: ${personaProfile.identityBelief || "Not specified"}
Target Location: ${personaProfile.targetLocation || "Kolkata"}
Pain Points: ${(personaProfile.painPoints || []).join("; ")}

=== RESEARCH CONTEXT ===
Search Intent: ${researchData.searchIntentAnalysis || (researchData.emotionalSearchPatterns || []).join(", ")}
Trust Signals Needed: ${(researchData.trustSignals || []).join(", ")}
SEO Gaps Found: ${(researchData.seoGaps || []).join(", ")}

Perform analysis using these PROFESSIONAL METHODOLOGIES:
1. SWOT Analysis
2. Emotional Gap Analysis
3. Trust Gap Analysis
4. SEO Gap Analysis
5. Messaging Weaknesses (where their copy fails psychologically)

Respond in this EXACT format:

[BEGIN_ANALYSIS]
SWOT_STRENGTHS: (3 competitor strengths, comma-separated)
SWOT_WEAKNESSES: (3 competitor weaknesses, comma-separated)
SWOT_OPPORTUNITIES: (3 market opportunities, comma-separated)
SWOT_THREATS: (2 market threats, comma-separated)
EMOTIONAL_GAPS: (3 emotions competitors fail to address, comma-separated)
TRUST_GAPS: (3 ways competitors fail to build trust, comma-separated)
SEO_GAPS: (3 SEO keyword/content gaps, comma-separated)
POSITIONING_ANALYSIS: (2-3 sentences on how competitors position themselves and the gap)
MESSAGING_WEAKNESSES: (3 messaging failures, comma-separated)
COMPETITOR_BLIND_SPOTS: (3 things competitors completely miss, comma-separated)
DIFFERENTIATION_STRATEGY: (2-3 sentences on exactly how to beat them)
CONTENT_OPPORTUNITIES: (3 content topics competitors ignore, comma-separated)
[END_ANALYSIS]`;

  let result = "";
  // try {
  //   result = await deepseekGenerate(systemPrompt, userPrompt, { temperature: 0.6, maxTokens: 2500 });
  // } catch (err) {
  //   console.error("Competitor Agent — DeepSeek failed, using fallback:", err.message);
    try {
      result = await fallbackGenerate(systemPrompt, userPrompt, { temperature: 0.6 });
    } catch (fallbackErr) {
      console.error("Competitor Agent — Fallback failed:", fallbackErr.message);
      return buildFallbackCompetitorAnalysis(personaProfile);
    }
  // }

  const block = extractBlock(result, "[BEGIN_ANALYSIS]", "[END_ANALYSIS]") || result;

  if (!block || block.length < 50) {
    return buildFallbackCompetitorAnalysis(personaProfile);
  }

  return {
    swot: {
      strengths: extractList(block, "SWOT_STRENGTHS"),
      weaknesses: extractList(block, "SWOT_WEAKNESSES"),
      opportunities: extractList(block, "SWOT_OPPORTUNITIES"),
      threats: extractList(block, "SWOT_THREATS")
    },
    emotionalGaps: extractList(block, "EMOTIONAL_GAPS"),
    trustGaps: extractList(block, "TRUST_GAPS"),
    seoGaps: extractList(block, "SEO_GAPS"),
    positioningAnalysis: extractField(block, "POSITIONING_ANALYSIS"),
    messagingWeaknesses: extractList(block, "MESSAGING_WEAKNESSES"),
    competitorBlindSpots: extractList(block, "COMPETITOR_BLIND_SPOTS"),
    strategyNotes: extractField(block, "DIFFERENTIATION_STRATEGY"),
    contentOpportunities: extractList(block, "CONTENT_OPPORTUNITIES"),
    methodology: {
      principlesUsed: ["SWOT Analysis", "Emotional Gap Analysis", "Trust Gap Analysis", "SEO Gap Analysis", "Positioning Analysis", "Messaging Weakness Analysis"],
      models: {
        primary: "Groq (Llama 3.1 70B)",
        fallback: "Groq (Llama 3.1 70B)"
      },
      competitorsAnalyzed: PRIMARY_COMPETITORS.map(c => c.name),
      approach: "7-framework professional competitive intelligence powered by Groq.",
      reasoning: `Analyzed ${PRIMARY_COMPETITORS.length} hardcoded competitors. Used analytical reasoning to find messaging weaknesses and emotional gaps they miss.`
    }
  };
}

function buildFallbackCompetitorAnalysis(personaProfile) {
  return {
    swot: {
      strengths: ["Brand recognition", "Large student base"],
      weaknesses: ["Theory-heavy content", "Generic marketing"],
      opportunities: ["Practical skill focus", "Emotional storytelling"],
      threats: ["Market saturation"]
    },
    emotionalGaps: ["Interview anxiety", "Family pressure", "Peer comparison stress"],
    trustGaps: ["No real salary data", "No relatable student stories"],
    seoGaps: ["Location-specific accounting courses", "Practical accounting jobs"],
    positioningAnalysis: "Competitors focus on curriculum features. Opportunity: position as the practical skill bridge for career transformation.",
    messagingWeaknesses: ["Too much jargon", "No empathy"],
    competitorBlindSpots: ["Career guidance", "Confidence building"],
    strategyNotes: "Focus on emotional connection and practical outcomes.",
    contentOpportunities: ["Interview anxiety content", "Practical skill demonstrations"],
    methodology: {
      principlesUsed: ["SWOT Analysis", "Emotional Gap Analysis"],
      model: "Fallback (Primary Models Unavailable)",
      competitorsAnalyzed: PRIMARY_COMPETITORS.map(c => c.name),
      approach: "Fallback competitive intelligence based on stored patterns."
    }
  };
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

module.exports = competitorAgent;
