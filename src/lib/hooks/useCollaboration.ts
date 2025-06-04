import { useState, useEffect, useCallback } from 'react';
import { useEditorStore, useToastStore } from '../store';
import { setupCollaboration, getConnectedUsers } from '../collaboration';
import { editor } from 'monaco-editor';

export const useCollaboration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]);
  const [editorInstance, setEditorInstance] = useState<editor.IStandaloneCodeEditor | null>(null);
  const { currentFile } = useEditorStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    if (!currentFile || !editorInstance) return;

    const { cleanup } = setupCollaboration(editorInstance, currentFile);
    setIsConnected(true);
    
    const updateUsers = () => {
      setConnectedUsers(getConnectedUsers());
    };
    
    updateUsers();
    const interval = setInterval(updateUsers, 5000);

    return () => {
      cleanup();
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [currentFile, editorInstance]);

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    setEditorInstance(editor);
  };

  const inviteUser = useCallback(async (email: string) => {
    if (!currentFile) {
      addToast({
        title: 'No File Selected',
        description: 'Please select a file to share',
        type: 'warning'
      });
      return;
    }

    try {
      const response = await fetch('/api/collaboration/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, file: currentFile })
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      addToast({
        title: 'Invitation Sent',
        description: `Invited ${email} to collaborate`,
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Invitation Failed',
        description: error instanceof Error ? error.message : 'Failed to send invitation',
        type: 'error'
      });
    }
  }, [currentFile, addToast]);

  const shareLink = useCallback(async () => {
    if (!currentFile) {
      addToast({
        title: 'No File Selected',
        description: 'Please select a file to share',
        type: 'warning'
      });
      return;
    }

    try {
      const response = await fetch('/api/collaboration/share-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: currentFile })
      });

      if (!response.ok) {
        throw new Error('Failed to generate share link');
      }

      const { shareUrl } = await response.json();
      await navigator.clipboard.writeText(shareUrl);

      addToast({
        title: 'Link Copied',
        description: 'Collaboration link copied to clipboard',
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Share Failed',
        description: error instanceof Error ? error.message : 'Failed to generate share link',
        type: 'error'
      });
    }
  }, [currentFile, addToast]);

  return {
    isConnected,
    connectedUsers,
    inviteUser,
    shareLink,
    handleEditorMount
  };
};