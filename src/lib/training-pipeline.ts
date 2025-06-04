import { supabase, queries } from './supabase';
import { useToastStore } from './store';
import { Ollama } from 'ollama';

interface TrainingData {
  prompt: string;
  result: string;
  metadata: {
    userId: string;
    timestamp: number;
    quality: number;
    tags: string[];
  };
}

class TrainingPipeline {
  private ollama: Ollama;
  private batchSize = 32;
  private epochs = 10;
  private learningRate = 0.0001;
  private validationSplit = 0.2;
  private trainingStatus: 'idle' | 'training' | 'validating' | 'deploying' = 'idle';

  constructor() {
    this.ollama = new Ollama();
  }

  async fetchTrainingData(): Promise<TrainingData[]> {
    try {
      // Fetch high-quality prompts from Supabase
      const { data: prompts, error } = await supabase
        .from('prompts')
        .select('*')
        .gt('quality_score', 0.8) // Only use high-quality prompts
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Transform prompts into training data
      return prompts.map(prompt => ({
        prompt: prompt.content,
        result: prompt.result,
        metadata: {
          userId: prompt.user_id,
          timestamp: new Date(prompt.created_at).getTime(),
          quality: prompt.quality_score,
          tags: prompt.tags
        }
      }));
    } catch (error) {
      console.error('Failed to fetch training data:', error);
      throw error;
    }
  }

  async trainModel(data: TrainingData[]): Promise<void> {
    this.trainingStatus = 'training';
    const addToast = useToastStore.getState().addToast;

    try {
      // Create batches for training
      const batches = this.createBatches(data, this.batchSize);
      
      for (let epoch = 0; epoch < this.epochs; epoch++) {
        for (let [batchNum, batch] of batches.entries()) {
          // Train the model on this batch
          const metrics = await this.trainBatch(batch);
          
          // Store training metrics in Supabase
          await this.storeTrainingMetrics({
            epoch,
            batchNumber: batchNum,
            ...metrics
          });

          // Update progress
          addToast({
            title: 'Training Progress',
            description: `Epoch ${epoch + 1}/${this.epochs}, Batch ${batchNum + 1}/${batches.length}`,
            type: 'info'
          });
        }
      }

      this.trainingStatus = 'idle';
    } catch (error) {
      this.trainingStatus = 'idle';
      throw error;
    }
  }

  private async trainBatch(batch: TrainingData[]) {
    const formattedData = batch.map(item => ({
      prompt: this.formatPrompt(item.prompt),
      completion: item.result
    }));

    const response = await this.ollama.train('devstral', {
      data: formattedData,
      learningRate: this.learningRate
    });

    return {
      loss: response.loss,
      accuracy: response.accuracy
    };
  }

  private formatPrompt(prompt: string): string {
    return `[INST] ${prompt} [/INST]`;
  }

  private async storeTrainingMetrics(metrics: any) {
    try {
      await supabase.from('training_metrics').insert({
        epoch: metrics.epoch,
        batch_number: metrics.batchNumber,
        loss: metrics.loss,
        accuracy: metrics.accuracy,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to store training metrics:', error);
    }
  }

  private createBatches(data: TrainingData[], batchSize: number) {
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    return batches;
  }

  async validateModel(): Promise<void> {
    this.trainingStatus = 'validating';
    const addToast = useToastStore.getState().addToast;

    try {
      // Fetch validation prompts from Supabase
      const { data: validationPrompts } = await supabase
        .from('validation_prompts')
        .select('*')
        .limit(100);

      for (const prompt of validationPrompts) {
        const response = await this.ollama.generate({
          model: 'devstral',
          prompt: this.formatPrompt(prompt.input)
        });

        // Store validation results
        await supabase.from('validation_results').insert({
          prompt_id: prompt.id,
          model_output: response.response,
          expected_output: prompt.expected_output,
          similarity_score: await this.calculateSimilarity(
            response.response,
            prompt.expected_output
          ),
          timestamp: new Date().toISOString()
        });
      }

      addToast({
        title: 'Validation Complete',
        description: 'Model validation completed successfully',
        type: 'success'
      });

      this.trainingStatus = 'idle';
    } catch (error) {
      this.trainingStatus = 'idle';
      throw error;
    }
  }

  private async calculateSimilarity(output: string, expected: string): Promise<number> {
    // Simple token-based similarity score
    const outputTokens = new Set(output.toLowerCase().split(/\s+/));
    const expectedTokens = new Set(expected.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...outputTokens].filter(x => expectedTokens.has(x)));
    const union = new Set([...outputTokens, ...expectedTokens]);
    
    return intersection.size / union.size;
  }

  async deployModel(): Promise<void> {
    this.trainingStatus = 'deploying';
    const addToast = useToastStore.getState().addToast;

    try {
      // Push the model to Ollama's registry
      await this.ollama.push('devstral', {
        insecure: false,
        platform: 'linux/amd64'
      });

      // Store deployment record in Supabase
      await supabase.from('model_deployments').insert({
        version: new Date().toISOString(),
        status: 'success',
        timestamp: new Date().toISOString()
      });

      addToast({
        title: 'Deployment Success',
        description: 'Model has been successfully deployed',
        type: 'success'
      });

      this.trainingStatus = 'idle';
    } catch (error) {
      this.trainingStatus = 'idle';
      throw error;
    }
  }

  getStatus(): string {
    return this.trainingStatus;
  }
}

export const trainingPipeline = new TrainingPipeline();