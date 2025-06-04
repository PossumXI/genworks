import React from 'react';
import { Brain, GitBranch, GitCommit, GitMerge } from 'lucide-react';
import { format } from 'date-fns';
import { Chart } from './Chart';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';

interface TrainingMetric {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
}

const AITrainingMetrics: React.FC = () => {
  const metrics: TrainingMetric[] = [
    {
      name: 'Training Accuracy',
      value: '94.8%',
      change: '+2.3%',
      trend: 'up',
      description: 'Model prediction accuracy on validation set'
    },
    {
      name: 'Data Quality Score',
      value: '89.2%',
      change: '+1.5%',
      trend: 'up',
      description: 'Average quality score of training data'
    },
    {
      name: 'Active Learning Rate',
      value: '0.85',
      change: '+0.05',
      trend: 'up',
      description: 'Rate of model improvement from user feedback'
    },
    {
      name: 'Training Time',
      value: '4.2h',
      change: '-15.3%',
      trend: 'down',
      description: 'Average time per training iteration'
    }
  ];

  const trainingData = Array.from({ length: 30 }, (_, i) => ({
    date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'MMM dd'),
    accuracy: 85 + Math.random() * 10,
    quality: 80 + Math.random() * 15,
  })).reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">AI Training Pipeline</h2>
        <Badge variant="success" size="lg">
          Training Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Tooltip
            key={metric.name}
            content={metric.description}
            placement="top"
          >
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-help">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            </div>
          </Tooltip>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Training Progress</h3>
          <Chart
            data={trainingData}
            lines={[
              { key: 'accuracy', name: 'Model Accuracy', color: '#8b5cf6' },
              { key: 'quality', name: 'Data Quality', color: '#ec4899' },
            ]}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Pipeline Status</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <Brain className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="font-medium text-green-900">Model Training</div>
                <div className="text-sm text-green-700">Active - Iteration 245</div>
              </div>
              <Badge variant="success">Running</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <GitBranch className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <div className="font-medium text-purple-900">Data Collection</div>
                <div className="text-sm text-purple-700">15.2K new samples today</div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <GitCommit className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium text-blue-900">Validation</div>
                <div className="text-sm text-blue-700">Last run: 15 minutes ago</div>
              </div>
              <Badge variant="info">Scheduled</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-pink-50 rounded-lg">
              <GitMerge className="h-5 w-5 text-pink-600" />
              <div className="flex-1">
                <div className="font-medium text-pink-900">Model Deployment</div>
                <div className="text-sm text-pink-700">Next update in 2 hours</div>
              </div>
              <Badge variant="warning">Pending</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITrainingMetrics;