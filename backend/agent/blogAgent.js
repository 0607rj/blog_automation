const Groq = require("groq-sdk");
const Blog = require("../models/Blog");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * AI Blog Agent — updated for human-like simplicity
 */
async function blogAgent(category, description, userTitle) {
  console.log(`🤖 Agent processing request...`);

  const prompt = `Write a long, detailed blog post using SIMPLE, HUMAN English. 
Imagine you are a person sharing your thoughts with a friend. 
NO fancy "AI words" (do not use words like 'tapestry', 'delve', 'moreover', 'testament', or 'unlock'). 

Topic: ${description || "General Insights"}
${userTitle ? `Title: ${userTitle}` : "Create a simple, catchy title."}

Structure:
- Natural introduction.
- 3-4 detailed paragraphs using plain English.
- A bullet-point list of "Quick Points".
- A simple conclusion.

Length: 300-400 words.
Tone: Friendly, direct, and natural.



OUTPUT RULES:
- Return ONLY valid JSON.
- DO NOT add any conversational text before or after the JSON.
- Ensure the JSON is complete.


JSON Format:
{
  "title": "...",
  "content": "...",
  "summary": "...",
  "category": "..."
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a professional editorial system. You output pure JSON data. Never include text outside of the JSON structure.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.85,
    max_tokens: 4000,
  });



  let rawText = completion.choices[0].message.content.trim();
  console.log("📝 AI raw response length:", rawText.length);
  
  // Aggressive JSON extraction: Find the first '{' and the last '}'
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("❌ No JSON found in AI response. Raw:", rawText.substring(0, 500));
    throw new Error("The system couldn't generate a valid article structure. Please try again.");
  }
  
  const cleanedText = jsonMatch[0];

  let parsed;
  try {
    parsed = JSON.parse(cleanedText);
  } catch (err) {
    console.error("❌ Failed to parse AI JSON. Cleaned text preview:", cleanedText.substring(0, 200) + "...");
    throw new Error("The editorial system had a formatting error. Please try again.");
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
