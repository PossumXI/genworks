import Fuse from 'fuse.js';
import { SearchResult } from './types';
import { Code, Database, Users, BarChart, Settings, FileCode, Brain, Globe } from 'lucide-react';

// Real search index with actual routes and features
const searchIndex: SearchResult[] = [
  {
    id: 'deepwiki',
    title: 'DeepWiki IDE',
    description: 'AI-powered development environment',
    path: '/deepwiki',
    icon: Code,
    keywords: ['code', 'develop', 'ide', 'editor', 'ai', 'programming'],
    category: 'feature'
  },
  {
    id: 'hub',
    title: 'Prompt & Result Hub',
    description: 'Share and discover AI prompts',
    path: '/hub',
    icon: Database,
    keywords: ['prompts', 'share', 'community', 'examples', 'templates'],
    category: 'feature'
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Connect with vibe coders',
    path: '/marketplace',
    icon: Users,
    keywords: ['hire', 'work', 'collaborate', 'projects', 'freelance'],
    category: 'feature'
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'Monitor AI training and platform metrics',
    path: '/analytics',
    icon: BarChart,
    keywords: ['metrics', 'stats', 'monitoring', 'performance', 'data'],
    category: 'page'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure your account and preferences',
    path: '/settings',
    icon: Settings,
    keywords: ['account', 'preferences', 'configuration', 'profile'],
    category: 'page'
  },
  {
    id: 'templates',
    title: 'Project Templates',
    description: 'Ready-to-use project templates',
    path: '/hub/templates',
    icon: FileCode,
    keywords: ['templates', 'boilerplate', 'starter', 'examples'],
    category: 'component'
  },
  {
    id: 'ai-training',
    title: 'AI Training',
    description: 'Monitor and manage AI model training',
    path: '/analytics/training',
    icon: Brain,
    keywords: ['ai', 'training', 'model', 'machine learning'],
    category: 'component'
  },
  {
    id: 'deployment',
    title: 'Deployment',
    description: 'Deploy your projects to production',
    path: '/deepwiki/deploy',
    icon: Globe,
    keywords: ['deploy', 'production', 'hosting', 'publish'],
    category: 'component'
  }
];

const fuseOptions = {
  keys: ['title', 'description', 'keywords'],
  threshold: 0.3,
  includeScore: true,
  shouldSort: true,
  minMatchCharLength: 2
};

const fuse = new Fuse(searchIndex, fuseOptions);

export const search = (query: string): SearchResult[] => {
  if (!query.trim()) {
    return searchIndex;
  }

  return fuse.search(query).map(result => result.item);
};

export const getRecentSearches = (): string[] => {
  try {
    const searches = localStorage.getItem('recentSearches');
    return searches ? JSON.parse(searches) : [];
  } catch {
    return [];
  }
};

export const saveRecentSearch = (query: string) => {
  try {
    const searches = getRecentSearches();
    const newSearches = [query, ...searches.filter(s => s !== query)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  } catch {
    console.error('Failed to save recent search');
  }
};

export const clearRecentSearches = () => {
  localStorage.removeItem('recentSearches');
};

export const getSearchSuggestions = (query: string): string[] => {
  const results = search(query);
  return results.slice(0, 5).map(result => result.title);
};

export const getCategoryResults = (category: SearchResult['category']): SearchResult[] => {
  return searchIndex.filter(result => result.category === category);
};