const { groqGenerate } = require("./clients/groqClient");

/**
 * Orchestrator Agent — STEP 4 of the autonomous pipeline. The Central Brain.
 * Combines persona insights, research data, competitor analysis, and memory history
 * with location intelligence to decide: final strategy, emotional angle, and content direction.
 */
async function orchestratorAgent(persona, research, competitor, memory, domainResult) {
  const targetLocation = persona.targetLocation || research.targetLocation || "Kolkata";

  const prompt = `You are the Chief Content Strategist for an ACCOUNTING & FINANCE education brand targeting students in ${targetLocation}, India. You are the "central brain" that synthesizes all intelligence into a precise content strategy.

=== DOMAIN POSITIONING ===
Industry: ${domainResult.industry}
Domain: ${domainResult.domain}
Niche: ${domainResult.niche}
Target Audience: ${domainResult.audienceType}
Audience Category: ${domainResult.audienceCategory}
Target Location: ${targetLocation}

=== PERSONA INTELLIGENCE ===
Reader: ${persona.buyerPersona}
Identity Belief: ${persona.identityBelief}
Hidden Fears: ${Array.isArray(persona.hiddenFears) ? persona.hiddenFears.join("; ") : (persona.hiddenFears || "")}
Live Situations: ${Array.isArray(persona.liveSituations) ? persona.liveSituations.slice(0, 3).join("; ") : (persona.liveSituations || "")}
Emotional Triggers: ${Array.isArray(persona.emotionalTriggers) ? persona.emotionalTriggers.join(", ") : (persona.emotionalTriggers || "")}
Transformation: From "${persona.beforeState}" to "${persona.afterState}"

=== RESEARCH INTELLIGENCE ===
Emotional Search Drivers: ${(research.emotionalSearchPatterns || []).join(", ")}
AI Search Queries: ${(research.aiSearchQueries || []).join(", ")}
Trust Signals: ${(research.trustSignals || []).join(", ")}
Trending: ${(research.trendInsights || []).join(", ")}
Location Search Patterns: ${(research.locationSearchPatterns || []).join(", ")}
Career Anxieties: ${(research.careerAnxietyPatterns || []).join(", ")}
SEO Gaps: ${(research.seoGaps || []).join(", ")}

=== COMPETITOR INTELLIGENCE ===
Emotional Gaps: ${(competitor.emotionalGaps || []).join(", ")}
Trust Gaps: ${(competitor.trustGaps || []).join(", ")}
Blind Spots: ${(competitor.competitorBlindSpots || []).join(", ")}
SEO Gaps: ${(competitor.seoGaps || []).join(", ")}
Strategy: ${competitor.strategyNotes}

=== MEMORY CONTEXT ===
Previous Blogs: ${memory.totalBlogsGenerated || 0}
Avoid Repeating: ${(memory.previousTitles || []).slice(-5).join(", ")}
Successful Strategies: ${(memory.emotionalStrategies || []).slice(-3).join(", ")}

=== YOUR TASK ===
Synthesize ALL intelligence above into a content blueprint. The content must:
1. Address the specific persona's emotional reality IN ${targetLocation}
2. Exploit competitor blind spots and SEO gaps
3. Answer the search queries they're actually asking
4. Build trust using the signals they need
5. Include ${targetLocation}-specific references and context
6. NOT repeat any previous titles
7. Target localized SEO keywords

Respond in this EXACT format:

[BEGIN_BLUEPRINT]
BLOG_TITLE: (emotionally specific title for ${targetLocation} accounting audience)
EMOTIONAL_HOOK: (opening hook that validates their specific pain in ${targetLocation})
EMOTIONAL_ANGLE: (the primary emotional strategy for this content)
TRANSFORMATION_STORY: (the journey from their current pain to their desired success)
TRUST_BUILDING_STRATEGY: (how to build authority for this specific audience)
SECTIONS_TO_COVER: (comma-separated list of 4-5 focused H2 sections)
PERSUASION_CTA: (emotionally obvious next step for this audience)
POSITIONING_STRATEGY: (how to win against competitors in this niche)
TARGET_KEYWORDS: (5-6 SEO keywords including ${targetLocation}-specific terms)
CATEGORY: (ACCOUNTING or FINANCE — 1 word)
WORD_COUNT: (1000-1500)
CONTENT_DIRECTION: (1-2 sentences on overall content strategy and reasoning)
[END_BLUEPRINT]`;

  const fallbackResult = {
    blogTitle: `The ${domainResult.audienceCategory}'s Guide to Breaking Into Accounting in ${targetLocation}`,
    emotionalHook: `Connecting with the specific frustrations of ${domainResult.audienceType} in ${targetLocation}.`,
    emotionalAngle: "Empathy + practical roadmap",
    transformationStory: `From ${persona.beforeState || "confusion"} to ${persona.afterState || "confidence"}.`,
    trustBuildingStrategy: "Real student stories, practical curriculum proof, salary data.",
    sectionsToCover: ["The Real Problem Nobody Talks About", "What Actually Works", "The Step-by-Step Path", "From Theory to Job Offer"],
    ctaStrategy: "Start your practical accounting journey today.",
    rankingStrategy: "Position against theory-heavy competitors with practical, emotional content.",
    category: "ACCOUNTING",
    targetKeywords: research.keywords || [`accounting course ${targetLocation}`, "practical accounting", "commerce career"],
    wordCount: 1200,
    contentAngle: "Practical transformation with emotional depth.",
    contentDirection: `Psychology-driven practical accounting content for ${targetLocation}.`,
    targetLocation,
    methodology: {
      approach: "Multi-Intelligence Synthesis",
      inputs: ["Persona Psychology", "Research Data", "Competitor Analysis", "Memory History", "Location Intelligence"],
      reasoning: "Combined 5 intelligence sources to determine optimal content strategy.",
      decisions: {
        emotionalAngle: "Empathy-first approach based on persona's hidden fears",
        rankingApproach: "Exploit competitor blind spots in emotional connection",
        contentDirection: "Practical transformation storytelling",
        locationFocus: targetLocation
      }
    }
  };

  let raw = "";
  try {
    raw = await groqGenerate(
      `You are a strategic content brain for accounting education targeting ${targetLocation}. You combine psychology, research, competitor gaps, and memory into a precise content blueprint. Every decision must be data-driven and psychologically grounded. Focus exclusively on accounting, finance, GST, Tally, taxation, and commerce career content. Always include location-specific context.`,
      prompt,
      { model: "llama-3.3-70b-versatile", temperature: 0.7 }
    );
  } catch (err) {
    console.error("Orchestrator Agent — Groq generation failed:", err.message);
    return fallbackResult;
  }
  const block = extractBlock(raw, "[BEGIN_BLUEPRINT]", "[END_BLUEPRINT]");

  if (!block) return fallbackResult;

  return {
    blogTitle: extractField(block, "BLOG_TITLE") || fallbackResult.blogTitle,
    emotionalTone: extractField(block, "EMOTIONAL_HOOK"),
    emotionalHook: extractField(block, "EMOTIONAL_HOOK"),
    emotionalAngle: extractField(block, "EMOTIONAL_ANGLE"),
    transformationStory: extractField(block, "TRANSFORMATION_STORY"),
    trustBuildingStrategy: extractField(block, "TRUST_BUILDING_STRATEGY"),
    sectionsToCover: extractList(block, "SECTIONS_TO_COVER"),
    ctaStrategy: extractField(block, "PERSUASION_CTA"),
    rankingStrategy: extractField(block, "POSITIONING_STRATEGY"),
    targetKeywords: extractList(block, "TARGET_KEYWORDS"),
    category: (extractField(block, "CATEGORY") || "ACCOUNTING").toUpperCase().split(" ")[0],
    wordCount: parseInt(extractField(block, "WORD_COUNT")) || 1200,
    contentAngle: extractField(block, "TRANSFORMATION_STORY"),
    contentDirection: extractField(block, "CONTENT_DIRECTION"),
    targetLocation,
    methodology: {
      approach: "Multi-Intelligence Synthesis Engine",
      inputs: ["Deep Persona Psychology", "Dual-Model Research", "7-Framework Competitor Analysis", "Self-Learning Memory", "Location Intelligence"],
      reasoning: `Synthesized ${domainResult.audienceCategory} persona insights with research data, competitor gaps, and localized context. Avoided ${(memory.previousTitles || []).length} previously generated titles using Llama 3.3 Intelligence.`,
      decisions: {
        emotionalAngle: extractField(block, "EMOTIONAL_ANGLE"),
        rankingApproach: extractField(block, "POSITIONING_STRATEGY"),
        contentDirection: extractField(block, "CONTENT_DIRECTION")
      }
    }
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
