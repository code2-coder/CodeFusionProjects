import dotenv from 'dotenv';
dotenv.config();

import OpenRouterProvider from './services/ai/providers/OpenRouterProvider.js';

async function test() {
  try {
    console.log('Testing OpenRouterProvider...');
    const provider = new OpenRouterProvider();
    
    if (!provider.apiKey || provider.apiKey === 'your_openrouter_api_key') {
      console.log('OPENROUTER_API_KEY is not configured with a valid API key. Skipping live fetch test.');
      console.log('Provider instantiation: SUCCESS');
      return;
    }

    console.log('Sending test prompt: "Hello, say testing 123"');
    const result = await provider.generate('Hello, say testing 123');
    console.log('Success response text:', result.text);
  } catch (error) {
    console.error('Failed:', error.message);
  }
}

test();
