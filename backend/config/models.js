/**
 * MULTI-MODEL AI CONFIGURATION
 * Maps each agent to its designated AI model provider.
 * 
 * Model Assignment:
 * - Persona Agent: Gemini
 * - Research Agent: Gemini + DeepSeek R1 (via OpenRouter)
 * - Competitor Agent: DeepSeek R1 (via OpenRouter)
 * - Content Generation Agent: xAI Grok
 * - Validation Agent: xAI Grok, lightweight
 * - Orchestrator Agent: xAI Grok
 * - Opportunity Agent: Gemini + DeepSeek R1
 */

const MODEL_CONFIG = {
  gemini: {
    model: "gemini-2.0-flash",
    provider: "google",
    apiKeyEnv: "GEMINI_API_KEY",
    maxTokens: 4096,
    temperature: 0.7
  },
  deepseek: {
    model: "deepseek/deepseek-r1",
    provider: "openrouter",
    apiKeyEnv: "OPENROUTER_API_KEY",
    baseURL: "https://openrouter.ai/api/v1",
    maxTokens: 4096,
    temperature: 0.6
  },
  grok: {
    model: "grok-4.20-0309-non-reasoning",
    provider: "xai",
    apiKeyEnv: "XAI_API_KEY",
    maxTokens: 4000,
    temperature: 0.7
  },
  grokLightweight: {
    model: "grok-4.20-0309-non-reasoning",
    provider: "xai",
    apiKeyEnv: "XAI_API_KEY",
    maxTokens: 2000,
    temperature: 0.3
  }
};

const AGENT_MODEL_MAP = {
  personaAgent: "gemini",
  researchAgent_broad: "gemini",
  researchAgent_analytical: "deepseek",
  competitorAgent: "deepseek",
  orchestratorAgent: "grok",
  contentGenerationAgent: "grok",
  validationAgent: "grokLightweight",
  opportunityAgent_broad: "gemini",
  opportunityAgent_analytical: "deepseek"
};

module.exports = { MODEL_CONFIG, AGENT_MODEL_MAP };
