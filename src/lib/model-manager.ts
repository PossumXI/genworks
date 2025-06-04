import { Ollama } from 'ollama';
import { useToastStore } from './store';
import { hubIntegration } from './hub-integration';

class ModelManager {
  private ollama: Ollama;
  private modelName = 'devstral';
  private contextWindow = 4096;
  private maxTokens = 2048;

  constructor() {
    this.ollama = new Ollama();
  }

  async generate(prompt: string, context?: string) {
    try {
      const response = await this.ollama.generate({
        model: this.modelName,
        prompt: this.formatPrompt(prompt),
        context: context || '',
        options: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxTokens: this.maxTokens,
        },
      });

      // Store successful interactions
      await hubIntegration.storeInteraction({
        prompt,
        result: response.response,
      });

      return response;
    } catch (error) {
      console.error('Generation failed:', error);
      useToastStore.getState().addToast({
        title: 'Generation Failed',
        description: 'Failed to generate response. Please try again.',
        type: 'error',
      });
      throw error;
    }
  }

  private formatPrompt(prompt: string): string {
    return `[INST] As Devstral, a software development AI assistant, help with the following:

${prompt}

Provide clear, well-structured code with explanations when needed. [/INST]`;
  }

  async validateResponse(response: string): Promise<boolean> {
    try {
      // Basic validation
      if (!response.trim()) return false;

      // Check for code blocks
      const hasCodeBlock = /```[\s\S]*?```/.test(response);
      const hasExplanation = response.length - response.replace(/```[\s\S]*?```/g, '').length > 100;

      return hasCodeBlock && hasExplanation;
    } catch (error) {
      console.error('Validation failed:', error);
      return false;
    }
  }
}

export const modelManager = new ModelManager();