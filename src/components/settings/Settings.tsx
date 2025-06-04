import React from 'react';
import { Save, Bell, Lock, User, Palette, Database, Github, Slack, Bird as Jira, Gitlab as GitLab } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { useToastStore } from '../../lib/store';

const Settings: React.FC = () => {
  const { addToast } = useToastStore();

  const handleSave = () => {
    addToast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
      type: 'success',
    });
  };

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-2xl font-semibold text-purple-600">
              JD
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
              <p className="text-gray-600">john.doe@example.com</p>
              <Button variant="outline" size="sm" className="mt-2">
                Change Avatar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="john.doe@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>Vibe Coder</option>
                <option>Client</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Zone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC+1 (Central European Time)</option>
              </select>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
            <div className="space-y-4">
              {[
                'New project invitations',
                'Project updates and comments',
                'AI training completion alerts',
                'Security alerts',
                'Newsletter and platform updates',
              ].map((item) => (
                <label key={item} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
            <div className="space-y-4">
              {[
                'Real-time chat messages',
                'Project milestone completions',
                'Payment notifications',
                'System status updates',
              ].map((item) => (
                <label key={item} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <Button variant="primary">Update Password</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
            <p className="text-gray-600 mb-4">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </div>
      ),
    },
    {
      id: 'appearance',
      label: 'Appearance',
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Theme</h3>
            <div className="grid grid-cols-3 gap-4">
              {['Light', 'Dark', 'System'].map((theme) => (
                <label
                  key={theme}
                  className="relative flex items-center justify-center aspect-video rounded-lg border-2 border-gray-200 cursor-pointer hover:border-purple-500 transition-colors"
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.toLowerCase()}
                    className="sr-only"
                  />
                  <span className="text-gray-700">{theme}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Code Editor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Size
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  {[12, 14, 16, 18, 20].map((size) => (
                    <option key={size}>{size}px</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Family
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  {['Fira Code', 'JetBrains Mono', 'Source Code Pro'].map((font) => (
                    <option key={font}>{font}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'integrations',
      label: 'Integrations',
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Connected Services</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-black rounded-lg">
                    <Github className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">GitHub</h4>
                    <p className="text-sm text-gray-600">Connect your repositories</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#4A154B] rounded-lg">
                    <Slack className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Slack</h4>
                    <p className="text-sm text-gray-600">Get notifications in your workspace</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#0052CC] rounded-lg">
                    <Jira className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Jira</h4>
                    <p className="text-sm text-gray-600">Link tasks and track progress</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#FC6D26] rounded-lg">
                    <GitLab className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">GitLab</h4>
                    <p className="text-sm text-gray-600">Connect your repositories</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">API Access</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value="sk-••••••••••••••••••••••"
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <Button variant="outline">Copy</Button>
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Use this key to authenticate API requests from your applications.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="https://api.genworks.ai/webhooks/your-unique-id"
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <Button variant="outline">Copy</Button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Receive real-time updates about your projects and AI training progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and configurations</p>
        </div>
        <Button variant="primary" icon={<Save className="h-4 w-4" />} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <Tabs tabs={tabs} defaultTab="profile" />
    </div>
  );
};

export default Settings;