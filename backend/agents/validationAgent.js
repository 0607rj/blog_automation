/**
 * Validation Agent — STEP 9 of the pipeline.
 * Verifies that the generated content and pipeline outputs are production-ready.
 * NO Groq call — rule-based validation for speed and reliability.
 */
function validationAgent(blogResult, blueprint, persona, research, competitor) {
  const issues = [];

  // 1. Content must exist and have minimum length
  if (!blogResult.content || blogResult.content.length < 200) {
    issues.push({ field: "content", issue: "Content is too short or missing" });
  }

  // 2. Title must exist
  if (!blogResult.title || blogResult.title.length < 10) {
    issues.push({ field: "title", issue: "Title is too short or missing" });
  }

  // 3. Check if content contains at least some target keywords
  const keywordsFound = (blueprint.targetKeywords || []).filter(kw =>
    blogResult.content?.toLowerCase().includes(kw.toLowerCase())
  );
  if (keywordsFound.length < 1 && (blueprint.targetKeywords || []).length > 0) {
    issues.push({ field: "keywords", issue: "No target keywords found in content" });
  }

  // 4. Summary must exist
  if (!blogResult.summary || blogResult.summary.length < 20) {
    issues.push({ field: "summary", issue: "Summary is too short or missing" });
  }

  // 5. Tags must exist
  if (!blogResult.tags || blogResult.tags.length < 2) {
    issues.push({ field: "tags", issue: "Not enough tags generated" });
  }

  // 6. Check if content addresses at least one pain point (basic check)
  const painPointsMentioned = (persona.painPoints || []).filter(pp =>
    blogResult.content?.toLowerCase().includes(pp.toLowerCase().split(" ")[0])
  );

  // 7. Check structure — should have at least 2 H2 sections
  const h2Count = (blogResult.content?.match(/^##\s+/gm) || []).length;
  if (h2Count < 2) {
    issues.push({ field: "structure", issue: "Content needs more H2 sections for better SEO" });
  }

  // 8. Meta description check
  if (!blogResult.metaDescription || blogResult.metaDescription.length < 50) {
    issues.push({ field: "metaDescription", issue: "Meta description is too short or missing" });
  }

  // 9. Word count check
  const wordCount = blogResult.content?.split(/\s+/).length || 0;
  if (wordCount < 300) {
    issues.push({ field: "wordCount", issue: `Content only has ${wordCount} words, needs minimum 300` });
  }

  // 10. Check for repetitive content (basic — check for repeated sentences)
  const sentences = (blogResult.content || "").split(/[.!?]+/).filter(s => s.trim().length > 20);
  const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
  if (sentences.length > 0 && uniqueSentences.size < sentences.length * 0.8) {
    issues.push({ field: "repetition", issue: "Content has too many repetitive sentences" });
  }

  return {
    isValid: issues.length === 0,
    issues,
    score: Math.max(0, 100 - (issues.length * 12)),
    keywordsIntegrated: keywordsFound.length,
    totalKeywords: (blueprint.targetKeywords || []).length,
    painPointsCovered: painPointsMentioned.length,
    h2Count,
    wordCount,
  };
}

module.exports = validationAgent;
