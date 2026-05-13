const { groqGenerate } = require("./clients/groqClient");

/**
 * Content Generation Agent — STEP 8 of the pipeline.
 * Generates accounting/finance domain content using:
 * persona psychology, competitor gaps, research intent,
 * emotional hooks, trust-building, and transformation storytelling.
 */
async function blogGeneratorAgent(blueprint, persona, research, competitor) {
  const prompt = `You are a world-class content strategist for ACCOUNTING & FINANCE education in India. Write a production-quality blog that deeply connects with the reader's psychology.

=== STRATEGIC BLUEPRINT ===
TITLE: ${blueprint.blogTitle}
EMOTIONAL HOOK: ${blueprint.emotionalHook || blueprint.emotionalTone}
EMOTIONAL ANGLE: ${blueprint.emotionalAngle || "Empathy + practical roadmap"}
TRANSFORMATION: ${blueprint.transformationStory || blueprint.contentAngle}
TRUST STRATEGY: ${blueprint.trustBuildingStrategy}
SECTIONS: ${(blueprint.sectionsToCover || []).join(", ")}
CTA: ${blueprint.ctaStrategy}
KEYWORDS: ${(blueprint.targetKeywords || []).join(", ")}
WORD COUNT: ${blueprint.wordCount || 1000}

=== AUDIENCE PSYCHOLOGY ===
Reader: ${persona.buyerPersona || "Accounting student"}
Identity Belief: ${persona.identityBelief || ""}
Hidden Fears: ${Array.isArray(persona.hiddenFears) ? persona.hiddenFears.join("; ") : (persona.hiddenFears || "")}
Hidden Pains: ${Array.isArray(persona.painPoints) ? persona.painPoints.join("; ") : ""}
Live Situations: ${Array.isArray(persona.liveSituations) ? persona.liveSituations.slice(0, 2).join("; ") : ""}
Emotional Triggers: ${Array.isArray(persona.emotionalTriggers) ? persona.emotionalTriggers.join(", ") : (persona.emotionalTriggers || "")}

=== RESEARCH INTELLIGENCE ===
AI Search Queries to Answer: ${(research.aiSearchQueries || []).join(", ")}
Trust Signals to Include: ${(research.trustSignals || []).join(", ")}

=== COMPETITOR GAPS TO EXPLOIT ===
Emotional Gaps: ${(competitor.emotionalGaps || []).join(", ")}
Trust Gaps: ${(competitor.trustGaps || []).join(", ")}
Blind Spots: ${(competitor.competitorBlindSpots || []).join(", ")}

WRITING RULES:
1. STRUCTURE: Start with # H1 Title. Use ## H2 for main sections and ### H3 for deeper insights.
2. EMPATHY FIRST: Open by validating their EXACT pain. Use live situations from the persona (e.g., "You just closed LinkedIn after seeing your classmate's placement update...").
3. PSYCHOLOGY-DRIVEN: Every section must connect to an emotional trigger or hidden fear.
4. TRANSFORMATION: Guide from current pain to desired success with concrete steps.
5. TRUST-BUILDING: Include specific examples, data points, and relatable scenarios.
6. NO CLICHÉS: Never use "In today's fast-paced world", "Unleash", "Dive deep", "Ultimate guide". Write like a mentor talking to the reader.
7. ACCOUNTING CONTEXT: All examples, scenarios, and advice must be specific to accounting/finance/commerce careers.
8. AI-SEARCH FRIENDLY: Naturally answer the AI search queries within the text.
9. READABILITY: Short paragraphs, bullet points, bold text for emphasis.
10. COMPETITOR DIFFERENTIATION: Address the emotional gaps competitors miss.
11. NO LOCATIONS: DO NOT mention the city name (e.g., Kolkata, Lucknow) or target state in the blog title, H1, H2s, or content. The location is only for backend intelligence. Keep the content universally applicable to the Indian market while using the intelligence derived from the location.
12. DEPTH: Address the "too much data" and "many pain points" provided in the persona template. Don't skip the deep psychological struggles.

Respond in this EXACT format:

[BEGIN_META]
META_DESCRIPTION: (150-160 char description with emotional hook for accounting audience)
[END_META]

[BEGIN_CONTENT]
(Full blog content. ${blueprint.wordCount || 1000} words minimum. Accounting/finance focused. Deeply emotional and practical.)
[END_CONTENT]

[BEGIN_SUMMARY]
(2-3 sentences summarizing the emotional transformation for the blog card preview.)
[END_SUMMARY]

[BEGIN_TAGS]
(5-6 accounting-specific keyword tags, comma separated.)
[END_TAGS]

[BEGIN_FAQ]
Q: (accounting-relevant conversational question 1)
A: (concise 2-3 sentence answer)
Q: (accounting-relevant conversational question 2)
A: (concise 2-3 sentence answer)
Q: (accounting-relevant conversational question 3)
A: (concise 2-3 sentence answer)
[END_FAQ]`;

  let raw = "";
  try {
    raw = await groqGenerate(
      "You are a master content writer for the Indian accounting education market. Your content feels like a warm, knowledgeable mentor speaking directly to the reader's deepest insecurities and ambitions about their accounting career. Every paragraph drives emotional transformation. Use accounting-specific examples (GST, Tally, balance sheets, audit, taxation).",
      prompt,
      { model: "llama-3.3-70b-versatile", temperature: 0.7, maxTokens: 4000 }
    );
  } catch (err) {
    console.error("Blog Generator Agent — Groq generation failed:", err.message);
    throw new Error("Content generation failed: " + err.message);
  }

  let content = extractBlock(raw, "[BEGIN_CONTENT]", "[END_CONTENT]");
  
  // Robust fallback: If [BEGIN_CONTENT] is missing, try to find the longest block of text
  if (!content && raw.length > 500) {
    const parts = raw.split(/\[BEGIN_CONTENT\]|\[END_CONTENT\]/);
    content = parts.length >= 2 ? parts[1].trim() : raw.trim();
  }

  if (!content || content.length < 100) throw new Error("Blog generator failed to produce meaningful content.");

  const metaDescription = extractBlock(raw, "[BEGIN_META]", "[END_META]");
  const metaDesc = metaDescription ? extractField(metaDescription, "META_DESCRIPTION") : "";

  const summary = extractBlock(raw, "[BEGIN_SUMMARY]", "[END_SUMMARY]") || "An insightful guide for accounting professionals.";

  const rawTags = extractBlock(raw, "[BEGIN_TAGS]", "[END_TAGS]");
  const tags = rawTags
    ? rawTags.split(",").map(t => t.replace(/\*\*|__|\\*|_/g, "").trim()).filter(t => t.length > 0 && t.length < 40).slice(0, 6)
    : (blueprint.targetKeywords || []).slice(0, 6);

  const rawFaq = extractBlock(raw, "[BEGIN_FAQ]", "[END_FAQ]");
  const faq = parseFAQ(rawFaq);

  const h2s = [];
  const h2Regex = /^##\s+(.+)$/gm;
  let match;
  while ((match = h2Regex.exec(content)) !== null) {
    h2s.push(match[1].trim());
  }

  const ctaMatch = content.match(/(?:^|\n)(?:##\s*(?:Call to Action|CTA|Take Action|Next Steps|What's Next|Ready to|Start Your|Your Next).*?\n)([\s\S]*?)$/i);
  const cta = ctaMatch ? ctaMatch[1].trim() : blueprint.ctaStrategy || "";

  return {
    title: blueprint.blogTitle,
    metaDescription: metaDesc,
    h1: blueprint.blogTitle,
    h2s,
    content,
    summary,
    category: blueprint.category || "ACCOUNTING",
    tags,
    faq,
    cta,
    wordCount: content.split(/\s+/).length,
  };
}

function parseFAQ(rawFaq) {
  if (!rawFaq) return [];
  const faq = [];
  const lines = rawFaq.split("\n").filter(l => l.trim());
  let currentQ = null;

  for (const line of lines) {
    const qMatch = line.match(/^Q:\s*(.+)/i);
    const aMatch = line.match(/^A:\s*(.+)/i);
    if (qMatch) {
      currentQ = qMatch[1].trim();
    } else if (aMatch && currentQ) {
      faq.push({ question: currentQ, answer: aMatch[1].trim() });
      currentQ = null;
    }
  }
  return faq;
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

module.exports = blogGeneratorAgent;
