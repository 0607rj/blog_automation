const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Competitor Analysis Agent — STEP 5 of the pipeline.
 * Analyzes competitors to find deep psychological gaps, persuasion failures, and emotional opportunities.
 */
async function competitorAgent(competitorWebsites, personaProfile, researchData) {
  const prompt = `You are a competitive intelligence strategist specializing in behavioral psychology and conversion copywriting. Analyze the competitors below and identify strategic emotional gaps.

=== COMPETITOR WEBSITES ===
${(competitorWebsites || []).join(", ") || "No specific competitors provided — analyze general competition in this niche"}

=== AUDIENCE INTELLIGENCE ===
Reader Profile: ${personaProfile.buyerPersona || "General audience"}
Visible Pain Symptoms: ${(personaProfile.visiblePainSymptoms || []).join(", ")}
Hidden Fears: ${(personaProfile.hiddenFears || []).join(", ")}
Objections: ${(personaProfile.objections || []).join(", ")}

=== RESEARCH DATA ===
Emotional Search Patterns: ${(researchData.emotionalSearchPatterns || []).join(", ")}
Trust Signals Required: ${(researchData.trustSignals || []).join(", ")}

Based on your knowledge of these competitors and the niche, identify:
1. What emotional positioning are competitors using, and what are they ignoring?
2. What trust gaps are they leaving that we can fill?
3. What objections are they failing to solve?
4. What emotional hooks do they completely miss?
5. Where does their content feel robotic, generic, or emotionally tone-deaf?

Respond in this EXACT format:

[BEGIN_ANALYSIS]
EMOTIONAL_GAPS: (comma-separated list of 3-4 emotions competitors fail to address)
PERSUASION_GAPS: (comma-separated list of 3-4 missing persuasion elements)
TRUST_GAPS: (comma-separated list of 3-4 ways competitors fail to build trust)
TRANSFORMATION_GAPS: (comma-separated list of 2-3 transformation stories they miss)
COMPETITOR_WEAKNESSES: (comma-separated list of 3-4 structural or emotional weaknesses in their content)
DIFFERENTIATION_OPPORTUNITY: (2-3 sentences on exactly how we should position ourselves to beat them emotionally)
[END_ANALYSIS]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a psychological competitive intelligence analyst. Do not focus on SEO keyword gaps. Focus on emotional gaps, trust failures, and persuasion weaknesses of the competitors." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1200,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_ANALYSIS]", "[END_ANALYSIS]");
  
  if (!block) {
    return {
      emotionalGaps: ["Empathy", "Understanding deep fears"],
      persuasionGaps: ["Lack of clear ROI", "No strong objection handling"],
      trustGaps: ["No verifiable proof", "Corporate speak"],
      transformationGaps: ["Focusing on features instead of the after-state"],
      competitorWeaknesses: ["Generic content", "Robotic tone"],
      strategyNotes: "Focus on deep empathy and clear transformation rather than feature lists.",
      keywordGaps: [], // For backward compatibility if any older agents need it
      missingTopics: []
    };
  }

  return {
    emotionalGaps: extractList(block, "EMOTIONAL_GAPS"),
    persuasionGaps: extractList(block, "PERSUASION_GAPS"),
    trustGaps: extractList(block, "TRUST_GAPS"),
    transformationGaps: extractList(block, "TRANSFORMATION_GAPS"),
    competitorWeaknesses: extractList(block, "COMPETITOR_WEAKNESSES"),
    strategyNotes: extractField(block, "DIFFERENTIATION_OPPORTUNITY"),
    // Keep these empty arrays for backward compatibility with orchestrator if needed
    keywordGaps: [],
    missingTopics: extractList(block, "TRANSFORMATION_GAPS")
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
