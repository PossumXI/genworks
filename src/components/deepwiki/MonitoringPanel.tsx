import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Users, Brain } from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

interface DataPoint {
  time: string;
  cpu: number;
  memory: number;
  latency: number;
}

// Simple Badge component
const Badge = ({ children, variant = 'default', size = 'default' }: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'info' | 'warning';
  size?: 'default' | 'sm';
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

// Simple Tooltip component
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-10">
          {content}
        </div>
      )}
    </div>
  );
};

// Simple Chart component
const SimpleChart = ({ data, lines }: { data: DataPoint[]; lines: Array<{ key: keyof DataPoint; name: string; color: string }> }) => {
  const maxValues = lines.reduce((acc, line) => {
    acc[line.key] = Math.max(...data.map(d => typeof d[line.key] === 'number' ? d[line.key] as number : 0));
    return acc;
  }, {} as Record<string, number>);

  const getY = (value: number, max: number) => {
    return 100 - (value / max) * 80; // 80% of chart height
  };

  return (
    <div className="w-full h-48 bg-gray-50 rounded relative">
      <svg className="w-full h-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1="0"
            y1={`${y}%`}
            x2="100%"
            y2={`${y}%`}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Data lines */}
        {lines.map(line => {
          const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = getY(d[line.key] as number, maxValues[line.key]);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polyline
              key={line.key}
              fill="none"
              stroke={line.color}
              strokeWidth="2"
              points={points}
            />
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute top-2 right-2 bg-white p-2 rounded shadow-sm">
        {lines.map(line => (
          <div key={line.key} className="flex items-center gap-2 text-xs">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: line.color }}
            />
            <span>{line.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MonitoringPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      name: 'CPU Usage',
      value: '45%',
      change: '+5%',
      trend: 'up',
      icon: Cpu,
    },
    {
      id: 'memory',
      name: 'Memory',
      value: '2.8GB',
      change: '-0.2GB',
      trend: 'down',
      icon: Activity,
    },
    {
      id: 'storage',
      name: 'Storage',
      value: '156MB',
      change: '+12MB',
      trend: 'up',
      icon: HardDrive,
    },
  ]);

  const [performanceData, setPerformanceData] = useState<DataPoint[]>(() => 
    Array.from({ length: 30 }, (_, i) => ({
      time: new Date(Date.now() - i * 60000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      latency: Math.random() * 200,
    })).reverse()
  );

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.id === 'cpu' ? `${Math.floor(Math.random() * 100)}%` :
               metric.id === 'memory' ? `${(Math.random() * 4 + 1).toFixed(1)}GB` :
               `${Math.floor(Math.random() * 500 + 100)}MB`,
        change: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 10)}${metric.id === 'memory' ? 'GB' : metric.id === 'storage' ? 'MB' : '%'}`,
        trend: Math.random() > 0.5 ? 'up' : 'down',
      })));

      // Update performance data
      setPerformanceData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          latency: Math.random() * 200,
        }];
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 text-xl">System Monitor</h3>
        <Badge variant="success">Healthy</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Tooltip key={metric.id} content={`Last updated: ${getCurrentTime()}`}>
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <metric.icon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{metric.name}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
          </Tooltip>
        ))}
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">Performance</h4>
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">Real-time</Badge>
            <Badge variant="success" size="sm">60 fps</Badge>
          </div>
        </div>
        <SimpleChart
          data={performanceData}
          lines={[
            { key: 'cpu', name: 'CPU Usage', color: '#8b5cf6' },
            { key: 'memory', name: 'Memory Usage', color: '#ec4899' },
            { key: 'latency', name: 'Latency (ms)', color: '#14b8a6' },
          ]}
        />
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">Active Sessions</h4>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">3 users</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Sarah Kim', status: 'Editing main.tsx', time: '2m ago' },
            { name: 'Alex Chen', status: 'Viewing components/', time: '5m ago' },
            { name: 'Mike Johnson', status: 'Idle', time: '12m ago' },
          ].map((user) => (
            <div
              key={user.name}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.status}</div>
                </div>
              </div>
              <span className="text-xs text-gray-500">{user.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">AI Model Status</h4>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            <Badge variant="success" size="sm">Active</Badge>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Response Time</span>
            <span className="text-sm font-medium text-gray-900">124ms</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Requests/min</span>
            <span className="text-sm font-medium text-gray-900">42</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Cache Hit Rate</span>
            <span className="text-sm font-medium text-gray-900">87%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Model Version</span>
            <span className="text-sm font-medium text-gray-900">v2.4.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPanel;