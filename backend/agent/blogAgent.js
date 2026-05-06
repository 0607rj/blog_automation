const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Ask the AI to write plain text with clear delimiters.
// We build the JSON ourselves — so it can NEVER be malformed.
async function blogAgent(category, description, userTitle, existingCategories = []) {
  console.log(`🤖 Agent processing request...`);

  const categoriesText = existingCategories.length > 0 
    ? `Existing Categories: ${existingCategories.join(", ")}`
    : "Existing Categories: Technology, Health, Lifestyle, Business";

  const prompt = `Write a blog post using the format below. 
Fill in each section clearly. Use plain English. Keep it simple and friendly.

${categoriesText}

---START CATEGORY---
Pick the best category for this story. 
- If it fits one of the "Existing Categories" above, USE THAT EXACT WORD. 
- If it is a completely new topic, create a new one-word category name.
---END CATEGORY---

TITLE: ${userTitle || "Write a good title for this topic"}

TOPIC: ${description || "General Insights"}

---START CONTENT---
Write 3-4 paragraphs here (300-350 words total). Use simple words.
Include a section called "Quick Points:" with 4-5 bullet points using "- " prefix.
---END CONTENT---

---START SUMMARY---
Write 1-2 sentences that describe the article.
---END SUMMARY---

---START TAGS---
List 4-5 short keyword tags for this article, separated by commas. Example: React, JavaScript, Web Dev, Frontend
---END TAGS---`;


  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful blog writer. Follow the format exactly.",
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
      const end = text.indexOf(endMarker);
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

    // Extract Category (and clean it up aggressively)
    const rawCategory = extractBetween(raw, "---START CATEGORY---", "---END CATEGORY---");
    let finalCategory = "General";
    if (rawCategory) {
      // 1. Remove markdown stars, colons, and labels like "Category" or "Topic"
      // 2. Remove any non-alphanumeric characters except spaces
      // 3. Take the first line and trim it
      finalCategory = rawCategory
        .replace(/\*\*|__|\*|_/g, "") // Remove bold/italic markers
        .replace(/category:|topic:|section:/gi, "") // Remove common labels
        .split("\n")[0] // Take first line only
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove symbols
        .trim();

      // Ensure it's uppercase for a consistent professional look
      finalCategory = finalCategory.toUpperCase() || "GENERAL";
    }

    // Extract and clean Tags
    const rawTags = extractBetween(raw, "---START TAGS---", "---END TAGS---");
    let tags = [];
    if (rawTags) {
      tags = rawTags
        .split(",")
        .map(t => t.replace(/\*\*|__|\*|_/g, "").trim())
        .filter(t => t.length > 0)
        .slice(0, 5);
    }

    return { title, content, summary, category: finalCategory, tags };


  } catch (err) {
    throw err;
  }
}


module.exports = blogAgent;
