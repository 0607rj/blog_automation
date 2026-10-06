const Groq = require("groq-sdk");

// Initialize Groq client with API key from environment
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  maxRetries: 5 // free tier is 8k tokens/min; wait out 429s instead of failing the step
});

/**
 * LLM CLIENT
 * Standardized wrapper used by all agents.
 * Primary: xAI Grok (when XAI_API_KEY is set). Fallback: Groq.
 */
async function groqGenerate(systemPrompt, userPrompt, options = {}) {
  const temperature = options.temperature || 0.7;
  const maxTokens = options.maxTokens || 4000;
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  if (process.env.XAI_API_KEY) {
    try {
      return normalizeFields(await xaiGenerate(messages, temperature, maxTokens));
    } catch (error) {
      console.error("xAI Grok API Error:", error.message, "— falling back to Groq");
      if (!process.env.GROQ_API_KEY) throw new Error(`Grok generation failed: ${error.message}`);
    }
  }

  try {
    const completion = await groq.chat.completions.create({
      model: options.model || process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return normalizeFields(completion.choices[0].message.content || "");
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw new Error(`Groq generation failed: ${error.message}`);
  }
}

async function xaiGenerate(messages, temperature, maxTokens) {
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.XAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.XAI_MODEL || "grok-4.20-0309-non-reasoning",
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
    signal: AbortSignal.timeout(180000),
  });

  if (!response.ok) {
    throw new Error(`xAI API returned ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Newer models format "KEY: value" fields as markdown ("**KEY:** value") and
 * put list values on following bullet lines. Agents parse fields with
 * /KEY:\s*(.+)/, so rewrite them back to plain single-line "KEY: a, b, c".
 * The blog body inside [BEGIN_CONTENT]...[END_CONTENT] is left untouched.
 */
function normalizeFields(text) {
  const start = text.indexOf("[BEGIN_CONTENT]");
  const end = text.indexOf("[END_CONTENT]", start);
  if (start !== -1 && end !== -1) {
    return normalizeFields(text.slice(0, start)) + text.slice(start, end) + normalizeFields(text.slice(end));
  }

  const lines = text.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^[\s#*_-]*([A-Z][A-Z0-9_]{2,})[*_]*\s*:[*_]*\s*(.*)$/);
    if (!m) { out.push(lines[i]); continue; }

    let value = m[2].trim();
    if (!value) {
      // Collect bullet/numbered lines that follow an empty "KEY:" line
      const items = [];
      let last = i;
      for (let j = i + 1; j < lines.length; j++) {
        const bullet = lines[j].match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
        if (bullet) { items.push(bullet[1].replace(/^[\s*_"“”]+|[\s*_"“”]+$/g, "")); last = j; }
        else if (lines[j].trim() !== "") break;
      }
      if (items.length > 0) { value = items.join(", "); i = last; }
    }
    out.push(`${m[1]}: ${value}`);
  }
  return out.join("\n");
}

module.exports = { groqGenerate };
