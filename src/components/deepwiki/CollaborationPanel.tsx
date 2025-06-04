import React, { useState, useEffect } from 'react';
import { User, MessageSquare, Plus, X, Share2 } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline';
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  lastActive?: string;
  color?: string;
}

// Mock functions to replace missing imports
const mockAddToast = (toast: { title: string; description: string; type: string }) => {
  console.log('Toast:', toast);
};

const mockGetConnectedUsers = (): Array<{ name: string; color: string }> => [
  { name: 'John Doe', color: '#3b82f6' },
  { name: 'Jane Smith', color: '#10b981' },
  { name: 'Bob Wilson', color: '#f59e0b' }
];

const mockOnPresenceChange = (callback: () => void) => {
  // Simulate presence changes
  const interval = setInterval(callback, 30000);
  return () => clearInterval(interval);
};

// Simple Badge component
const Badge = ({ children, variant = 'default', size = 'default', className = '' }: {
  children: React.ReactNode;
  variant?: 'default' | 'info';
  size?: 'default' | 'sm';
  className?: string;
}) => {
  const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    info: 'bg-blue-100 text-blue-800'
  };
  const sizeClasses = {
    default: 'px-2 py-1',
    sm: 'px-1.5 py-0.5 text-xs'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

// Simple Button component
const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  icon, 
  onClick,
  type = 'button',
  className = ''
}: {
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'default' | 'sm';
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}) => {
  const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors';
  const variantClasses = {
    default: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };
  const sizeClasses = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1.5 text-sm'
  };
  
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

// Simple Tooltip component
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-10">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

const CollaborationPanel: React.FC = () => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'editor' | 'viewer'>('editor');
  const [connectedUsers, setConnectedUsers] = useState<Collaborator[]>([]);

  useEffect(() => {
    const updateUsers = () => {
      const users = mockGetConnectedUsers();
      setConnectedUsers(users.map((user) => ({
        id: user.name,
        name: user.name,
        status: 'active' as const,
        role: 'editor' as const,
        lastActive: 'now',
        color: user.color,
      })));
    };

    updateUsers();
    const cleanup = mockOnPresenceChange(updateUsers);
    return cleanup;
  }, []);

  const handleInvite = () => {
    if (!inviteEmail) return;
    mockAddToast({
      title: 'Invitation sent',
      description: `Invitation sent to ${inviteEmail} as ${selectedRole}`,
      type: 'success',
    });
    setInviteEmail('');
    setShowInviteForm(false);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    mockAddToast({
      title: 'Link copied',
      description: 'Project link copied to clipboard',
      type: 'success',
    });
  };

  return (
    <div className="p-4 border-b bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Collaborators</h3>
          <Badge variant="info">{connectedUsers.length}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content="Share Project Link">
            <Button
              variant="ghost"
              size="sm"
              icon={<Share2 className="h-4 w-4" />}
              onClick={handleShareLink}
            />
          </Tooltip>
          <Tooltip content="Invite Collaborator">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setShowInviteForm(true)}
            >
              Invite
            </Button>
          </Tooltip>
        </div>
      </div>

      {showInviteForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">Invite Collaborator</h4>
            <button
              type="button"
              onClick={() => setShowInviteForm(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="colleague@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'editor' | 'viewer')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              onClick={handleInvite}
            >
              Send Invitation
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {connectedUsers.map((collaborator) => (
          <div
            key={collaborator.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ backgroundColor: `${collaborator.color}20`, color: collaborator.color }}
                >
                  {collaborator.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {collaborator.name}
                  </span>
                  <Badge
                    variant="default"
                    size="sm"
                    className="text-gray-700 bg-gray-100"
                  >
                    {collaborator.role}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">
                  {collaborator.lastActive}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip content="Send Message">
                <button className="p-1 rounded hover:bg-gray-100">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationPanel;