const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Persona Agent — STEP 3 of the pipeline.
 * Combines selected persona templates and extracts UNIFIED audience intelligence.
 * Input: selected persona templates + business/product context
 * Output: combined pain points, emotions, fears, goals, search intent, behavior patterns, psychological triggers
 */
async function personaAgent(selectedPersonas, businessContext) {
  // Aggregate raw template data
  const allPainPoints = selectedPersonas.flatMap(p => p.painPoints || []);
  const allEmotions = selectedPersonas.flatMap(p => p.emotions || []);
  const allFears = selectedPersonas.flatMap(p => p.fears || []);
  const allGoals = selectedPersonas.flatMap(p => p.goals || []);
  const allSearchIntent = selectedPersonas.flatMap(p => p.searchIntent || []);
  const allBehaviors = selectedPersonas.flatMap(p => p.behaviorPatterns || []);
  const allTriggers = selectedPersonas.flatMap(p => p.psychologicalTriggers || []);
  const personaLabels = selectedPersonas.map(p => p.label).join(", ");

  const prompt = `You are a buyer persona intelligence analyst. You have been given data from ${selectedPersonas.length} audience personas relevant to this business. Synthesize them into ONE unified audience profile.

=== BUSINESS CONTEXT ===
Company: ${businessContext.companyName || "Not provided"}
Product: ${businessContext.productDescription || "Not provided"}
Features: ${(businessContext.productFeatures || []).join(", ") || "Not provided"}
Business Goal: ${businessContext.businessGoal || "Not provided"}
Target Region: ${businessContext.targetRegion || "Global"}
Tone: ${businessContext.tonePreference || "Professional"}

=== PERSONA TEMPLATES LOADED ===
Templates: ${personaLabels}

=== RAW PAIN POINTS (from all personas) ===
${allPainPoints.join(" | ")}

=== RAW EMOTIONS ===
${allEmotions.join(" | ")}

=== RAW FEARS ===
${allFears.join(" | ")}

=== RAW GOALS ===
${allGoals.join(" | ")}

=== RAW SEARCH INTENT ===
${allSearchIntent.join(" | ")}

Now SYNTHESIZE this into a unified profile that is specific to the business context. Remove duplicates, find common patterns, and make it product-specific.

Respond in this EXACT format:

[BEGIN_PERSONA]
BUYER_PERSONA: (2 sentences describing the ideal unified reader for THIS specific business)
PAIN_POINTS: (comma-separated list of 5-6 most relevant pain points specific to this product)
EMOTIONS: (comma-separated list of 4-5 dominant emotions)
FEARS: (comma-separated list of 4-5 core fears)
GOALS: (comma-separated list of 5-6 goals aligned with the product)
SEARCH_INTENT: (comma-separated list of 5-6 things they would search for related to this product)
BEHAVIORAL_PATTERNS: (comma-separated list of 4-5 behaviors)
PSYCHOLOGICAL_TRIGGERS: (comma-separated list of 4-5 triggers that would make them click/buy/engage)
[END_PERSONA]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a marketing persona analyst specializing in audience psychology. Extract emotionally meaningful, product-specific insights. No generic analysis." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_PERSONA]", "[END_PERSONA]");

  if (!block) {
    return {
      buyerPersona: `Unified audience from: ${personaLabels}`,
      painPoints: [...new Set(allPainPoints)].slice(0, 6),
      emotions: [...new Set(allEmotions)].slice(0, 5),
      fears: [...new Set(allFears)].slice(0, 5),
      goals: [...new Set(allGoals)].slice(0, 6),
      searchIntent: [...new Set(allSearchIntent)].slice(0, 6),
      behavioralPatterns: [...new Set(allBehaviors)].slice(0, 5),
      psychologicalTriggers: [...new Set(allTriggers)].slice(0, 5),
    };
  }

  return {
    buyerPersona: extractField(block, "BUYER_PERSONA"),
    painPoints: extractList(block, "PAIN_POINTS"),
    emotions: extractList(block, "EMOTIONS"),
    fears: extractList(block, "FEARS"),
    goals: extractList(block, "GOALS"),
    searchIntent: extractList(block, "SEARCH_INTENT"),
    behavioralPatterns: extractList(block, "BEHAVIORAL_PATTERNS"),
    psychologicalTriggers: extractList(block, "PSYCHOLOGICAL_TRIGGERS"),
  };
}

// ─── Helpers ───
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

module.exports = personaAgent;
