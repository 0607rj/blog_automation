const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Blog Generator Agent — The final writer.
 * Input: blueprint from orchestrator + persona context
 * Output: title, content, summary, tags, category
 */
async function blogGeneratorAgent(blueprint, persona) {
  const prompt = `You are an expert blog writer. Write a blog post based on the strategic blueprint below.

=== BLUEPRINT ===
TITLE: ${blueprint.blogTitle}
EMOTIONAL TONE: ${blueprint.emotionalTone}
TARGET KEYWORDS (weave these naturally): ${(blueprint.targetKeywords || []).join(", ")}
CONTENT ANGLE: ${blueprint.contentAngle}
SECTIONS TO COVER: ${(blueprint.sectionsToCover || []).join(", ")}
TARGET WORD COUNT: ${blueprint.wordCount || 450}

=== AUDIENCE ===
Reader: ${persona.buyerPersona || "General reader"}
Their Pain Points: ${(persona.painPoints || []).join(", ")}
Their Goals: ${(persona.goals || []).join(", ")}

RULES:
- Write for this SPECIFIC audience, not for everyone
- Sound human, warm, and conversational — NOT like AI
- Include a "Key Takeaways:" section with 4-5 bullet points using "- " prefix
- Naturally include the target keywords without stuffing
- Match the emotional tone specified

Respond in this EXACT format:

[BEGIN_CONTENT]
(Write the full blog content here. ${blueprint.wordCount || 450} words.)
[END_CONTENT]

[BEGIN_SUMMARY]
(Write 1-2 sentences summarizing the article.)
[END_SUMMARY]

[BEGIN_TAGS]
(Write 4-5 keyword tags, comma separated.)
[END_TAGS]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a human-centric blog writer. Write content that feels personal and actionable. Never use generic filler. Every sentence must add value." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 2500,
  });

  const raw = completion.choices[0].message.content;

  const content = extractBlock(raw, "[BEGIN_CONTENT]", "[END_CONTENT]");
  if (!content) throw new Error("Blog generator failed to produce content.");

  const summary = extractBlock(raw, "[BEGIN_SUMMARY]", "[END_SUMMARY]") || "An insightful read.";

  const rawTags = extractBlock(raw, "[BEGIN_TAGS]", "[END_TAGS]");
  const tags = rawTags
    ? rawTags.split(",").map(t => t.replace(/\*\*|__|\*|_/g, "").trim()).filter(t => t.length > 0 && t.length < 30).slice(0, 5)
    : blueprint.targetKeywords.slice(0, 5);

  return {
    title: blueprint.blogTitle,
    content,
    summary,
    category: blueprint.category || "GENERAL",
    tags,
  };
}

function extractBlock(text, start, end) {
  const s = text.indexOf(start);
  const e = text.indexOf(end, s + start.length);
  if (s === -1 || e === -1) return null;
  return text.substring(s + start.length, e).trim();
}

module.exports = blogGeneratorAgent;
