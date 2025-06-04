import { useEditorStore } from './store';
import { useToastStore } from './store';
import api from './api';

class FileManager {
  private baseDir = '/home/project';

  async createFile(path: string, content: string = '') {
    try {
      const response = await api.post('/api/files', {
        path,
        content
      });

      const store = useEditorStore.getState();
      store.updateFile(path, content);
      store.setCurrentFile(path);
      
      useToastStore.getState().addToast({
        title: 'File Created',
        description: `Created ${path}`,
        type: 'success'
      });

      return response.data;
    } catch (error) {
      useToastStore.getState().addToast({
        title: 'Error',
        description: `Failed to create file: ${error}`,
        type: 'error'
      });
      throw error;
    }
  }

  async saveFile(path: string, content: string) {
    try {
      const response = await api.put(`/api/files/${encodeURIComponent(path)}`, {
        content
      });

      useToastStore.getState().addToast({
        title: 'File Saved',
        description: `Saved ${path}`,
        type: 'success'
      });

      return response.data;
    } catch (error) {
      useToastStore.getState().addToast({
        title: 'Error',
        description: `Failed to save file: ${error}`,
        type: 'error'
      });
      throw error;
    }
  }

  async deleteFile(path: string) {
    try {
      await api.delete(`/api/files/${encodeURIComponent(path)}`);
      
      const store = useEditorStore.getState();
      const { files, currentFile } = store;
      
      const newFiles = { ...files };
      delete newFiles[path];
      
      store.setFiles(newFiles);
      if (currentFile === path) {
        store.setCurrentFile(null);
      }

      useToastStore.getState().addToast({
        title: 'File Deleted',
        description: `Deleted ${path}`,
        type: 'success'
      });
    } catch (error) {
      useToastStore.getState().addToast({
        title: 'Error',
        description: `Failed to delete file: ${error}`,
        type: 'error'
      });
      throw error;
    }
  }

  async renameFile(oldPath: string, newPath: string) {
    try {
      await api.post('/api/files/rename', {
        oldPath,
        newPath
      });
      
      const store = useEditorStore.getState();
      const { files, currentFile } = store;
      
      const newFiles = { ...files };
      newFiles[newPath] = newFiles[oldPath];
      delete newFiles[oldPath];
      
      store.setFiles(newFiles);
      if (currentFile === oldPath) {
        store.setCurrentFile(newPath);
      }

      useToastStore.getState().addToast({
        title: 'File Renamed',
        description: `Renamed ${oldPath} to ${newPath}`,
        type: 'success'
      });
    } catch (error) {
      useToastStore.getState().addToast({
        title: 'Error',
        description: `Failed to rename file: ${error}`,
        type: 'error'
      });
      throw error;
    }
  }

  async runNodeScript(path: string) {
    try {
      const response = await api.post('/api/run/node', {
        path
      });

      useToastStore.getState().addToast({
        title: 'Script Running',
        description: `Running ${path}`,
        type: 'success'
      });

      return response.data;
    } catch (error) {
      useToastStore.getState().addToast({
        title: 'Error',
        description: `Failed to run script: ${error}`,
        type: 'error'
      });
      throw error;
    }
  }

  async runPythonScript(path: string) {
    try {
      const response = await api.post('/api/run/python', {
        path
      });

      useToastStore.getState().addToast({
        title: 'Script Running',
        description: `Running ${path}`,
        type: 'success'
      });

      return response.data;
    } catch (error) {
      useToastStore.getState().addToast({
        title: 'Error',
        description: `Failed to run script: ${error}`,
        type: 'error'
      });
      throw error;
    }
  }

  async getFileTree() {
    try {
      const response = await api.get('/api/files/tree');
      return response.data;
    } catch (error) {
      useToastStore.getState().addToast({
        title: 'Error',
        description: `Failed to get file tree: ${error}`,
        type: 'error'
      });
      throw error;
    }
  }
}

export const fileManager = new FileManager();