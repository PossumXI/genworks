import { trainingPipeline } from '../src/lib/training-pipeline.ts';
import { useToastStore } from '../src/lib/store.ts';

async function runTrainingPipeline() {
  const addToast = useToastStore.getState().addToast;

  try {
    console.log('Starting training pipeline...');
    addToast({
      title: 'Training Started',
      description: 'Fetching training data...',
      type: 'info'
    });

    // Fetch and preprocess training data
    const trainingData = await trainingPipeline.fetchTrainingData();
    
    // Train the model
    console.log('Training model...');
    addToast({
      title: 'Training Progress',
      description: 'Model training in progress...',
      type: 'info'
    });
    
    await trainingPipeline.trainModel(trainingData);

    // Validate the model
    console.log('Validating model...');
    addToast({
      title: 'Training Progress',
      description: 'Validating model...',
      type: 'info'
    });
    
    await trainingPipeline.validateModel();

    // Deploy the model
    console.log('Deploying model...');
    addToast({
      title: 'Training Progress',
      description: 'Deploying model...',
      type: 'info'
    });
    
    await trainingPipeline.deployModel();

    console.log('Training pipeline completed successfully!');
    addToast({
      title: 'Training Complete',
      description: 'Model has been successfully trained and deployed',
      type: 'success'
    });
  } catch (error) {
    console.error('Training pipeline failed:', error);
    addToast({
      title: 'Training Failed',
      description: error.message || 'An error occurred during training',
      type: 'error'
    });
    process.exit(1);
  }
}

runTrainingPipeline();