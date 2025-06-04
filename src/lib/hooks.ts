import { useState, useEffect, useCallback } from 'react';
import { useToastStore } from './store';

export const useButtonAction = (
  action: () => Promise<void> | void,
  successMessage?: string,
  errorMessage?: string
) => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToastStore();

  const handleAction = useCallback(async () => {
    setLoading(true);
    try {
      await action();
      if (successMessage) {
        addToast({
          title: 'Success',
          description: successMessage,
          type: 'success'
        });
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: errorMessage || (error instanceof Error ? error.message : 'An error occurred'),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [action, successMessage, errorMessage, addToast]);

  return {
    loading,
    handleAction
  };
};

export const useConfirmAction = (
  action: () => Promise<void> | void,
  confirmMessage: string,
  successMessage?: string,
  errorMessage?: string
) => {
  const { loading, handleAction } = useButtonAction(action, successMessage, errorMessage);

  const handleConfirm = useCallback(() => {
    if (window.confirm(confirmMessage)) {
      handleAction();
    }
  }, [confirmMessage, handleAction]);

  return {
    loading,
    handleConfirm
  };
};

export const useClipboard = () => {
  const { addToast } = useToastStore();

  const copyToClipboard = useCallback(async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast({
        title: 'Copied',
        description: successMessage || 'Copied to clipboard',
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        type: 'error'
      });
    }
  }, [addToast]);

  return { copyToClipboard };
};