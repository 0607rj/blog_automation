const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Domain Detection Agent — STEP 1 of the pipeline.
 * Detects the correct business domain even if user provides incomplete/incorrect info.
 * Uses semantic understanding, not keyword matching.
 */
async function domainDetectionAgent({ companyName, productDescription, productFeatures, competitors, industry }) {
  const prompt = `You are a business domain detection specialist. Analyze the business context below and detect the most accurate domain, industry, niche, and audience type.

COMPANY NAME: ${companyName || "Not provided"}
PRODUCT DESCRIPTION: ${productDescription || "Not provided"}
PRODUCT FEATURES: ${(productFeatures || []).join(", ") || "Not provided"}
COMPETITOR WEBSITES: ${(competitors || []).join(", ") || "Not provided"}
USER-SUGGESTED INDUSTRY: ${industry || "Not provided"}

RULES:
- Use semantic understanding, not exact keyword matching.
- If the user's suggested industry is vague or wrong, correct it intelligently.
- Be specific — "AI Interview Platform" is better than "Technology".
- Provide a confidence score from 0-100.

Respond in this EXACT format:

[BEGIN_DOMAIN]
INDUSTRY: (broad industry category e.g. EdTech, Healthcare, Finance, SaaS, E-commerce)
DOMAIN: (specific domain e.g. AI Interview Platform, Fitness Coaching App, B2B Marketing Tool)
NICHE: (specific niche within the domain)
AUDIENCE_TYPE: (primary audience type e.g. students, professionals, business owners)
CONFIDENCE: (0-100 confidence score)
[END_DOMAIN]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a business intelligence analyst. Detect exact business domains with high accuracy. Never guess blindly — use contextual reasoning." },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 500,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_DOMAIN]", "[END_DOMAIN]");

  if (!block) {
    return {
      industry: industry || "General",
      domain: "General Business",
      niche: "General",
      audienceType: "General",
      confidence: 50,
    };
  }

  return {
    industry: extractField(block, "INDUSTRY") || industry || "General",
    domain: extractField(block, "DOMAIN") || "General Business",
    niche: extractField(block, "NICHE") || "General",
    audienceType: extractField(block, "AUDIENCE_TYPE") || "General",
    confidence: parseInt(extractField(block, "CONFIDENCE")) || 50,
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

module.exports = domainDetectionAgent;
