import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from '@google/genai';

async function listModels() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    // According to the new SDK, ai.models.listModels() should work or fetch directly via REST.
    // The new SDK for listing models is ai.models.list().
    const response = await ai.models.list();
    const models = Array.from(response).map(m => m.name);
    console.log('Available models:');
    console.log(models);
  } catch (error) {
    console.error('Failed to list models:', error);
  }
}

listModels();
