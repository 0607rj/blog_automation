/**
 * OPPORTUNITY ANALYSIS AGENT — STEP 0 of the autonomous pipeline.
 * 
 * Runs every 15 days. Analyzes market demand across all 3 audience categories,
 * scoring each on 7 dimensions to select the highest-opportunity audience.
 * 
 * Uses: Gemini (broad understanding) + DeepSeek R1 (analytical scoring)
 * 
 * Scoring Dimensions:
 * 1. Search Demand (current search volume signals)
 * 2. Emotional Intensity (how emotionally charged the audience is)
 * 3. Competitor Gaps (where competitors are weakest)
 * 4. SEO Opportunity (untapped keyword potential)
 * 5. Trend Growth (growing vs declining interest)
 * 6. Location-Specific Demand (Kolkata/Lucknow specific)
 * 7. Previous Success Patterns (from memory)
 */
const { groqGenerate } = require("./clients/groqClient");
const { getPrimaryLocationContext } = require("../config/locations");
const { getCompetitorContext } = require("../config/competitors");
const { memoryAgent } = require("./memoryAgent");

const AUDIENCE_CATEGORIES = [
  "12th Pass Commerce Student",
  "College-Level Student",
  "Working Professional"
];

async function opportunityAgent() {
  const locationContext = getPrimaryLocationContext();
  const competitorContext = getCompetitorContext();
  
  // Get memory for historical patterns
  let memoryData;
  try {
    memoryData = await memoryAgent("ACCOUNTING");
  } catch (e) {
    memoryData = { totalBlogsGenerated: 0, previousTitles: [], successfulTopics: [], emotionalStrategies: [] };
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: GEMINI — Broad Market Understanding
  // ═══════════════════════════════════════════════════════════════
  const geminiSystemPrompt = `You are a market research intelligence system specializing in the Indian Accounting & Finance Education sector. Analyze current market conditions for THREE audience categories and provide opportunity intelligence.`;

  const geminiUserPrompt = `Analyze the current market opportunity for accounting education content across these 3 audience categories:

1. 12TH PASS COMMERCE STUDENTS — Recently completed 12th, confused about career, limited budget
2. COLLEGE-LEVEL STUDENTS (B.Com/BBA/BA) — Have degree but no practical skills, terrified of interviews
3. WORKING PROFESSIONALS — Stuck in low-paying jobs, need upskilling, time-constrained

=== LOCATION CONTEXT ===
${locationContext}

=== COMPETITOR LANDSCAPE ===
${competitorContext}

=== PREVIOUS CONTENT GENERATED ===
Total blogs: ${memoryData.totalBlogsGenerated || 0}
Recent topics: ${(memoryData.previousTitles || []).slice(-5).join(", ") || "None yet"}
Successful strategies: ${(memoryData.emotionalStrategies || []).slice(-3).join("; ") || "None yet"}

For EACH audience category, analyze:
1. What are they CURRENTLY searching for RIGHT NOW in Kolkata and Lucknow?
2. What emotional pain points are MOST INTENSE right now?
3. Where are competitors WEAKEST for this audience?
4. What trending topics are GROWING for this audience?
5. What content would have the HIGHEST conversion potential?

Respond in this EXACT format:

[BEGIN_ANALYSIS]
CATEGORY_1_NAME: 12th Pass Commerce Student
CATEGORY_1_SEARCH_DEMAND: (describe current search intensity and popular queries)
CATEGORY_1_EMOTIONAL_INTENSITY: (describe how emotionally charged this audience is RIGHT NOW)
CATEGORY_1_COMPETITOR_GAPS: (where competitors fail this audience)
CATEGORY_1_TRENDING_TOPICS: (what's growing for this audience)
CATEGORY_1_LOCATION_DEMAND: (Kolkata/Lucknow specific demand)

CATEGORY_2_NAME: College-Level Student
CATEGORY_2_SEARCH_DEMAND: (describe current search intensity)
CATEGORY_2_EMOTIONAL_INTENSITY: (describe emotional state)
CATEGORY_2_COMPETITOR_GAPS: (competitor weaknesses)
CATEGORY_2_TRENDING_TOPICS: (growing topics)
CATEGORY_2_LOCATION_DEMAND: (location specific)

CATEGORY_3_NAME: Working Professional
CATEGORY_3_SEARCH_DEMAND: (describe current search intensity)
CATEGORY_3_EMOTIONAL_INTENSITY: (describe emotional state)
CATEGORY_3_COMPETITOR_GAPS: (competitor weaknesses)
CATEGORY_3_TRENDING_TOPICS: (growing topics)
CATEGORY_3_LOCATION_DEMAND: (location specific)

MARKET_TRENDS: (3 overall market trends, comma-separated)
COMPETITOR_WEAKNESSES: (3 overall competitor weaknesses, comma-separated)
EMOTIONAL_OPPORTUNITIES: (3 emotional content opportunities, comma-separated)
SEO_GAPS: (3 SEO keyword gaps, comma-separated)
[END_ANALYSIS]`;

  let geminiAnalysis = "";
  try {
    geminiAnalysis = await groqGenerate(geminiSystemPrompt, geminiUserPrompt, { temperature: 0.7 });
  } catch (err) {
    console.error("Opportunity Agent — Groq Analysis failed:", err.message);
    geminiAnalysis = "Analysis unavailable.";
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: DEEPSEEK R1 — Analytical Scoring
  // ═══════════════════════════════════════════════════════════════
  const deepseekSystemPrompt = `You are a data-driven analytical engine. Score audience categories based on market opportunity data. Be precise and quantitative. Output valid JSON only.`;

  const deepseekUserPrompt = `Based on this market analysis, score each audience category on a 0-100 scale across 7 dimensions.

=== MARKET ANALYSIS ===
${geminiAnalysis}

=== PREVIOUS BLOG HISTORY ===
Total blogs generated: ${memoryData.totalBlogsGenerated || 0}
Categories used recently: ${(memoryData.usedCategories || []).join(", ") || "None"}
Successful emotional strategies: ${(memoryData.emotionalStrategies || []).slice(-3).join("; ") || "None"}

=== SCORING DIMENSIONS ===
1. searchDemand: How much active search volume exists RIGHT NOW (0-100)
2. emotionalIntensity: How emotionally charged the audience is (0-100)
3. competitorGaps: How weak competitors are for this audience (0-100)
4. seoOpportunity: How much untapped SEO keyword potential exists (0-100)
5. trendGrowth: Is interest growing or declining (0-100)
6. locationDemand: How strong is Kolkata/Lucknow specific demand (0-100)
7. previousSuccess: Based on previous content patterns, how likely is success (0-100). If no previous content, default to 50.

IMPORTANT: If one category has been heavily covered recently, reduce its previousSuccess score to encourage diversity.

Respond in EXACT JSON format:
{
  "categoryScores": [
    {
      "category": "12th Pass Commerce Student",
      "scores": {
        "searchDemand": 0,
        "emotionalIntensity": 0,
        "competitorGaps": 0,
        "seoOpportunity": 0,
        "trendGrowth": 0,
        "locationDemand": 0,
        "previousSuccess": 0
      },
      "totalScore": 0,
      "reasoning": "1-2 sentence explanation",
      "keyInsights": ["insight1", "insight2"]
    },
    {
      "category": "College-Level Student",
      "scores": { ... },
      "totalScore": 0,
      "reasoning": "...",
      "keyInsights": ["...", "..."]
    },
    {
      "category": "Working Professional",
      "scores": { ... },
      "totalScore": 0,
      "reasoning": "...",
      "keyInsights": ["...", "..."]
    }
  ],
  "selectedCategory": "THE WINNER",
  "selectionReasoning": "2-3 sentences explaining WHY this category was selected",
  "marketTrends": ["trend1", "trend2", "trend3"],
  "competitorWeaknesses": ["weakness1", "weakness2"],
  "emotionalOpportunities": ["opp1", "opp2"],
  "seoGaps": ["gap1", "gap2"]
}`;

  let scoringResult;
  try {
    const rawScoring = await groqGenerate(deepseekSystemPrompt, deepseekUserPrompt, { temperature: 0.3 });

    // Extract JSON from response (may contain <think> tags)
    const jsonMatch = rawScoring.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      scoringResult = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No valid JSON found in Groq response");
    }
  } catch (err) {
    console.error("Opportunity Agent — Groq scoring failed:", err.message);
    // Fallback: rotate through categories based on blog count
    const blogCount = memoryData.totalBlogsGenerated || 0;
    const fallbackIndex = blogCount % AUDIENCE_CATEGORIES.length;
    scoringResult = {
      categoryScores: AUDIENCE_CATEGORIES.map((cat, i) => ({
        category: cat,
        scores: {
          searchDemand: 60 + (i === fallbackIndex ? 20 : 0),
          emotionalIntensity: 65,
          competitorGaps: 55,
          seoOpportunity: 60,
          trendGrowth: 55,
          locationDemand: 60,
          previousSuccess: i === fallbackIndex ? 70 : 50
        },
        totalScore: i === fallbackIndex ? 75 : 55,
        reasoning: "Fallback scoring — AI analysis unavailable.",
        keyInsights: ["Using rotation-based fallback"]
      })),
      selectedCategory: AUDIENCE_CATEGORIES[fallbackIndex],
      selectionReasoning: "Fallback: rotating through audience categories due to AI unavailability.",
      marketTrends: ["Practical accounting skills demand", "GST certification", "Interview preparation"],
      competitorWeaknesses: ["Lack of emotional content", "No location-specific content"],
      emotionalOpportunities: ["Career anxiety content", "Interview confidence building"],
      seoGaps: ["Location-specific accounting courses", "Practical accounting jobs"]
    };
  }

  // Calculate total scores if not provided
  if (scoringResult.categoryScores) {
    scoringResult.categoryScores.forEach(cs => {
      if (!cs.totalScore || cs.totalScore === 0) {
        const s = cs.scores;
        cs.totalScore = Math.round(
          (s.searchDemand + s.emotionalIntensity + s.competitorGaps +
           s.seoOpportunity + s.trendGrowth + s.locationDemand + s.previousSuccess) / 7
        );
      }
    });

    // Select winner if not already selected
    if (!scoringResult.selectedCategory) {
      const winner = scoringResult.categoryScores.reduce((a, b) =>
        a.totalScore > b.totalScore ? a : b
      );
      scoringResult.selectedCategory = winner.category;
      scoringResult.selectionReasoning = winner.reasoning;
    }
  }

  // Select a random primary location for this run
  const locations = ["Kolkata", "Lucknow"];
  const selectedLocation = locations[Math.floor(Math.random() * locations.length)];

  return {
    selectedCategory: scoringResult.selectedCategory,
    selectedLocation,
    categoryScores: scoringResult.categoryScores || [],
    selectionReasoning: scoringResult.selectionReasoning || "",
    marketTrends: scoringResult.marketTrends || [],
    competitorWeaknesses: scoringResult.competitorWeaknesses || [],
    emotionalOpportunities: scoringResult.emotionalOpportunities || [],
    seoGaps: scoringResult.seoGaps || [],
    geminiAnalysis: geminiAnalysis.substring(0, 500),
    methodology: {
      approach: "Groq Opportunity Intelligence",
      models: ["Groq (Llama 3.3 70B)"],
      scoringDimensions: [
        "Search Demand", "Emotional Intensity", "Competitor Gaps",
        "SEO Opportunity", "Trend Growth", "Location Demand", "Previous Success"
      ],
      reasoning: `Analyzed 3 audience categories across 7 scoring dimensions using strictly Groq Intelligence (Llama 3.3) for both qualitative and quantitative scoring. Selected "${scoringResult.selectedCategory}" based on highest potential market intent.`
    }
  };
}

module.exports = opportunityAgent;
