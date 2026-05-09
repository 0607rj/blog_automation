const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Content Generation Agent — STEP 8 of the pipeline.
 * Generates final production-level optimized content.
 * Input: orchestrator strategy + persona psychology + research insights + competitor gaps
 * Output: SEO title, meta description, H1, H2 sections, body, CTA, conclusion, tags, FAQ
 */
async function blogGeneratorAgent(blueprint, persona, research, competitor) {
  const prompt = `You are an expert content writer creating a production-quality blog post. This content must feel HUMAN-WRITTEN, emotionally intelligent, and optimized for Google, ChatGPT, Perplexity, and AI search systems.

=== STRATEGIC BLUEPRINT ===
TITLE: ${blueprint.blogTitle}
EMOTIONAL TONE: ${blueprint.emotionalTone}
TARGET KEYWORDS: ${(blueprint.targetKeywords || []).join(", ")}
CONTENT ANGLE: ${blueprint.contentAngle}
SECTIONS TO COVER: ${(blueprint.sectionsToCover || []).join(", ")}
CTA STRATEGY: ${blueprint.ctaStrategy || "Encourage engagement"}
TARGET WORD COUNT: ${blueprint.wordCount || 800}

=== AUDIENCE PSYCHOLOGY ===
Reader: ${persona.buyerPersona || "General reader"}
Pain Points: ${(persona.painPoints || []).join(", ")}
Goals: ${(persona.goals || []).join(", ")}
Fears: ${(persona.fears || []).join(", ")}
Emotions: ${(persona.emotions || []).join(", ")}
Triggers: ${(persona.psychologicalTriggers || []).join(", ")}

=== RESEARCH CONTEXT ===
AI Search Queries to Answer: ${(research.contextualQueries || []).join(", ")}
Trending Topics: ${(research.trendingTopics || []).join(", ")}

=== COMPETITOR GAPS TO EXPLOIT ===
Missing Topics: ${(competitor.missingTopics || []).join(", ")}
Weaknesses: ${(competitor.competitorWeaknesses || []).join(", ")}

WRITING RULES:
1. Write for this SPECIFIC audience — not for everyone
2. Sound human, warm, conversational — NOT robotic AI
3. Use the emotional tone naturally throughout
4. Weave target keywords naturally — NO keyword stuffing
5. Address pain points and fears within the content
6. Use psychological triggers where appropriate
7. Optimize for AI search by directly answering contextual queries
8. Use clean formatting with proper H2 headers
9. Include actionable advice — every paragraph must add value
10. Use "you" and "your" to speak directly to the reader

Respond in this EXACT format:

[BEGIN_META]
META_DESCRIPTION: (compelling 150-160 character meta description with primary keyword)
[END_META]

[BEGIN_CONTENT]
(Write the full blog content here. ${blueprint.wordCount || 800} words minimum.
Use ## for H2 headings.
Include the sections specified in the blueprint.
End with a strong conclusion and CTA.)
[END_CONTENT]

[BEGIN_SUMMARY]
(Write 2-3 sentences summarizing the article for the blog card preview.)
[END_SUMMARY]

[BEGIN_TAGS]
(Write 5-6 keyword tags, comma separated.)
[END_TAGS]

[BEGIN_FAQ]
Q: (relevant question 1)
A: (concise 2-3 sentence answer)
Q: (relevant question 2)
A: (concise 2-3 sentence answer)
Q: (relevant question 3)
A: (concise 2-3 sentence answer)
[END_FAQ]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a human-centric content strategist and writer. Write content that feels personal, emotionally intelligent, and strategically optimized. Every sentence must serve a purpose. Never use filler. Optimize for both humans and AI search systems." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const raw = completion.choices[0].message.content;

  const content = extractBlock(raw, "[BEGIN_CONTENT]", "[END_CONTENT]");
  if (!content) throw new Error("Blog generator failed to produce content.");

  const metaDescription = extractBlock(raw, "[BEGIN_META]", "[END_META]");
  const metaDesc = metaDescription ? extractField(metaDescription, "META_DESCRIPTION") : "";

  const summary = extractBlock(raw, "[BEGIN_SUMMARY]", "[END_SUMMARY]") || "An insightful read.";

  const rawTags = extractBlock(raw, "[BEGIN_TAGS]", "[END_TAGS]");
  const tags = rawTags
    ? rawTags.split(",").map(t => t.replace(/\*\*|__|\\*|_/g, "").trim()).filter(t => t.length > 0 && t.length < 40).slice(0, 6)
    : blueprint.targetKeywords.slice(0, 6);

  // Parse FAQ
  const rawFaq = extractBlock(raw, "[BEGIN_FAQ]", "[END_FAQ]");
  const faq = parseFAQ(rawFaq);

  // Extract H2s from content
  const h2s = [];
  const h2Regex = /^##\s+(.+)$/gm;
  let match;
  while ((match = h2Regex.exec(content)) !== null) {
    h2s.push(match[1].trim());
  }

  // Extract CTA (last paragraph or section)
  const ctaMatch = content.match(/(?:^|\n)(?:##\s*(?:Call to Action|CTA|Take Action|Next Steps|What's Next|Ready to|Start Your).*?\n)([\s\S]*?)$/i);
  const cta = ctaMatch ? ctaMatch[1].trim() : blueprint.ctaStrategy || "";

  return {
    title: blueprint.blogTitle,
    metaDescription: metaDesc,
    h1: blueprint.blogTitle,
    h2s,
    content,
    summary,
    category: blueprint.category || "GENERAL",
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
