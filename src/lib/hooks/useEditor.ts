import { useState, useCallback } from 'react';
import { useEditorStore, useToastStore } from '../store';
import { fileManager } from '../file-manager';
import { editor } from 'monaco-editor';

export const useEditor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentFile, files, updateFile } = useEditorStore();
  const { addToast } = useToastStore();
  const [editorInstance, setEditorInstance] = useState<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    setEditorInstance(editor);
  };

  const saveFile = useCallback(async () => {
    if (!currentFile) {
      addToast({
        title: 'No File Selected',
        description: 'Please select a file to save',
        type: 'warning'
      });
      return;
    }

    setIsLoading(true);
    try {
      await fileManager.saveFile(currentFile, files[currentFile]);
      addToast({
        title: 'File Saved',
        description: `Successfully saved ${currentFile}`,
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Failed to save file',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentFile, files, addToast]);

  const formatCode = useCallback(async () => {
    if (!currentFile || !editorInstance) {
      addToast({
        title: 'Cannot Format',
        description: 'No file selected or editor not ready',
        type: 'warning'
      });
      return;
    }

    setIsLoading(true);
    try {
      editorInstance.getAction('editor.action.formatDocument')?.run();
      addToast({
        title: 'Code Formatted',
        description: 'Successfully formatted code',
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Format Failed',
        description: 'Failed to format code',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentFile, editorInstance, addToast]);

  const runFile = useCallback(async () => {
    if (!currentFile) {
      addToast({
        title: 'No File Selected',
        description: 'Please select a file to run',
        type: 'warning'
      });
      return;
    }

    setIsLoading(true);
    try {
      const extension = currentFile.split('.').pop()?.toLowerCase();
      
      switch (extension) {
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
          await fileManager.runNodeScript(currentFile);
          break;
        case 'py':
          await fileManager.runPythonScript(currentFile);
          break;
        default:
          throw new Error(`Unsupported file type: ${extension}`);
      }

      addToast({
        title: 'File Running',
        description: `Running ${currentFile}`,
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Run Failed',
        description: error instanceof Error ? error.message : 'Failed to run file',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentFile, addToast]);

  return {
    isLoading,
    saveFile,
    formatCode,
    runFile,
    handleEditorMount
  };
};