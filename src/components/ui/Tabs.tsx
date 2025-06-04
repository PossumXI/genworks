import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].id);

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8\" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="py-6"
      >
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </motion.div>
    </div>
  );
};