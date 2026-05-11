const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Orchestrator Agent — STEP 7 of the pipeline. The Brain.
 * Acts as a Growth Strategist and Persuasion Consultant.
 * REFINED: Prioritizes ultra-specific niche positioning over broad categories.
 */
async function orchestratorAgent(persona, research, competitor, memory, domainResult) {
  // Use the specific Niche or Domain as the primary category for better SEO and positioning
  const specificCategory = (domainResult.niche || domainResult.domain || domainResult.industry || "General").toUpperCase();
  
  const prompt = `You are a Chief Marketing Strategist and Persuasion Consultant. Based on deep psychological intelligence, create a high-converting content strategy for an ultra-specific niche.

=== NICHE POSITIONING ===
Industry: ${domainResult.industry}
Specific Domain: ${domainResult.domain}
Target Niche: ${domainResult.niche}
Target Audience: ${domainResult.audienceType}

=== PERSONA INTELLIGENCE ===
Reader: ${persona.buyerPersona}
Identity Belief: ${persona.identityBelief}
Emotional Frustrations: ${(persona.emotionalFrustrations || []).join(", ")}
Hidden Fears: ${(persona.hiddenFears || []).join(", ")}
Psychological Triggers: ${(persona.psychologicalTriggers || []).join(", ")}
Transformation Goal: From "${persona.beforeState}" to "${persona.afterState}"

=== SEARCH & COMPETITOR CONTEXT ===
Emotional Search Patterns: ${(research.emotionalSearchPatterns || []).join(", ")}
Competitor Trust Gaps: ${(competitor.trustGaps || []).join(", ")}
Competitor Emotional Gaps: ${(competitor.emotionalGaps || []).join(", ")}

=== STRATEGY TASK ===
Define a content blueprint that positions this brand as the ONLY solution for this specific NICHE (${domainResult.niche}). 
- Avoid generic advice. 
- Exploit the fact that competitors are too broad.
- Make the reader feel like this was written JUST for them.

Respond in this EXACT format:

[BEGIN_BLUEPRINT]
BLOG_TITLE: (emotional title specific to the niche)
EMOTIONAL_HOOK: (intro hook that validates their niche-specific pain)
TRANSFORMATION_STORY: (the specific path from niche pain to niche success)
TRUST_BUILDING_STRATEGY: (how to build authority in this specific domain)
SECTIONS_TO_COVER: (comma-separated list of 4-5 niche-focused H2 sections)
PERSUASION_CTA: (the emotionally obvious next step for this audience)
POSITIONING_STRATEGY: (how to win against broad competitors in this niche)
TARGET_KEYWORDS: (4-5 SEO keywords for this niche)
CATEGORY: (the most specific niche name, 1-2 words max)
WORD_COUNT: (800-1200)
[END_BLUEPRINT]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a growth strategist who wins by being hyper-specific. You hate broad marketing. You position brands as the deep expert in their niche." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1200,
  });

  const raw = completion.choices[0].message.content;
  const block = extractBlock(raw, "[BEGIN_BLUEPRINT]", "[END_BLUEPRINT]");
  
  if (!block) {
    return {
      blogTitle: `The ${domainResult.niche} Transformation Guide`,
      emotionalHook: `Connecting with the specific frustrations of ${domainResult.audienceType}.`,
      transformationStory: `Show them how to move from ${domainResult.niche} struggles to mastery.`,
      trustBuildingStrategy: `Demonstrating deep domain expertise in ${domainResult.domain}.`,
      sectionsToCover: ["The Niche Challenge", "Why Broad Solutions Fail You", "The New Framework", "Actionable Next Steps"],
      ctaStrategy: `Invitation to transform your ${domainResult.niche} results today.`,
      rankingStrategy: `Positioning against generic competitors in the ${domainResult.domain} space.`,
      category: specificCategory.split(" ")[0],
      targetKeywords: research.keywords || [],
      wordCount: 800,
      contentAngle: "Niche-specific emotional transformation."
    };
  }

  return {
    blogTitle: extractField(block, "BLOG_TITLE"),
    emotionalTone: extractField(block, "EMOTIONAL_HOOK"),
    emotionalHook: extractField(block, "EMOTIONAL_HOOK"),
    transformationStory: extractField(block, "TRANSFORMATION_STORY"),
    trustBuildingStrategy: extractField(block, "TRUST_BUILDING_STRATEGY"),
    sectionsToCover: extractList(block, "SECTIONS_TO_COVER"),
    ctaStrategy: extractField(block, "PERSUASION_CTA"),
    rankingStrategy: extractField(block, "POSITIONING_STRATEGY"),
    targetKeywords: extractList(block, "TARGET_KEYWORDS"),
    category: extractField(block, "CATEGORY").toUpperCase().split(" ")[0] || specificCategory.split(" ")[0],
    wordCount: parseInt(extractField(block, "WORD_COUNT")) || 800,
    contentAngle: extractField(block, "TRANSFORMATION_STORY")
  };
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

function extractList(block, key) {
  const val = extractField(block, key);
  return val ? val.split(",").map(s => s.trim()).filter(s => s.length > 0) : [];
}

module.exports = orchestratorAgent;
