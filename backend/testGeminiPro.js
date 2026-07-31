import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from '@google/genai';

async function testPro() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-pro',
      contents: 'Hello'
    });
    console.log('gemini-pro success:', response.text);
  } catch (error) {
    console.error('gemini-pro failed:', error.message);
  }
}

testPro();
