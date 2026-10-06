/**
 * xAI GROK CLIENT
 * Standardized wrapper used by all agents.
 * Requires XAI_API_KEY; model can be overridden with XAI_MODEL.
 */
async function grokGenerate(systemPrompt, userPrompt, options = {}) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("XAI_API_KEY is not set.");

  const temperature = options.temperature || 0.7;
  const maxTokens = options.maxTokens || 4000;

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model || process.env.XAI_MODEL || "grok-4.20-0309-non-reasoning",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(180000),
    });

    if (!response.ok) {
      throw new Error(`xAI API returned ${response.status}: ${(await response.text()).slice(0, 300)}`);
    }

    const data = await response.json();
    return normalizeFields(data.choices?.[0]?.message?.content || "");
  } catch (error) {
    console.error("xAI Grok API Error:", error.message);
    throw new Error(`Grok generation failed: ${error.message}`);
  }
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

module.exports = { grokGenerate };
