import { create } from 'zustand';
import { ChatMessage, GencodingState } from './types';

interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'vibeCoder' | 'client' | 'hubContributor';
  } | null;
  setUser: (user: UserState['user']) => void;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      set({ user: null });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}));

interface EditorState {
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

export const useEditorStore = create<EditorState>((set, get) => ({
  currentFile: null,
  files: {},
  expandedFolders: new Set(['/src']),
  setCurrentFile: (file) => set({ currentFile: file }),
  updateFile: (path, content) => 
    set((state) => ({
      files: { ...state.files, [path]: content },
    })),
  setFiles: (files) => set({ files }),
  toggleFolder: (path) =>
    set((state) => {
      const newExpanded = new Set(state.expandedFolders);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return { expandedFolders: newExpanded };
    }),
  createFile: (path, content = '') => {
    set((state) => ({
      files: { ...state.files, [path]: content },
      currentFile: path
    }));
  },
  deleteFile: (path) => {
    set((state) => {
      const newFiles = { ...state.files };
      delete newFiles[path];
      return {
        files: newFiles,
        currentFile: state.currentFile === path ? null : state.currentFile
      };
    });
  },
  renameFile: (oldPath, newPath) => {
    set((state) => {
      const newFiles = { ...state.files };
      newFiles[newPath] = newFiles[oldPath];
      delete newFiles[oldPath];
      return {
        files: newFiles,
        currentFile: state.currentFile === oldPath ? newPath : state.currentFile
      };
    });
  }
}));

export const useGencodingStore = create<GencodingState>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
        },
      ],
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  updateMessageStatus: (id, status) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, status } : msg
      ),
    })),
}));

interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).substring(7) },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));