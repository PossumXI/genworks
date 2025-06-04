import React, { useState, useEffect } from 'react';
import { Search, Mic, Camera, Sparkles, ArrowRight, Zap, Brain, Globe, ArrowDown, Code, Database, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo3D } from './Logo3D';
import { SearchBar } from './SearchBar';
import { useToastStore } from '../lib/store';

const SearchLanding: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      addToast({
        title: 'Not Supported',
        description: 'Voice search is not supported in your browser',
        type: 'error'
      });
      return;
    }

    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      navigate('/deepwiki');
      addToast({
        title: 'Voice Command',
        description: 'Opening DeepWiki IDE...',
        type: 'info'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
          className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-32 right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-2xl"
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="mb-8"
      >
        <Logo3D className="w-32 h-32" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-700 via-violet-600 to-pink-600 bg-clip-text text-transparent text-center"
      >
        GenWorks
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-gray-600 mb-12 text-center max-w-2xl"
      >
        Your AI-Powered Creative Development Ecosystem
      </motion.p>

      {/* Search Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-2xl px-4"
      >
        <SearchBar />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-3 mt-8"
      >
        <button
          onClick={handleVoiceSearch}
          className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 ${
            isListening
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-white border-gray-200 text-gray-700 hover:border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
          {isListening ? 'Listening...' : 'Voice Search'}
        </button>

        <button
          onClick={() => navigate('/deepwiki')}
          className="px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-700 hover:border-purple-200 hover:bg-purple-50 transition-all flex items-center gap-2"
        >
          <Code className="h-4 w-4" />
          Start Coding
        </button>

        <button
          onClick={() => navigate('/hub')}
          className="px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-700 hover:border-purple-200 hover:bg-purple-50 transition-all flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          Browse Hub
        </button>

        <button
          onClick={() => navigate('/marketplace')}
          className="px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-700 hover:border-purple-200 hover:bg-purple-50 transition-all flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Find Coders
        </button>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 px-4"
      >
        <FeatureCard
          icon={<Zap className="h-6 w-6" />}
          title="DeepWiki IDE"
          description="Start coding with AI assistance and intelligent development tools"
          onClick={() => navigate('/deepwiki')}
        />
        <FeatureCard
          icon={<Brain className="h-6 w-6" />}
          title="Prompt & Result Hub"
          description="Explore and share AI prompts with the creative community"
          onClick={() => navigate('/hub')}
        />
        <FeatureCard
          icon={<Globe className="h-6 w-6" />}
          title="Marketplace"
          description="Connect with vibe coders and discover creative collaborations"
          onClick={() => navigate('/marketplace')}
        />
      </motion.div>

      {/* Bottom Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16 text-center"
      >
        <p className="text-gray-500 text-sm mb-4 flex items-center justify-center gap-2">
          Press '/' to start or explore below
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </p>
      </motion.div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all text-left"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion.button>
  );
};

export default SearchLanding;