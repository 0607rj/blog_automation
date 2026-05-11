const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Persona Agent — STEP 3 of the pipeline.
 * Synthesizes deep psychological personas.
 * Supports "Zero-Shot Deep Synthesis" if no templates are found for the niche.
 */
async function personaAgent(selectedTemplates, businessContext) {
  const hasTemplates = selectedTemplates && selectedTemplates.length > 0;
  
  const templateContext = hasTemplates 
    ? selectedTemplates.map(t => JSON.stringify(t)).join("\n\n")
    : "NO CURATED TEMPLATES FOUND FOR THIS NICHE.";

  const prompt = `You are a world-class Consumer Psychologist and Conversion Strategist. Your task is to synthesize a deep, multi-layered buyer persona for the following business.

=== BUSINESS CONTEXT ===
Company: ${businessContext.companyName}
Product: ${businessContext.productDescription}
Features: ${(businessContext.productFeatures || []).join(", ")}
Goal: ${businessContext.businessGoal}

=== BASELINE INTELLIGENCE ===
${hasTemplates ? "We have found curated psychological templates for this domain. Use these as the foundation for synthesis:" : "WARNING: No existing templates found. You must perform 'Zero-Shot Deep Synthesis' to create a hyper-detailed psychological profile from scratch based on the business context."}

${templateContext}

TASK:
Create a unified, deeply empathetic profile of the primary buyer. Move beyond demographics. Focus on identity, insecurity, and the emotional transformation they desire.

Respond in this EXACT format:

[BEGIN_PERSONA]
BUYER_PERSONA: (a descriptive name for the persona, e.g., 'The Burned-Out Middle Manager')
CHARACTER_SNAPSHOT: (1-2 sentences on who they are and their life context)
IDENTITY_BELIEF: (1 sentence on what they believe about themselves, e.g., 'I am capable but held back by my lack of formal network')
EMOTIONAL_FRUSTRATIONS: (comma-separated list of 3-4 deep emotional pains)
HIDDEN_FEARS: (comma-separated list of 2-3 deep fears they don't openly admit)
PSYCHOLOGICAL_TRIGGERS: (comma-separated list of 3-4 emotional hooks that grab their attention)
TRUST_BUILDERS: (comma-separated list of 3-4 things that explicitly build trust with this specific person)
BEFORE_STATE: (their current emotional and practical pain state)
AFTER_STATE: (their desired emotional and practical success state)
VOICE_OF_CUSTOMER: (a direct quote in their head, showing their inner dialogue)
BUYING_BARRIER: (the #1 psychological reason they hesitate to buy)
URGENCY_TRIGGER: (what makes them feel they need this NOW, not later)
[END_PERSONA]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a consumer psychologist. You extract deep human truths. Never use generic marketing language." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1200,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_PERSONA]", "[END_PERSONA]");

  if (!block) {
    return {
      buyerPersona: "Target Audience",
      characterSnapshot: "A person looking for a solution to their specific problem.",
      identityBelief: "I deserve a better way to solve this.",
      emotionalFrustrations: ["Inefficiency", "Lack of results", "Frustration"],
      hiddenFears: ["Failing to improve", "Wasted investment"],
      psychologicalTriggers: ["Simplicity", "Proven results"],
      trustBuilders: ["Testimonials", "Clear explanations"],
      beforeState: "Frustrated and stuck.",
      afterState: "Empowered and successful.",
      voiceOfCustomer: "There must be a better way than what I'm doing now.",
      buyingBarrier: "Uncertainty of results",
      urgencyTrigger: "The cost of staying the same is too high."
    };
  }

  return {
    buyerPersona: extractField(block, "BUYER_PERSONA"),
    characterSnapshot: extractField(block, "CHARACTER_SNAPSHOT"),
    identityBelief: extractField(block, "IDENTITY_BELIEF"),
    emotionalFrustrations: extractList(block, "EMOTIONAL_FRUSTRATIONS"),
    hiddenFears: extractList(block, "HIDDEN_FEARS"),
    psychologicalTriggers: extractList(block, "PSYCHOLOGICAL_TRIGGERS"),
    trustBuilders: extractList(block, "TRUST_BUILDERS"),
    beforeState: extractField(block, "BEFORE_STATE"),
    afterState: extractField(block, "AFTER_STATE"),
    voiceOfCustomer: extractField(block, "VOICE_OF_CUSTOMER"),
    buyingBarrier: extractField(block, "BUYING_BARRIER"),
    urgencyTrigger: extractField(block, "URGENCY_TRIGGER")
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

module.exports = personaAgent;
