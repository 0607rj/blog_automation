const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Domain Detection Agent — STEP 1 of the pipeline.
 * Detects the correct business domain even if user provides incomplete/incorrect info.
 * REFINED: Hardened extraction to prevent generic "General" fallbacks.
 */
async function domainDetectionAgent({ companyName, productDescription, productFeatures, competitors, industry }) {
  const prompt = `You are a world-class Business Intelligence and Market Analyst. Analyze the business context below and detect the MOST PRECISE domain, industry, and niche. 

CRITICAL RULE: DO NOT use broad terms like "Technology" or "Services" if a more specific niche is detectable. NEVER return "General" unless there is absolutely no information.

=== BUSINESS CONTEXT ===
COMPANY: ${companyName || "Not provided"}
PRODUCT DESCRIPTION: ${productDescription || "Not provided"}
FEATURES: ${(productFeatures || []).join(", ") || "Not provided"}
COMPETITORS: ${(competitors || []).join(", ") || "Not provided"}
USER-SUGGESTED INDUSTRY: ${industry || "Not provided"}

=== EXTRACTION RULES ===
1. INDUSTRY: The broad market sector (e.g., EdTech, Fintech, Healthcare, D2C E-commerce, B2B SaaS).
2. DOMAIN: The specific functional space (e.g., AI Recruitment, Predictive Analytics, Mental Health Coaching).
3. NICHE: The ultra-specific target segment (e.g., Tier-3 College Students in India, SMB Retailers, Remote Tech Managers).
4. AUDIENCE_TYPE: Who exactly pays for this (e.g., Job Seekers, HR Managers, Solo Founders).

Respond in this EXACT format:

[BEGIN_DOMAIN]
INDUSTRY: (specific industry)
DOMAIN: (specific domain)
NICHE: (ultra-specific niche)
AUDIENCE_TYPE: (precise audience)
CONFIDENCE: (0-100)
[END_DOMAIN]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a master business analyst. You hate generic terms. You find the deepest niche possible from even small clues." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_DOMAIN]", "[END_DOMAIN]");

  // Robust parsing: If the block exists, extract fields. If not, use whatever we have.
  const result = {
    industry: industry || "B2B Services",
    domain: "Specialized Solution",
    niche: "Undiscovered Niche",
    audienceType: "Niche Audience",
    confidence: 50,
  };

  if (block) {
    const ind = extractField(block, "INDUSTRY");
    const dom = extractField(block, "DOMAIN");
    const nic = extractField(block, "NICHE");
    const aud = extractField(block, "AUDIENCE_TYPE");
    const conf = parseInt(extractField(block, "CONFIDENCE"));

    if (ind && ind.toLowerCase() !== "general") result.industry = ind;
    if (dom && dom.toLowerCase() !== "general") result.domain = dom;
    if (nic && nic.toLowerCase() !== "general") result.niche = nic;
    if (aud && aud.toLowerCase() !== "general") result.audienceType = aud;
    if (!isNaN(conf)) result.confidence = conf;
  }

  // Final validation: Ensure nothing is "General"
  if (result.industry.toLowerCase() === "general") result.industry = "B2B Services";
  if (result.domain.toLowerCase() === "general") result.domain = "High-Value Solution";
  if (result.niche.toLowerCase() === "general") result.niche = "Specific Market Segment";

  return result;
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
