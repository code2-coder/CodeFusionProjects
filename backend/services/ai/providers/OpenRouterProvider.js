class OpenRouterProvider {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    if (!this.apiKey) {
      console.warn('OPENROUTER_API_KEY is not defined in environment variables');
    }
  }

  async generate(promptText, options = {}, retries = 3) {
    const model = options.model || process.env.AI_PROVIDER || 'google/gemini-2.5-flash:free';
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Code Fusion Projects',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: promptText
              }
            ]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenRouter API error (Status ${response.status}): ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
          throw new Error('Invalid response structure from OpenRouter API');
        }

        return {
          text: data.choices[0].message.content,
          raw: data
        };
      } catch (error) {
        const is503 = error.message && error.message.includes('503');
        if (is503 && attempt < retries) {
          console.warn(`OpenRouter API 503 error. Retrying attempt ${attempt} of ${retries} in ${attempt * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
          continue;
        }
        console.error('OpenRouter API Error Message:', error.message);
        throw error;
      }
    }
  }

  async generateStream(promptText, onChunk, options = {}) {
    const model = options.model || process.env.AI_PROVIDER || 'google/gemini-2.5-flash:free';
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Code Fusion Projects',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: promptText
            }
          ],
          stream: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter Streaming API error (Status ${response.status}): ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Save the last partial line back to the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const cleanedLine = line.trim();
          if (!cleanedLine) continue;
          if (cleanedLine === 'data: [DONE]') continue;

          if (cleanedLine.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(cleanedLine.slice(6));
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              console.warn('Failed to parse stream chunk:', cleanedLine, e);
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.startsWith('data: ')) {
        try {
          const parsed = JSON.parse(buffer.slice(6));
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        } catch (e) {
          // ignore
        }
      }

      return { success: true };
    } catch (error) {
      console.error('OpenRouter API Stream Error:', error.message);
      throw error;
    }
  }
}

export default OpenRouterProvider;
