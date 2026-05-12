/**
 * Persona Agent — STEP 3 of the autonomous pipeline.
 * 
 * Uses: Gemini (Primary), Groq (Fallback)
 * 
 * Enriches static persona templates with:
 * - Location intelligence (Kolkata/Lucknow)
 * - Current market trends
 * - Competitor messaging context
 * - Deep psychological pain points
 */
const { geminiGenerate } = require("./clients/geminiClient");
const { fallbackGenerate } = require("./clients/fallbackClient");

async function personaAgent(templates, businessContext, locationContext = {}) {
  const targetLocation = locationContext.city || businessContext.targetLocation || "Kolkata";
  const baseTemplate = templates[0] || {};

  const systemPrompt = `You are a world-class consumer psychologist and persona strategist specializing in the Indian accounting education sector. You create "living" personas that capture the deepest psychological truths of students and professionals. Your work is data-driven but emotionally profound.`;

  const userPrompt = `Enrich the following persona template with deep location-specific intelligence and current market trends for ${targetLocation}.

=== BASE TEMPLATE (Psychological Foundation) ===
Category: ${baseTemplate.audienceCategory}
 Identity Belief: ${baseTemplate.psychologyLayer?.identityBelief}
 Hidden Fears: ${(baseTemplate.painArchitecture?.hiddenFears || []).join("; ")}
 Pain Points: ${baseTemplate.psychologyLayer?.emotionalFrustration}
 Live Situations: ${(baseTemplate.painArchitecture?.liveDailyLifeSituations || []).join("; ")}

=== BUSINESS CONTEXT ===
Target Location: ${targetLocation}
Education Goal: ${businessContext.educationBackground || "Commerce"}
Primary Struggle: ${businessContext.biggestProblem || "No practical exposure"}

ENRICHMENT RULES:
1. FOUNDATION FIRST: Your primary source of truth is the BASE TEMPLATE. Preserve the core psychological identity (beliefs, fears).
2. LOCATION AS A LENS: Apply the Target Location (${targetLocation}) as a "lens". Adapt their environment, not their core character.
3. PAIN POINT DEPTH: Dive deep into the TEMPLATE pains. Explain their emotional toll in ${targetLocation}.
4. CHARACTER SNAPSHOT: 1 sentence for core identity, 1 for local life, 1 for current struggle.

Respond in this EXACT format:

[BEGIN_PERSONA]
BUYER_PERSONA: (A punchy name/label for this enriched persona)
CHARACTER_SNAPSHOT: (3 sentences that make them feel alive in ${targetLocation})
ENRICHED_IDENTITY_BELIEF: (1 deep belief that drives them)
DEEP_PAIN_ANALYSIS: (3 sentences analyzing the emotional toll of their pain points)
LOCATION_SPECIFIC_ANXIETY: (2 specific fears unique to the ${targetLocation} job market)
HIDDEN_FEARS: (4 deep fears, comma-separated)
LIVE_SITUATIONS: (3 real-life situations they experience in ${targetLocation}, semicolon-separated)
EMOTIONAL_TRIGGERS: (4 things that trigger them to take action, comma-separated)
[END_PERSONA]`;

  let result = "";
  // try {
  //   result = await geminiGenerate(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 2500 });
  // } catch (err) {
  //   console.error("Persona Agent — Gemini failed, using fallback:", err.message);
    try {
      result = await fallbackGenerate(systemPrompt, userPrompt, { temperature: 0.7 });
    } catch (fallbackErr) {
      console.error("Persona Agent — Fallback failed:", fallbackErr.message);
      result = "";
    }
  // }

  const block = extractBlock(result, "[BEGIN_PERSONA]", "[END_PERSONA]") || result;

  return {
    buyerPersona: extractField(block, "BUYER_PERSONA"),
    characterSnapshot: extractField(block, "CHARACTER_SNAPSHOT"),
    identityBelief: extractField(block, "ENRICHED_IDENTITY_BELIEF"),
    painPointAnalysis: extractField(block, "DEEP_PAIN_ANALYSIS"),
    locationAnxiety: extractField(block, "LOCATION_SPECIFIC_ANXIETY"),
    hiddenFears: extractList(block, "HIDDEN_FEARS"),
    liveSituations: extractListSemicolon(block, "LIVE_SITUATIONS"),
    emotionalTriggers: extractList(block, "EMOTIONAL_TRIGGERS"),
    painPoints: baseTemplate.painArchitecture?.hiddenFears || [],
    methodology: {
      approach: "Psychological Persona Enrichment",
      model: "Groq (Llama 3.1 70B)",
      reasoning: `Enriched the base template with deep localized context. Focused on the emotional toll of their ${baseTemplate.painArchitecture?.hiddenFears?.length || 0} pain points to create a "living" profile that drives high-conversion content.`
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

function extractListSemicolon(block, key) {
  const val = extractField(block, key);
  return val ? val.split(";").map(s => s.trim()).filter(s => s.length > 0) : [];
}

module.exports = personaAgent;
