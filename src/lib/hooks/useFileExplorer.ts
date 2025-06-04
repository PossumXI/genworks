import { useState, useCallback } from 'react';
import { useEditorStore, useToastStore } from '../store';
import { fileManager } from '../file-manager';

export const useFileExplorer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { createFile, deleteFile, renameFile } = useEditorStore();
  const { addToast } = useToastStore();

  const handleCreateFile = useCallback(async (folderPath: string) => {
    const fileName = prompt('Enter file name:');
    if (!fileName) return;

    setIsLoading(true);
    try {
      const filePath = `${folderPath}/${fileName}`;
      await fileManager.createFile(filePath);
      createFile(filePath, '');
      addToast({
        title: 'File Created',
        description: `Created ${fileName}`,
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Create Failed',
        description: error instanceof Error ? error.message : 'Failed to create file',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [createFile, addToast]);

  const handleDeleteFile = useCallback(async (path: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    setIsLoading(true);
    try {
      await fileManager.deleteFile(path);
      deleteFile(path);
      addToast({
        title: 'File Deleted',
        description: `Deleted ${path}`,
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Failed to delete file',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [deleteFile, addToast]);

  const handleRenameFile = useCallback(async (oldPath: string, newName: string) => {
    if (!newName) return;

    setIsLoading(true);
    try {
      const newPath = oldPath.replace(/[^/]+$/, newName);
      await fileManager.renameFile(oldPath, newPath);
      renameFile(oldPath, newPath);
      addToast({
        title: 'File Renamed',
        description: `Renamed to ${newName}`,
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Rename Failed',
        description: error instanceof Error ? error.message : 'Failed to rename file',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [renameFile, addToast]);

  return {
    isLoading,
    handleCreateFile,
    handleDeleteFile,
    handleRenameFile
  };
};