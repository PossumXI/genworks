import axios from 'axios';
import { Ollama } from 'ollama';

interface TrainingData {
  prompt: string;
  result: string;
  metadata: {
    tags: string[];
    userId: string;
    timestamp: number;
  };
}

interface TrainingMetrics {
  loss: number;
  accuracy: number;
  epoch: number;
}

class DevstralTrainer {
  private ollama: Ollama;
  private modelName = 'devstral';
  private trainingData: TrainingData[] = [];
  private metrics: TrainingMetrics[] = [];

  constructor() {
    this.ollama = new Ollama();
  }

  async fetchTrainingData(): Promise<void> {
    try {
      // Fetch approved prompts and results from the Hub
      const response = await axios.get('/api/hub/training-data');
      this.trainingData = response.data;
      console.log(`Fetched ${this.trainingData.length} training samples`);
    } catch (error) {
      console.error('Failed to fetch training data:', error);
      throw error;
    }
  }

  async preprocessData(): Promise<string[]> {
    return this.trainingData.map(data => {
      // Format training examples for Ollama
      return `<prompt>${data.prompt}</prompt><result>${data.result}</result>`;
    });
  }

  async trainModel(): Promise<void> {
    try {
      const formattedData = await this.preprocessData();
      
      // Initialize training
      await this.ollama.create({
        name: this.modelName,
        modelfile: `
          FROM llama2
          TEMPLATE """{{.Input}}"""
          SYSTEM """You are Devstral, an AI model specialized in software development."""
        `,
      });

      // Train in batches
      const batchSize = 10;
      for (let i = 0; i < formattedData.length; i += batchSize) {
        const batch = formattedData.slice(i, i + batchSize);
        const metrics = await this.ollama.train(this.modelName, {
          data: batch,
          epochs: 1,
        });

        this.metrics.push(metrics as TrainingMetrics);
        await this.reportProgress(i / formattedData.length);
      }

      console.log('Training completed successfully');
    } catch (error) {
      console.error('Training failed:', error);
      throw error;
    }
  }

  private async reportProgress(progress: number): Promise<void> {
    try {
      await axios.post('/api/training/progress', {
        progress,
        metrics: this.metrics[this.metrics.length - 1],
      });
    } catch (error) {
      console.error('Failed to report training progress:', error);
    }
  }

  async validateModel(): Promise<void> {
    try {
      // Run validation tests
      const validationPrompts = [
        'Create a React component that displays a list of items',
        'Write a function to sort an array in TypeScript',
      ];

      for (const prompt of validationPrompts) {
        const response = await this.ollama.generate({
          model: this.modelName,
          prompt,
        });

        console.log(`Validation result for "${prompt}":`, response);
      }
    } catch (error) {
      console.error('Validation failed:', error);
      throw error;
    }
  }

  async deployModel(): Promise<void> {
    try {
      // Export and deploy the trained model
      await this.ollama.push(this.modelName, {
        insecure: false,
        platform: 'linux/amd64',
      });

      console.log('Model deployed successfully');
    } catch (error) {
      console.error('Deployment failed:', error);
      throw error;
    }
  }
}

export const trainer = new DevstralTrainer();