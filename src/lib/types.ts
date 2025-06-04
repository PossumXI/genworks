export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
  code?: string;
}

export interface GencodingState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  updateMessageStatus: (id: string, status: ChatMessage['status']) => void;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType;
  keywords: string[];
  category: 'feature' | 'page' | 'component';
}

export interface NavigationState {
  currentPath: string;
  history: string[];
  addToHistory: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
}

export interface VoiceCommand {
  command: string;
  action: () => void;
  keywords: string[];
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

export interface EditorState {
  currentFile: string | null;
  files: Record<string, string>;
  expandedFolders: Set<string>;
  setCurrentFile: (file: string | null) => void;
  updateFile: (path: string, content: string) => void;
  setFiles: (files: Record<string, string>) => void;
  toggleFolder: (path: string) => void;
  createFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
}

export interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'vibeCoder' | 'client' | 'hubContributor';
  } | null;
  setUser: (user: UserState['user']) => void;
  logout: () => Promise<void>;
}