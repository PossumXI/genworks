import React from 'react';
import { ThumbsUp, Share2, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';

interface PromptCardProps {
  title: string;
  prompt: string;
  result: string;
  tags: string[];
  user: {
    name: string;
    reputation: number;
  };
  stats: {
    upvotes: number;
    shares: number;
    comments: number;
  };
}

const PromptCard: React.FC<PromptCardProps> = ({
  title,
  prompt,
  result,
  tags,
  user,
  stats,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <div className="text-sm text-gray-600">
              Reputation: {user.reputation}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-gray-900">{title}</h2>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Prompt:</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{prompt}</p>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Result:</h4>
          <pre className="text-sm bg-gray-50 p-3 rounded-lg overflow-x-auto">
            <code className="text-gray-800">{result}</code>
          </pre>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            icon={<ThumbsUp className="h-4 w-4" />}
          >
            {stats.upvotes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<MessageSquare className="h-4 w-4" />}
          >
            {stats.comments}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Share2 className="h-4 w-4" />}
          >
            {stats.shares}
          </Button>
          <div className="ml-auto">
            <Button variant="primary" size="sm">
              Use in DeepWiki
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;