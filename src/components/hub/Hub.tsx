import React, { useState } from 'react';
import { Search, Filter, Plus, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import PromptCard from './PromptCard';
import SharePromptDialog from './SharePromptDialog';
import { useUserStore } from '../../lib/store';

const Hub: React.FC = () => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prompt & Result Hub</h1>
          <p className="text-gray-600 mt-2">Discover, share, and discuss AI prompts and their results</p>
        </div>
        <Button 
          variant="primary"
          icon={<Plus className="h-5 w-5" />}
          onClick={() => setIsShareDialogOpen(true)}
        >
          Share Prompt
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search prompts..."
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

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <TrendingUp className="h-4 w-4" />
        <span>Trending Topics:</span>
        {['React Components', 'Python Automation', 'Data Processing'].map((topic) => (
          <button
            key={topic}
            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromptCard
          title="Generate React Component with Tailwind"
          prompt="Create a responsive navigation bar component using React and Tailwind CSS with mobile menu support"
          result={'function Navbar() {\n  return (\n    <nav className="bg-white shadow">\n      {/* Component code */}\n    </nav>\n  );\n}'}
          tags={['React', 'Tailwind CSS', 'Component']}
          user={{
            name: "Alex Chen",
            reputation: 1250
          }}
          stats={{
            upvotes: 45,
            shares: 12,
            comments: 8
          }}
        />
        <PromptCard
          title="Python Data Processing Script"
          prompt="Write a Python script to process CSV files, calculate statistics, and generate visualizations using pandas and matplotlib"
          result={'import pandas as pd\nimport matplotlib.pyplot as plt\n\ndef process_data(file_path):\n    # Processing logic\n    pass'}
          tags={['Python', 'Data Analysis', 'Pandas']}
          user={{
            name: "Sarah Kim",
            reputation: 890
          }}
          stats={{
            upvotes: 32,
            shares: 8,
            comments: 5
          }}
        />
      </div>

      <SharePromptDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      />
    </div>
  );
};

export default Hub;