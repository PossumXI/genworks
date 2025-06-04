import React from 'react';
import { 
  Shield, Users, Database, Code, BrainCircuit, LineChart, 
  Lock, FileCode, Layers, Workflow, BarChart4, Key 
} from 'lucide-react';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  bgClass: string;
  iconClass: string;
}> = ({ icon, title, description, bgClass, iconClass }) => {
  return (
    <div className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all ${bgClass} group`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${iconClass} transition-all duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <div id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Platform Features</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            GenWorks combines cutting-edge technologies with thoughtful design to create
            a comprehensive ecosystem for AI-powered software development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon={<Users className="h-6 w-6 text-white" />}
            title="Vibe-Based Matching"
            description="Our AI uses natural language processing to match clients with coders based on desired 'vibe' and technical requirements."
            bgClass="bg-white border border-purple-100"
            iconClass="bg-purple-600"
          />
          
          <FeatureCard
            icon={<Database className="h-6 w-6 text-white" />}
            title="Secure Prompt Storage"
            description="Store, version, and share your AI prompts and results with configurable privacy and licensing controls."
            bgClass="bg-white border border-teal-100"
            iconClass="bg-teal-600"
          />
          
          <FeatureCard
            icon={<Code className="h-6 w-6 text-white" />}
            title="Autonomous Coding"
            description="DeepWiki's 'Gencoding' capability can build significant portions of software projects from natural language instructions."
            bgClass="bg-white border border-pink-100"
            iconClass="bg-pink-600"
          />
          
          <FeatureCard
            icon={<BrainCircuit className="h-6 w-6 text-white" />}
            title="Continuous AI Learning"
            description="Devstral AI model continuously improves through a sophisticated MLOps pipeline using data from the Hub."
            bgClass="bg-white border border-indigo-100"
            iconClass="bg-indigo-600"
          />
          
          <FeatureCard
            icon={<LineChart className="h-6 w-6 text-white" />}
            title="Creative Analytics"
            description="Analytics that go beyond metrics to understand how users envision and create with AI tools."
            bgClass="bg-white border border-orange-100"
            iconClass="bg-orange-600"
          />
          
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-white" />}
            title="Secure Payments"
            description="Transactions are managed through a secure escrow system ensuring protection for both clients and developers."
            bgClass="bg-white border border-green-100"
            iconClass="bg-green-600"
          />
          
          <FeatureCard
            icon={<FileCode className="h-6 w-6 text-white" />}
            title="Project Templates"
            description="Access and customize project templates created by top vibe coders to jumpstart your development."
            bgClass="bg-white border border-blue-100"
            iconClass="bg-blue-600"
          />
          
          <FeatureCard
            icon={<Layers className="h-6 w-6 text-white" />}
            title="Microservices Architecture"
            description="Built with a scalable microservices architecture allowing each component to evolve independently."
            bgClass="bg-white border border-gray-100"
            iconClass="bg-gray-700"
          />
          
          <FeatureCard
            icon={<Lock className="h-6 w-6 text-white" />}
            title="Privacy Controls"
            description="Comprehensive privacy settings giving users control over how their data is shared and used for AI training."
            bgClass="bg-white border border-red-100"
            iconClass="bg-red-600"
          />
        </div>
        
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 md:p-12 shadow-lg text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join the GenWorks Ecosystem?</h3>
              <p className="mb-6 opacity-90">
                Whether you're a vibe coder looking to showcase your skills or a client seeking innovative development,
                GenWorks provides the tools and community to make it happen.
              </p>
              <button className="px-6 py-3 bg-white text-purple-700 font-medium rounded-full hover:shadow-lg transition-all">
                Get Early Access
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Workflow className="h-5 w-5 text-white" />
                  <h4 className="font-medium text-white">Open Source</h4>
                </div>
                <p className="text-sm opacity-90">Built on open-source technologies ensuring affordability and control</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart4 className="h-5 w-5 text-white" />
                  <h4 className="font-medium text-white">Scalable</h4>
                </div>
                <p className="text-sm opacity-90">Designed to grow with your needs through modular architecture</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Key className="h-5 w-5 text-white" />
                  <h4 className="font-medium text-white">Secure</h4>
                </div>
                <p className="text-sm opacity-90">Security integrated into every aspect of the platform</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-white" />
                  <h4 className="font-medium text-white">Community</h4>
                </div>
                <p className="text-sm opacity-90">Join a growing community of creative AI-augmented developers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;