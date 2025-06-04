import React from 'react';
import { Activity, Users, Clock, Zap } from 'lucide-react';
import { Chart } from './Chart';
import { Badge } from '../ui/Badge';
import { format, subDays } from 'date-fns';

const PerformanceMetrics: React.FC = () => {
  const performanceData = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'MMM dd'),
    latency: 100 + Math.random() * 50,
    requests: 1000 + Math.random() * 500,
    errors: Math.random() * 10,
  }));

  const stats = [
    {
      name: 'Active Users',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      name: 'Avg. Response Time',
      value: '124ms',
      change: '-8.3%',
      icon: Clock,
      color: 'text-green-600',
    },
    {
      name: 'Request Rate',
      value: '1.2K/min',
      change: '+15.7%',
      icon: Activity,
      color: 'text-purple-600',
    },
    {
      name: 'System Load',
      value: '67%',
      change: '+5.2%',
      icon: Zap,
      color: 'text-yellow-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-opacity-10 ${stat.color.replace('text', 'bg')}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Response Time & Requests</h3>
            <Badge variant="success">Healthy</Badge>
          </div>
          <Chart
            data={performanceData}
            lines={[
              { key: 'latency', name: 'Response Time (ms)', color: '#8b5cf6' },
              { key: 'requests', name: 'Requests/min', color: '#2563eb' },
            ]}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Error Rate</h3>
            <Badge variant="success">Low</Badge>
          </div>
          <Chart
            data={performanceData}
            lines={[
              { key: 'errors', name: 'Errors/min', color: '#dc2626' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;