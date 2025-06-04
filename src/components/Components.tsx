import React from 'react';
import { Users, Database, Code, BrainCircuit, ArrowRight } from 'lucide-react';

const Components = () => {
  return (
    <div id="components" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Core Components</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            GenWorks integrates three powerful components into a comprehensive ecosystem, 
            continuously improving through community contributions and AI learning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Marketplace */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-purple-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-30 -mr-10 -mt-10 transition-all duration-500 group-hover:opacity-60"></div>
            
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-sm">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Vibe Coder Marketplace</h3>
            
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">•</span>
                <p className="text-gray-700">Project-based services tailored for vibe coders</p>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">•</span>
                <p className="text-gray-700">AI-assisted matching between clients and coders</p>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">•</span>
                <p className="text-gray-700">Secure payment system with escrow protection</p>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">•</span>
                <p className="text-gray-700">"Vibe-based" search and filtering capabilities</p>
              </li>
            </ul>
            
            <p className="text-sm text-gray-600 italic mb-4">
              "Find the perfect developer who matches your project's creative vibe"
            </p>
            
            <button className="text-purple-700 font-medium hover:text-purple-800 transition-colors flex items-center gap-1 text-sm group">
              Learn more about the Marketplace
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Hub */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-teal-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200 rounded-full blur-2xl opacity-30 -mr-10 -mt-10 transition-all duration-500 group-hover:opacity-60"></div>
            
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-sm">
              <Database className="h-8 w-8 text-teal-600" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Prompt & Result Hub</h3>
            
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-teal-600 font-bold mr-2">•</span>
                <p className="text-gray-700">Secure storage for prompts and generated results</p>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 font-bold mr-2">•</span>
                <p className="text-gray-700">Advanced search with both keyword and vector search</p>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 font-bold mr-2">•</span>
                <p className="text-gray-700">Prompt versioning and comprehensive metadata</p>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 font-bold mr-2">•</span>
                <p className="text-gray-700">Community forums and explicit licensing controls</p>
              </li>
            </ul>
            
            <p className="text-sm text-gray-600 italic mb-4">
              "Share, discover, and discuss AI prompts that drive creative development"
            </p>
            
            <button className="text-teal-700 font-medium hover:text-teal-800 transition-colors flex items-center gap-1 text-sm group">
              Learn more about the Hub
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* DeepWiki */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-pink-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full blur-2xl opacity-30 -mr-10 -mt-10 transition-all duration-500 group-hover:opacity-60"></div>
            
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-sm">
              <Code className="h-8 w-8 text-pink-600" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-800">DeepWiki IDE</h3>
            
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-pink-600 font-bold mr-2">•</span>
                <p className="text-gray-700">Web-based IDE with Monaco Editor foundation</p>
              </li>
              <li className="flex items-start">
                <span className="text-pink-600 font-bold mr-2">•</span>
                <p className="text-gray-700">"Gencoding" with autonomous AI coding agents</p>
              </li>
              <li className="flex items-start">
                <span className="text-pink-600 font-bold mr-2">•</span>
                <p className="text-gray-700">Human-AI collaboration with iterative feedback</p>
              </li>
              <li className="flex items-start">
                <span className="text-pink-600 font-bold mr-2">•</span>
                <p className="text-gray-700">Rapid project scaffolding for immediate focus</p>
              </li>
            </ul>
            
            <p className="text-sm text-gray-600 italic mb-4">
              "Write code with an AI that understands your vision and creative process"
            </p>
            
            <button className="text-pink-700 font-medium hover:text-pink-800 transition-colors flex items-center gap-1 text-sm group">
              Learn more about DeepWiki
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* AI Engine Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12 shadow-sm border border-indigo-100 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white rounded-full w-32 h-32 flex items-center justify-center shadow-md">
                  <BrainCircuit className="h-16 w-16 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Devstral AI Engine</h3>
              <p className="text-gray-700 mb-4">
                At the core of GenWorks is Devstral, a large language model fine-tuned specifically for software engineering.
                Using data from the Prompt & Result Hub, Devstral continuously evolves through a sophisticated MLOps pipeline.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-bold mr-2">•</span>
                  <p className="text-gray-700">Apache 2.0 licensed and deployed with Ollama</p>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-bold mr-2">•</span>
                  <p className="text-gray-700">Continuous fine-tuning with user-contributed data</p>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-bold mr-2">•</span>
                  <p className="text-gray-700">Supervised Fine-Tuning (SFT) and RLHF techniques</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Components;