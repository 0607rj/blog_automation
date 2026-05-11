const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Validation Agent — STEP 9 of the pipeline.
 * Verifies that the generated content and pipeline outputs are production-ready.
 * Performs deep psychological quality checks using an LLM to ensure the content
 * meets conversion marketing standards.
 */
async function validationAgent(blogResult, blueprint, persona, research, competitor) {
  const issues = [];
  let score = 100;

  // --- 1. Basic Rule-Based Checks (Speed & Reliability) ---

  if (!blogResult.content || blogResult.content.length < 200) {
    issues.push({ field: "content", issue: "Content is too short or missing" });
    score -= 20;
  }

  if (!blogResult.title || blogResult.title.length < 10) {
    issues.push({ field: "title", issue: "Title is too short or missing" });
    score -= 10;
  }

  const h2Count = (blogResult.content?.match(/^##\s+/gm) || []).length;
  if (h2Count < 2) {
    issues.push({ field: "structure", issue: "Content needs more H2 sections for better readability" });
    score -= 10;
  }

  const wordCount = blogResult.content?.split(/\s+/).length || 0;
  if (wordCount < 300) {
    issues.push({ field: "wordCount", issue: `Content only has ${wordCount} words, needs minimum 300` });
    score -= 20;
  }

  // --- 2. Deep Psychological Quality Check (LLM Based) ---
  
  if (blogResult.content && blogResult.content.length > 500) {
    try {
      const prompt = `You are a strict Senior Editor and Conversion Psychologist. Review this generated article against our audience intelligence.

=== AUDIENCE & STRATEGY ===
Reader: ${persona.buyerPersona}
Their Deep Frustration: ${(persona.emotionalFrustrations || []).join(", ")}
Target Transformation: ${blueprint.transformationStory || "N/A"}
Trust Strategy: ${blueprint.trustBuildingStrategy || "N/A"}

=== THE ARTICLE ===
TITLE: ${blogResult.title}
CONTENT:
${blogResult.content.substring(0, 3000)}... (truncated for review)

Evaluate the article on the following criteria. Be extremely harsh.
1. Does the persona feel psychologically real, or is the article addressing a generic audience?
2. Does the content feel emotionally persuasive?
3. Is the transformation journey clear?
4. Are emotional triggers naturally used?
5. Is trust-building strong?
6. Does the content feel robotic or AI-generated? (Look for clichés like 'unleash', 'dive deep', 'landscape').
7. Is emotional differentiation strong compared to generic competitors?

Respond EXACTLY in this JSON format:
{
  "psychologicalScore": (0-100),
  "isRobotic": (true/false),
  "critiques": ["critique 1", "critique 2"]
}
`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a harsh editorial reviewer. You expect human-level psychological depth. Output valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const feedback = JSON.parse(completion.choices[0].message.content);
      
      const psychoScore = feedback.psychologicalScore || 50;
      
      if (psychoScore < 70) {
        issues.push({ field: "psychologicalDepth", issue: "Content lacks emotional depth or persuasion." });
        score -= (70 - psychoScore);
      }

      if (feedback.isRobotic) {
        issues.push({ field: "tone", issue: "Content sounds too much like an AI. Uses robotic clichés." });
        score -= 15;
      }

      if (feedback.critiques && feedback.critiques.length > 0) {
        // Add the top critique to the issues
        issues.push({ field: "editorialCritique", issue: feedback.critiques[0] });
      }

    } catch (e) {
      console.error("Validation Agent LLM Error:", e.message);
      // Fallback: Don't fail the pipeline entirely if the LLM validation API errors out.
      issues.push({ field: "validationError", issue: "Could not run deep psychological validation." });
    }
  }

  // Calculate some basic metrics
  const keywordsFound = (blueprint.targetKeywords || []).filter(kw =>
    blogResult.content?.toLowerCase().includes(kw.toLowerCase())
  );

  return {
    isValid: score >= 60, // Minimum acceptable score for production
    issues,
    score: Math.max(0, Math.min(100, score)),
    keywordsIntegrated: keywordsFound.length,
    totalKeywords: (blueprint.targetKeywords || []).length,
    h2Count,
    wordCount,
  };
}

module.exports = validationAgent;
