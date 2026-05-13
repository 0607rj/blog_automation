const Groq = require("groq-sdk");

// Initialize Groq client with API key from environment
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * GROQ AI CLIENT
 * Standardized wrapper for Groq API calls.
 * Used by all agents in the "Groq-Only" architecture.
 */
async function groqGenerate(systemPrompt, userPrompt, options = {}) {
  const model = options.model || "llama-3.3-70b-versatile";
  const temperature = options.temperature || 0.7;
  const maxTokens = options.maxTokens || 4000;

  try {
    const completion = await groq.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw new Error(`Groq generation failed: ${error.message}`);
  }
}

module.exports = { groqGenerate };
