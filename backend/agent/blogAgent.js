const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function blogAgent(category, description, userTitle, existingCategories = []) {
  console.log(`🤖 Agent processing request...`);

  // If user explicitly chose a category, we use it directly — no AI guessing needed
  const forcedCategory = category ? category.trim().toUpperCase() : null;

  const categoriesText = existingCategories.length > 0
    ? existingCategories.join(", ")
    : "Technology, Health, Lifestyle, Business, General";


  // Topic comes FIRST so AI knows what it's writing about.
  // Category comes LAST with unique markers so it NEVER gets confused.
  const prompt = `You are a blog writer. Fill in each section below. Use simple, friendly English.

TITLE: ${userTitle || "Write a good title for this topic"}

TOPIC: ${description || "General Insights"}

[BEGIN_CONTENT]
Write 3-4 paragraphs (300-350 words). Use simple words.
Include "Quick Points:" with 4-5 bullet points using "- " prefix.
[END_CONTENT]

[BEGIN_SUMMARY]
Write 1-2 sentences describing the article.
[END_SUMMARY]

[BEGIN_TAGS]
Write 4-5 keyword tags, comma separated.
[END_TAGS]

[BEGIN_CATEGORY]
Existing categories: ${categoriesText}
Based on the TOPIC above, write ONLY ONE single word category.
If the topic fits an existing category, use that exact word.
If not, write a new single word for it.
Output only the category word below this line:
[END_CATEGORY]`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a blog writer. Fill in every section. Replace instruction text with actual content. Do not copy the instructions back.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const raw = completion.choices[0].message.content;

    // ─── Extract helper — uses start + end offsets to avoid overlaps ───
    const extractBetween = (text, startMarker, endMarker) => {
      const startIdx = text.indexOf(startMarker);
      if (startIdx === -1) return null;
      const contentStart = startIdx + startMarker.length;
      const endIdx = text.indexOf(endMarker, contentStart);
      if (endIdx === -1) return null;
      return text.substring(contentStart, endIdx).trim();
    };

    // Extract Title
    let title = userTitle || "";
    if (!title) {
      const titleMatch = raw.match(/TITLE:\s*(.+)/i);
      title = titleMatch ? titleMatch[1].trim() : description || "Untitled Story";
    }

    // Extract Content
    const content = extractBetween(raw, "[BEGIN_CONTENT]", "[END_CONTENT]");
    if (!content) throw new Error("Could not extract content. Please try again.");

    // Extract Summary
    const summary = extractBetween(raw, "[BEGIN_SUMMARY]", "[END_SUMMARY]") || "An interesting read.";

    // Extract Tags
    const rawTags = extractBetween(raw, "[BEGIN_TAGS]", "[END_TAGS]");
    let tags = [];
    if (rawTags) {
      tags = rawTags
        .split(",")
        .map(t => t.replace(/\*\*|__|\*|_/g, "").trim())
        .filter(t => t.length > 0 && t.length < 30)
        .slice(0, 5);
    }

    // Extract Category — unique markers, comes last so AI knows the topic
    const rawCategory = extractBetween(raw, "[BEGIN_CATEGORY]", "[END_CATEGORY]");
    let finalCategory = "GENERAL";

    if (rawCategory) {
      // Take only the last line (the actual category word, not the instructions)
      const lines = rawCategory.split("\n").map(l => l.trim()).filter(l => l.length > 0);
      const lastLine = lines[lines.length - 1] || "";

      finalCategory = lastLine
        .replace(/\*\*|__|\*|_/g, "")
        .replace(/category:|topic:|output:|word:/gi, "")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .trim()
        .split(" ")[0]  // only first word
        .toUpperCase();
    }

    // Safety: if extraction gave garbage, fall back to first word of description
    if (!finalCategory || finalCategory.length < 2) {
      finalCategory = description
        ? description.trim().split(" ")[0].toUpperCase()
        : "GENERAL";
    }

    console.log(`✅ Blog: "${title}" | Category: ${forcedCategory || finalCategory} | Tags: ${tags.join(", ")}`);
    return { title, content, summary, category: forcedCategory || finalCategory, tags };


  } catch (err) {
    throw err;
  }
}

module.exports = blogAgent;
