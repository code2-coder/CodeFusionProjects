import dotenv from 'dotenv';
dotenv.config();

import GeminiProvider from './services/ai/providers/GeminiProvider.js';

async function test() {
  try {
    console.log('Testing GeminiProvider...');
    const provider = new GeminiProvider();
    const result = await provider.generate('Hello, say testing 123');
    console.log('Success:', result.text);
  } catch (error) {
    console.error('Failed:', error.message);
  }
}

test();
