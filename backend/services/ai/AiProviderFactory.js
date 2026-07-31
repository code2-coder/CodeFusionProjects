import GeminiProvider from './providers/GeminiProvider.js';

class AiProviderFactory {
  static getProvider(providerName = process.env.AI_PROVIDER || 'gemini') {
    switch (providerName.toLowerCase()) {
      case 'gemini':
        return new GeminiProvider();
      // other providers (openai, claude) can be added here
      default:
        return new GeminiProvider();
    }
  }
}

export default AiProviderFactory;
