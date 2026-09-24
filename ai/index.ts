import { AIProvider } from './types';
import { LocalRuleNLPProvider } from './local-nlp-provider';

let cachedProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (cachedProvider) return cachedProvider;

  const providerType = (process.env.AI_PROVIDER || 'local').toLowerCase();

  // If local, or no API key is set, use the robust local rule-based NLP engine
  if (providerType === 'local' || !process.env.AI_API_KEY) {
    cachedProvider = new LocalRuleNLPProvider();
    return cachedProvider;
  }

  // Future external LLM providers can easily plug in here
  cachedProvider = new LocalRuleNLPProvider();
  return cachedProvider;
}

export * from './types';
export * from './local-nlp-provider';
