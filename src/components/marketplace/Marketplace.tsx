import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import GigCard from './GigCard';
import { useUserStore } from '../../lib/store';

const Marketplace: React.FC = () => {
  const user = useUserStore((state) => state.user);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Vibe Coder Marketplace</h1>
        {user?.role === 'vibeCoder' && (
          <Button 
            variant="primary"
            className="w-full md:w-auto"
          >
            Create a Gig
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for gigs..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <Button 
          variant="outline"
          icon={<Filter className="h-5 w-5" />}
        >
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder gigs - will be replaced with real data */}
        <GigCard
          title="AI-Assisted Python Script Development"
          description="Custom Python scripts developed with AI assistance for data processing, automation, or any specific task you need."
          price={50}
          deliveryTime="2-3 days"
          seller={{
            name: "Alex Chen",
            rating: 4.8,
            totalGigs: 156
          }}
          tags={["Python", "Automation", "AI-Assisted"]}
        />
        <GigCard
          title="Rapid Web App Prototyping"
          description="Quick turnaround web application prototypes using React and modern tools. Perfect for validating ideas fast."
          price={150}
          deliveryTime="3-5 days"
          seller={{
            name: "Sarah Kim",
            rating: 4.9,
            totalGigs: 243
          }}
          tags={["React", "Prototyping", "Web Development"]}
        />
      </div>
    </div>
  );
};

export default Marketplace;