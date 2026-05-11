const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Content Generation Agent — STEP 8 of the pipeline.
 * Generates final production-level optimized content.
 * Focuses on human-level emotional persuasion writing.
 */
async function blogGeneratorAgent(blueprint, persona, research, competitor) {
  const prompt = `You are a world-class conversion copywriter and persuasion psychologist. Write a production-quality, deeply emotional, and highly persuasive blog post.
This content must feel 100% HUMAN-WRITTEN. It should not sound like generic AI.

=== STRATEGIC BLUEPRINT ===
TITLE: ${blueprint.blogTitle}
EMOTIONAL HOOK: ${blueprint.emotionalHook || blueprint.emotionalTone}
TRANSFORMATION NARRATIVE: ${blueprint.transformationStory || blueprint.contentAngle}
TRUST STRATEGY: ${blueprint.trustBuildingStrategy}
SECTIONS TO COVER: ${(blueprint.sectionsToCover || []).join(", ")}
CTA STRATEGY: ${blueprint.ctaStrategy}
TARGET KEYWORDS: ${(blueprint.targetKeywords || []).join(", ")}
TARGET WORD COUNT: ${blueprint.wordCount || 800}

=== AUDIENCE PSYCHOLOGY ===
Reader: ${persona.buyerPersona || "General reader"}
Identity Belief: ${persona.identityBelief || "Not specified"}
Deep Frustrations: ${(persona.emotionalFrustrations || []).join(", ")}
Hidden Fears: ${(persona.hiddenFears || []).join(", ")}
Psychological Triggers: ${(persona.psychologicalTriggers || []).join(", ")}

=== RESEARCH & COMPETITOR INTELLIGENCE ===
AI Search Queries to Answer: ${(research.aiSearchQueries || []).join(", ")}
Competitor Weaknesses to Exploit: ${(competitor.competitorWeaknesses || []).join(", ")}
Trust Signals to Include: ${(research.trustSignals || []).join(", ")}

WRITING RULES:
1. STRUCTURE: Start with exactly one # H1 Title. Use ## H2 for main sections and ### H3 for deeper insights.
2. EMPATHY FIRST: Hook the reader immediately by validating their deepest frustrations. Show them you understand their hidden fears.
3. TRANSFORMATION: Guide the reader emotionally from their current pain to their desired success state.
4. NO ROBOTIC CLICHÉS: DO NOT use phrases like "In today's fast-paced digital landscape", "Unleash the power", "Dive deep", "Ultimate guide", or "A testament to". Speak like a real human expert talking to a friend over coffee.
5. TRUST & AUTHORITY: Build trust naturally through specific, relatable examples. Break down complex ideas. Avoid corporate jargon.
6. PERSUASIVE CTA: Make the Call to Action feel like the natural, emotionally obvious next step, not a sales pitch.
7. AI-SEARCH FRIENDLY: Directly answer the AI search queries naturally in the text so AI engines index the answers.
8. READABILITY: Use short paragraphs (2-3 sentences), bullet points, and bold text for emphasis.

Respond in this EXACT format:

[BEGIN_META]
META_DESCRIPTION: (compelling 150-160 character meta description with a psychological hook)
[END_META]

[BEGIN_CONTENT]
(Write the full blog content here. ${blueprint.wordCount || 800} words minimum.
Use ## for H2 headings.
Include the sections specified in the blueprint.
End with a highly persuasive CTA.)
[END_CONTENT]

[BEGIN_SUMMARY]
(Write 2-3 sentences summarizing the article's emotional transformation for the blog card preview.)
[END_SUMMARY]

[BEGIN_TAGS]
(Write 5-6 keyword tags, comma separated.)
[END_TAGS]

[BEGIN_FAQ]
Q: (relevant conversational question 1)
A: (concise, human-sounding 2-3 sentence answer)
Q: (relevant conversational question 2)
A: (concise, human-sounding 2-3 sentence answer)
Q: (relevant conversational question 3)
A: (concise, human-sounding 2-3 sentence answer)
[END_FAQ]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a master conversion copywriter and consumer psychologist. Write content that feels deeply personal, emotionally intelligent, and strategically persuasive. Every sentence must drive the reader toward transformation." },
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
    : (blueprint.targetKeywords || []).slice(0, 6);

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
