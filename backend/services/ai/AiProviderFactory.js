import OpenRouterProvider from './providers/OpenRouterProvider.js';

class AiProviderFactory {
  static getProvider(providerName = process.env.AI_PROVIDER || 'openrouter') {
    switch (providerName.toLowerCase()) {
      case 'openrouter':
        return new OpenRouterProvider();
      default:
        return new OpenRouterProvider();
    }
  }
}

export default AiProviderFactory;
