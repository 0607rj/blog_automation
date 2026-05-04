const Groq = require("groq-sdk");
const Blog = require("../models/Blog");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * AI Blog Agent — updated for human-like simplicity
 */
async function blogAgent(category, description, userTitle) {
  console.log(`🤖 Agent processing request...`);

  const prompt = `Write a blog post in SIMPLE, CONVERSATIONAL English. 
Imagine you are a person talking to a friend. No "AI-speak," no complex words, no corporate jargon. Just plain, honest talk.

Topic/Focus: ${description || "Something interesting"}
${userTitle ? `The title MUST be: ${userTitle}` : "Come up with a very simple, catchy title."}

Requirements:
1. Tone: Human, relaxed, and straightforward. Use simple sentences.
2. Length: 200–300 words.
3. Summary: One or two short, simple sentences.
4. Category: A single word (e.g. Life, Tech, Ideas).

Return ONLY a valid JSON object. 
DO NOT include any markdown code blocks or extra text.
JSON Structure:
{
  "title": "the title here",
  "content": "the simple content here",
  "summary": "the short summary here",
  "category": "the category here"
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a regular person writing a personal blog. You use simple words and a friendly tone. You only respond with JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
  });

  let rawText = completion.choices[0].message.content.trim();
  console.log("📝 AI response received.");

  // Clean up the response in case the AI added markdown backticks
  rawText = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "");

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error("❌ Failed to parse AI JSON:", rawText);
    throw new Error("The AI response was messy. Please try again.");
  }

  const { title, content, summary, category: aiCategory } = parsed;

  if (!title || !content || !summary) {
    throw new Error("The AI missed some parts of the blog. Please try again.");
  }

  const finalCategory = category || aiCategory || "Editorial";

  const blog = new Blog({ 
    title, 
    content, 
    summary, 
    category: finalCategory, 
    description 
  });

  await blog.save();
  console.log(`✅ Blog saved: ${blog.title}`);

  return blog;
}

module.exports = blogAgent;
