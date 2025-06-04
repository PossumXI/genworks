import { supabase } from './supabase';
import { useToastStore } from './store';
import { trainingPipeline } from './training-pipeline';

interface HubInteraction {
  prompt: string;
  result: string;
  metadata: {
    userId: string;
    timestamp: number;
    tags: string[];
    quality: number;
  };
}

class HubIntegration {
  async storeInteraction(interaction: Omit<HubInteraction, 'metadata'>) {
    try {
      // Store interaction in Supabase
      const { data, error } = await supabase.from('prompts').insert({
        content: interaction.prompt,
        result: interaction.result,
        quality_score: await this.evaluateQuality(interaction.prompt, interaction.result),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).select().single();

      if (error) throw error;

      // If quality is high, add to training set
      if (data.quality_score > 0.8) {
        await this.addToTrainingSet(data);
      }

      return data;
    } catch (error) {
      console.error('Failed to store interaction:', error);
      throw error;
    }
  }

  private async evaluateQuality(prompt: string, result: string): Promise<number> {
    try {
      // Evaluate quality based on multiple factors
      const factors = await Promise.all([
        this.checkCompleteness(result),
        this.checkRelevance(prompt, result),
        this.checkCodeQuality(result)
      ]);

      return factors.reduce((acc, val) => acc + val, 0) / factors.length;
    } catch (error) {
      console.error('Failed to evaluate quality:', error);
      return 0;
    }
  }

  private async checkCompleteness(result: string): Promise<number> {
    // Check if result is complete and well-formed
    const hasCodeBlocks = /```[\s\S]*?```/.test(result);
    const hasExplanation = result.length - result.replace(/```[\s\S]*?```/g, '').length > 100;
    return hasCodeBlocks && hasExplanation ? 1 : 0.5;
  }

  private async checkRelevance(prompt: string, result: string): Promise<number> {
    // Check if result is relevant to prompt
    const promptKeywords = prompt.toLowerCase().split(/\W+/);
    const resultText = result.toLowerCase();
    const matchingKeywords = promptKeywords.filter(kw => resultText.includes(kw));
    return matchingKeywords.length / promptKeywords.length;
  }

  private async checkCodeQuality(result: string): Promise<number> {
    // Extract and analyze code blocks
    const codeBlocks = result.match(/```[\s\S]*?```/g) || [];
    if (codeBlocks.length === 0) return 0;

    // Basic code quality checks
    const qualityFactors = codeBlocks.map(block => {
      const code = block.replace(/```\w*\n?|\n?```/g, '');
      const hasComments = /\/\/|\/\*|\*\/|#/.test(code);
      const hasIndentation = /^ {2,}|\t/.test(code);
      const hasStructure = /function|class|const|let|var/.test(code);
      
      return [hasComments, hasIndentation, hasStructure]
        .filter(Boolean).length / 3;
    });

    return qualityFactors.reduce((acc, val) => acc + val, 0) / qualityFactors.length;
  }

  private async addToTrainingSet(interaction: any) {
    try {
      // Add to training set in Supabase
      await supabase.from('training_data').insert({
        prompt_id: interaction.id,
        status: 'pending',
        added_at: new Date().toISOString()
      });

      useToastStore.getState().addToast({
        title: 'Training Data Added',
        description: 'High-quality interaction added to training set',
        type: 'success'
      });

      // Trigger training pipeline if enough new data
      const { count } = await supabase
        .from('training_data')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      if (count >= 100) {
        // Start training in background
        trainingPipeline.trainModel(await trainingPipeline.fetchTrainingData())
          .catch(console.error);
      }
    } catch (error) {
      console.error('Failed to add to training set:', error);
    }
  }

  async getTrainingData() {
    try {
      const { data, error } = await supabase
        .from('training_data')
        .select(`
          *,
          prompt:prompts(*)
        `)
        .order('added_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch training data:', error);
      throw error;
    }
  }
}

export const hubIntegration = new HubIntegration();