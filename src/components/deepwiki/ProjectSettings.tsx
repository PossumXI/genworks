import React, { useState } from 'react';
import { Save, Archive, Trash2, GitBranch, Package } from 'lucide-react';

// Simple Button component
const Button = ({ 
  children, 
  variant = 'default', 
  className = '', 
  icon, 
  onClick,
  ...props 
}: {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'outline';
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) => {
  const baseClasses = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500';
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

// Simple Badge component
const Badge = ({ 
  children, 
  variant = 'default' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'info' | 'success' | 'warning' 
}) => {
  const baseClasses = 'inline-flex items-center px-3 py-1 text-sm font-medium rounded-full';
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

// Simple Toast notification
const Toast = ({ 
  title, 
  description, 
  type, 
  onClose 
}: { 
  title: string; 
  description: string; 
  type: 'success' | 'error' | 'info'; 
  onClose: () => void;
}) => {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 p-4 border rounded-lg shadow-lg ${typeClasses[type]} z-50`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm mt-1">{description}</p>
        </div>
        <button 
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const ProjectSettings: React.FC = () => {
  const [toast, setToast] = useState<{
    title: string;
    description: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const [projectName, setProjectName] = useState('My Awesome Project');
  const [description, setDescription] = useState('A revolutionary web application built with AI assistance.');
  const [framework, setFramework] = useState('React + Vite');
  const [nodeVersion, setNodeVersion] = useState('v20.x (Latest LTS)');

  const addToast = (toastData: { title: string; description: string; type: 'success' | 'error' | 'info' }) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    addToast({
      title: 'Project settings saved',
      description: 'Your changes have been saved successfully.',
      type: 'success',
    });
  };

  const handleAction = (action: string) => {
    addToast({
      title: `${action} initiated`,
      description: `${action} operation has been started.`,
      type: 'info',
    });
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 text-xl">Project Settings</h3>
        <Badge variant="info">Development</Badge>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Framework
              </label>
              <select 
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option>React + Vite</option>
                <option>Next.js</option>
                <option>Vue.js</option>
                <option>Svelte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Node Version
              </label>
              <select 
                value={nodeVersion}
                onChange={(e) => setNodeVersion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option>v20.x (Latest LTS)</option>
                <option>v18.x</option>
                <option>v16.x</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Project Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="justify-start"
            icon={<GitBranch className="h-4 w-4" />}
            onClick={() => handleAction('Create Branch')}
          >
            Create Branch
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            icon={<Package className="h-4 w-4" />}
            onClick={() => handleAction('Export Project')}
          >
            Export Project
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            icon={<Archive className="h-4 w-4" />}
            onClick={() => handleAction('Archive Project')}
          >
            Archive Project
          </Button>
          <Button
            variant="outline"
            className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => handleAction('Delete Project')}
          >
            Delete Project
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          icon={<Save className="h-4 w-4" />}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProjectSettings;