import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ArrowRight, Code, Database, Users, History, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { search, SearchResult, getRecentSearches, saveRecentSearch } from '../lib/search';
import { useToastStore } from '../lib/store';

export const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setResults(search(query));
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    if (query.trim()) {
      saveRecentSearch(query);
      setRecentSearches(getRecentSearches());
    }
    
    navigate(result.path);
    setIsOpen(false);
    setQuery('');
    
    addToast({
      title: 'Navigating',
      description: `Going to ${result.title}`,
      type: 'info'
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="h-5 w-5" />;
      case 'Database': return <Database className="h-5 w-5" />;
      case 'Users': return <Users className="h-5 w-5" />;
      default: return <ArrowRight className="h-5 w-5" />;
    }
  };

  return (
    <div className="relative max-w-2xl w-full mx-auto">
      <div
        className="flex items-center gap-3 w-full px-6 py-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-text group"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search GenWorks or press '/' to start..."
          className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <kbd className="hidden sm:inline-flex h-6 px-2 items-center justify-center rounded border bg-gray-50 font-mono text-sm text-gray-400">
          /
        </kbd>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
            >
              <div className="p-2">
                {results.length > 0 ? (
                  results.map((result, index) => (
                    <motion.button
                      key={result.path}
                      className={`flex items-center gap-4 w-full p-4 rounded-xl transition-colors text-left group ${
                        index === selectedIndex ? 'bg-purple-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelect(result)}
                      whileHover={{ x: 4 }}
                    >
                      <div className={`w-12 h-12 rounded-xl ${
                        index === selectedIndex ? 'bg-purple-100' : 'bg-gray-100'
                      } flex items-center justify-center`}>
                        {getIcon(result.icon)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{result.title}</h3>
                        <p className="text-sm text-gray-500">{result.description}</p>
                      </div>
                      <ArrowRight className={`h-5 w-5 ${
                        index === selectedIndex ? 'opacity-100' : 'opacity-0'
                      } group-hover:opacity-100 transition-opacity`} />
                    </motion.button>
                  ))
                ) : query ? (
                  <div className="p-4 text-center text-gray-500">
                    No results found for "{query}"
                  </div>
                ) : recentSearches.length > 0 ? (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 text-left"
                          onClick={() => setQuery(search)}
                        >
                          <History className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="p-2 border-t">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Command className="h-3 w-3" />
                    <span>Quick Navigation</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">↑</kbd>{' '}
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded">↓</kbd> to navigate
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};