import React, { useState, useRef, useEffect } from 'react';
import Split from 'react-split';
import { 
  FolderTree, Play, Save, Share2, Settings, Activity,
  Terminal, Search, GitBranch, Bell, User, ChevronDown,
  Plus, MoreHorizontal, Maximize2, Minimize2, X, Zap,
  Code, Database, Users, Brain
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Logo3D } from '../Logo3D';
import FileExplorer from './FileExplorer';
import Editor from './Editor';
import GencodingPanel from './GencodingPanel';
import CollaborationPanel from './CollaborationPanel';
import MonitoringPanel from './MonitoringPanel';
import { useEditor } from '../../lib/hooks/useEditor';
import { useCollaboration } from '../../lib/hooks/useCollaboration';
import { useToastStore } from '../../lib/store';

export default function DeepWiki() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [activeView, setActiveView] = useState<'gencoding' | 'collaboration' | 'monitoring'>('gencoding');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { saveFile, formatCode, runFile, isLoading } = useEditor();
  const { isConnected, connectedUsers } = useCollaboration();
  const { addToast } = useToastStore();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      title: 'Link Copied',
      description: 'Project link copied to clipboard',
      type: 'success'
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Logo3D className="w-6 h-6" />
            <span className="font-semibold text-gray-900">DeepWiki</span>
          </div>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">main</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Play className="h-4 w-4" />}
            onClick={runFile}
            loading={isLoading}
          >
            Run
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Save className="h-4 w-4" />}
            onClick={saveFile}
            loading={isLoading}
          >
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Share2 className="h-4 w-4" />}
            onClick={handleShare}
          >
            Share
          </Button>
          <div className="h-4 w-px bg-gray-300 mx-2" />
          <Button
            variant="ghost"
            size="sm"
            icon={<Bell className="h-4 w-4" />}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<User className="h-4 w-4" />}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            onClick={toggleFullscreen}
          />
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Split
          sizes={[20, 60, 20]}
          minSize={[200, 500, 250]}
          gutterSize={4}
          className="flex w-full"
        >
          <div className="bg-white border-r border-gray-200">
            <FileExplorer />
          </div>

          {/* Main Editor Area */}
          <div className="flex flex-col">
            <Editor />
            
            {/* Terminal */}
            {showTerminal && (
              <div 
                className="bg-gray-900 text-gray-100"
                style={{ height: terminalHeight }}
              >
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span className="text-sm">Terminal</span>
                  </div>
                  <button
                    onClick={() => setShowTerminal(false)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4 font-mono text-sm">
                  <div className="text-green-400">$ npm run dev</div>
                  <div className="text-gray-300">✓ Project is running on http://localhost:5173</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="bg-white border-l border-gray-200">
            <div className="h-10 flex items-center border-b border-gray-200">
              <div className="flex flex-1">
                <button
                  onClick={() => setActiveView('gencoding')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                    activeView === 'gencoding'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Zap className="h-3 w-3 inline mr-1" />
                  AI
                </button>
                <button
                  onClick={() => setActiveView('collaboration')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                    activeView === 'collaboration'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="h-3 w-3 inline mr-1" />
                  Team
                </button>
                <button
                  onClick={() => setActiveView('monitoring')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                    activeView === 'monitoring'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Activity className="h-3 w-3 inline mr-1" />
                  Monitor
                </button>
              </div>
            </div>
            
            <div className="h-[calc(100%-2.5rem)] overflow-auto">
              {activeView === 'gencoding' && <GencodingPanel />}
              {activeView === 'collaboration' && <CollaborationPanel />}
              {activeView === 'monitoring' && <MonitoringPanel />}
            </div>
          </div>
        </Split>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-6 bg-purple-600 text-white text-xs flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>TypeScript</span>
          </div>
          {isConnected && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>{connectedUsers.length} connected</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="hover:bg-purple-700 px-2 py-0.5 rounded flex items-center gap-1"
          >
            <Terminal className="h-3 w-3" />
            <span>Terminal</span>
          </button>
          <span>Ln 1, Col 1</span>
        </div>
      </div>
    </div>
  );
}