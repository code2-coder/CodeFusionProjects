


import { GoogleGenAI } from '@google/genai';

class GeminiProvider {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY is not defined in environment variables');
    }
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async generate(promptText, options = {}, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.ai.models.generateContent({
          model: options.model || 'gemini-flash-latest',
          contents: promptText,
        });
        
        return {
          text: response.text,
          raw: response
        };
      } catch (error) {
        const is503 = error.message && error.message.includes('503');
        if (is503 && attempt < retries) {
          console.warn(`Gemini API 503 error. Retrying attempt ${attempt} of ${retries} in ${attempt * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
          continue;
        }
        console.error('Gemini API Error Response:', error.response?.data);
        console.error('Gemini API Error Message:', error.message);
        console.error('Gemini API Error Stack:', error.stack);
        throw error;
      }
    }
  }

  async generateStream(promptText, onChunk, options = {}) {
    try {
      const responseStream = await this.ai.models.generateContentStream({
        model: options.model || 'gemini-flash-latest',
        contents: promptText,
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          onChunk(chunk.text);
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Gemini API Stream Error:', error.message);
      throw error;
    }
  }
}

export default GeminiProvider;
