const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function blogAgent(category, description, userTitle, existingCategories = []) {
  console.log(`🤖 Agent processing request...`);

  const categoriesText = existingCategories.length > 0
    ? `Existing Categories: ${existingCategories.join(", ")}`
    : "Existing Categories: Technology, Health, Lifestyle, Business";

  // ── IMPORTANT: Topic comes FIRST so the AI knows what it's writing about
  // ── Category comes LAST so the AI can categorise AFTER reading the topic
  const prompt = `Write a blog post using the format below. Fill in each section. Use plain English.

TITLE: ${userTitle || "Write a good title for this topic"}

TOPIC: ${description || "General Insights"}

---START CONTENT---
Write 3-4 paragraphs (300-350 words). Use simple words.
Include a section called "Quick Points:" with 4-5 bullet points using "- " prefix.
---END CONTENT---

---START SUMMARY---
Write 1-2 sentences describing the article.
---END SUMMARY---

---START TAGS---
List 4-5 short keyword tags, comma separated. Example: React, Web Dev, Frontend
---END TAGS---

${categoriesText}
---START CATEGORY---
Now that you have written the blog above, pick the single best category word for it.
Rules:
- If the topic matches one of the Existing Categories listed above, use THAT EXACT WORD.
- If it is a new topic not in the list, invent ONE new short word for it (e.g. Cartoons, Banking, Romance).
- Write ONLY the category word. Nothing else. No quotes. No punctuation.
---END CATEGORY---`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful blog writer. Follow the format exactly. Fill in every section between its markers.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const raw = completion.choices[0].message.content;

    // ─── Extract each section ───
    const extractBetween = (text, startMarker, endMarker) => {
      const start = text.indexOf(startMarker);
      const end = text.indexOf(endMarker, start + startMarker.length);
      if (start === -1 || end === -1) return null;
      return text.substring(start + startMarker.length, end).trim();
    };

    // Extract Title
    let title = userTitle || "";
    if (!title) {
      const titleMatch = raw.match(/TITLE:\s*(.+)/i);
      title = titleMatch ? titleMatch[1].trim() : description || "Untitled Story";
    }

    // Extract Content
    const content = extractBetween(raw, "---START CONTENT---", "---END CONTENT---");
    if (!content) throw new Error("Could not extract content.");

    // Extract Summary
    const summary = extractBetween(raw, "---START SUMMARY---", "---END SUMMARY---") || "A professional read.";

    // Extract Tags
    const rawTags = extractBetween(raw, "---START TAGS---", "---END TAGS---");
    let tags = [];
    if (rawTags) {
      tags = rawTags
        .split(",")
        .map(t => t.replace(/\*\*|__|\*|_/g, "").trim())
        .filter(t => t.length > 0)
        .slice(0, 5);
    }

    // Extract Category — comes LAST in prompt so AI knows what it wrote about
    const rawCategory = extractBetween(raw, "---START CATEGORY---", "---END CATEGORY---");
    let finalCategory = description
      ? description.trim().split(" ")[0].toUpperCase()  // fallback: use first word of topic
      : "GENERAL";

    if (rawCategory) {
      finalCategory = rawCategory
        .replace(/\*\*|__|\*|_/g, "")
        .replace(/category:|topic:|section:/gi, "")
        .split("\n")[0]
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .trim()
        .toUpperCase();
    }

    return { title, content, summary, category: finalCategory || "GENERAL", tags };

  } catch (err) {
    throw err;
  }
}

module.exports = blogAgent;
