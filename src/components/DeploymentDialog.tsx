import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Rocket, Server, Globe } from 'lucide-react';
import { Button } from './ui/Button';
import { useToastStore } from '../lib/store';

interface DeploymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (config: DeploymentConfig) => void;
}

interface DeploymentConfig {
  provider: 'netlify';
  buildCommand: string;
  outputDir: string;
  environmentVariables: Record<string, string>;
}

const DeploymentDialog: React.FC<DeploymentDialogProps> = ({ isOpen, onClose, onDeploy }) => {
  const [config, setConfig] = useState<DeploymentConfig>({
    provider: 'netlify',
    buildCommand: 'npm run build',
    outputDir: 'dist',
    environmentVariables: {},
  });

  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvValue, setNewEnvValue] = useState('');
  const { addToast } = useToastStore();

  const handleAddEnvironmentVariable = () => {
    if (!newEnvKey.trim()) {
      addToast({
        title: 'Error',
        description: 'Please enter a key for the environment variable',
        type: 'error',
      });
      return;
    }

    setConfig((prev) => ({
      ...prev,
      environmentVariables: {
        ...prev.environmentVariables,
        [newEnvKey]: newEnvValue,
      },
    }));

    setNewEnvKey('');
    setNewEnvValue('');
  };

  const handleRemoveEnvironmentVariable = (key: string) => {
    setConfig((prev) => {
      const newEnvVars = { ...prev.environmentVariables };
      delete newEnvVars[key];
      return {
        ...prev,
        environmentVariables: newEnvVars,
      };
    });
  };

  const handleDeploy = () => {
    onDeploy(config);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-purple-600" />
                    Deploy Project
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deployment Provider
                    </label>
                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <Server className="h-6 w-6 text-purple-600" />
                      <div>
                        <h4 className="font-medium text-purple-900">Netlify</h4>
                        <p className="text-sm text-purple-700">
                          Deploy your project to Netlify's global edge network
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Build Command
                    </label>
                    <input
                      type="text"
                      value={config.buildCommand}
                      onChange={(e) => setConfig({ ...config, buildCommand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Output Directory
                    </label>
                    <input
                      type="text"
                      value={config.outputDir}
                      onChange={(e) => setConfig({ ...config, outputDir: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Environment Variables
                    </label>
                    <div className="space-y-3">
                      {Object.entries(config.environmentVariables).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={key}
                            readOnly
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={value}
                            readOnly
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEnvironmentVariable(key)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newEnvKey}
                          onChange={(e) => setNewEnvKey(e.target.value)}
                          placeholder="Key"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={newEnvValue}
                          onChange={(e) => setNewEnvValue(e.target.value)}
                          placeholder="Value"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddEnvironmentVariable}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <Globe className="h-5 w-5" />
                      <span className="font-medium">Deployment Preview</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your project will be built using <code>{config.buildCommand}</code> and
                      the contents of <code>{config.outputDir}</code> will be deployed to
                      Netlify's global CDN.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      icon={<Rocket className="h-4 w-4" />}
                      onClick={handleDeploy}
                    >
                      Deploy to Netlify
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeploymentDialog;