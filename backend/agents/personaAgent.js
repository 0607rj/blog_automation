const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Persona Agent — Understands the target audience deeply.
 * Input: audience type, niche
 * Output: structured persona profile
 */
async function personaAgent(audience, niche) {
  const prompt = `You are a buyer persona analyst. Given the audience and niche below, create a detailed persona profile.

AUDIENCE: ${audience}
NICHE: ${niche}

Respond in this EXACT format (fill in real values, not placeholders):

[BEGIN_PERSONA]
BUYER_PERSONA: (one sentence describing the ideal reader)
PAIN_POINTS: (comma-separated list of 4-5 real frustrations)
GOALS: (comma-separated list of 4-5 things they want to achieve)
EMOTIONS: (comma-separated list of 3-4 emotions they feel)
SEARCH_INTENT: (comma-separated list of 4-5 things they search for online)
BEHAVIORAL_PATTERNS: (comma-separated list of 3-4 habits or behaviors)
[END_PERSONA]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a marketing persona analyst. Fill in every field with real, specific data. No generic answers." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  const raw = completion.choices[0].message.content;

  // Extract between markers
  const block = extractBlock(raw, "[BEGIN_PERSONA]", "[END_PERSONA]");
  if (!block) return { buyerPersona: audience, painPoints: [], goals: [], emotions: [], searchIntent: [], behavioralPatterns: [] };

  return {
    buyerPersona: extractField(block, "BUYER_PERSONA"),
    painPoints: extractList(block, "PAIN_POINTS"),
    goals: extractList(block, "GOALS"),
    emotions: extractList(block, "EMOTIONS"),
    searchIntent: extractList(block, "SEARCH_INTENT"),
    behavioralPatterns: extractList(block, "BEHAVIORAL_PATTERNS"),
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
