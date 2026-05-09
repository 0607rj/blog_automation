const PERSONA_TEMPLATES = require("../data/personaTemplates");

/**
 * Persona Template Loader — STEP 2 of the pipeline.
 * Loads the TOP 3-5 most relevant persona templates based on detected domain.
 * Uses semantic matching against domain keywords.
 * Does NOT generate random personas — uses curated templates.
 */
function personaTemplateLoader(domainResult) {
  const { industry, domain, niche, audienceType } = domainResult;

  // Build a search string from all domain detection outputs
  const searchTerms = [industry, domain, niche, audienceType]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Score each template by how many of its domain keywords match
  const scored = PERSONA_TEMPLATES.map(template => {
    let score = 0;

    template.domains.forEach(d => {
      if (searchTerms.includes(d.toLowerCase())) {
        score += 3; // Strong match
      }
      // Partial word matching
      const words = d.toLowerCase().split(" ");
      words.forEach(word => {
        if (word.length > 2 && searchTerms.includes(word)) {
          score += 1;
        }
      });
    });

    // Boost if label matches audience type
    if (audienceType && template.label.toLowerCase().includes(audienceType.toLowerCase())) {
      score += 5;
    }

    return { ...template, score };
  });

  // Sort by score descending and take top 3-5
  const sorted = scored.sort((a, b) => b.score - a.score);

  // Take top 5 if they have scores > 0, otherwise fallback
  let selected = sorted.filter(t => t.score > 0).slice(0, 5);

  // Fallback: if no strong matches, use generic personas
  if (selected.length < 3) {
    const fallbackIds = ["working-professional", "startup-founder", "content-creator", "marketing-executive"];
    const fallbacks = PERSONA_TEMPLATES.filter(t => fallbackIds.includes(t.id));
    selected = [...selected, ...fallbacks].slice(0, 4);
  }

  return selected.map(({ score, ...rest }) => rest);
}

module.exports = personaTemplateLoader;
