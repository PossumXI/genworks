import React from 'react';
import AITrainingMetrics from './AITrainingMetrics';
import PerformanceMetrics from './PerformanceMetrics';
import RealTimeMonitor from './RealTimeMonitor';
import { Tabs } from '../ui/Tabs';

const Analytics: React.FC = () => {
  const tabs = [
    { id: 'ai-training', label: 'AI Training', content: <AITrainingMetrics /> },
    { id: 'performance', label: 'Performance', content: <PerformanceMetrics /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor AI training progress and platform metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs tabs={tabs} defaultTab="ai-training" />
        </div>
        <div className="lg:col-span-1">
          <RealTimeMonitor />
        </div>
      </div>
    </div>
  );
};

export default Analytics;