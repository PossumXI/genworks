import React, { useEffect, useState } from 'react';
import { Activity, Server, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';

interface Event {
  id: string;
  type: 'request' | 'error' | 'system';
  message: string;
  timestamp: Date;
}

const RealTimeMonitor: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Simulate real-time events
    const interval = setInterval(() => {
      const newEvent: Event = {
        id: Math.random().toString(36).substring(7),
        type: ['request', 'error', 'system'][Math.floor(Math.random() * 3)] as Event['type'],
        message: [
          'New API request processed',
          'Database query completed',
          'Model inference executed',
          'Cache invalidated',
          'Error: Rate limit exceeded',
          'Warning: High memory usage',
        ][Math.floor(Math.random() * 6)],
        timestamp: new Date(),
      };

      setEvents((prev) => [newEvent, ...prev].slice(0, 50));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'request':
        return <Activity className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'system':
        return <Server className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'request':
        return 'text-blue-600 bg-blue-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'system':
        return 'text-purple-600 bg-purple-50';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Real-Time Events</h3>
        <Badge variant="success">Live</Badge>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`flex items-center gap-3 p-2 rounded-lg ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
                <span className="flex-1 text-sm">{event.message}</span>
                <span className="text-xs opacity-75">
                  {format(event.timestamp, 'HH:mm:ss')}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default RealTimeMonitor;