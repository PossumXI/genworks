import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from './store';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const shortcuts: KeyboardShortcut[] = [
    {
      key: '/',
      action: () => document.querySelector<HTMLInputElement>('[data-search-input]')?.focus(),
      description: 'Focus search'
    },
    {
      key: 'k',
      ctrl: true,
      action: () => document.querySelector<HTMLInputElement>('[data-search-input]')?.focus(),
      description: 'Focus search'
    },
    {
      key: 'h',
      ctrl: true,
      action: () => navigate('/'),
      description: 'Go home'
    },
    {
      key: 'd',
      ctrl: true,
      action: () => navigate('/deepwiki'),
      description: 'Open DeepWiki'
    },
    {
      key: 'm',
      ctrl: true,
      action: () => navigate('/marketplace'),
      description: 'Open Marketplace'
    },
    {
      key: 'p',
      ctrl: true,
      action: () => navigate('/hub'),
      description: 'Open Prompt Hub'
    },
    {
      key: 'a',
      ctrl: true,
      action: () => navigate('/analytics'),
      description: 'Open Analytics'
    },
    {
      key: ',',
      ctrl: true,
      action: () => navigate('/settings'),
      description: 'Open Settings'
    },
    {
      key: 'Escape',
      action: () => document.activeElement instanceof HTMLElement && document.activeElement.blur(),
      description: 'Close modal/blur focus'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const shortcut = shortcuts.find(
        (s) =>
          s.key === event.key &&
          !!s.ctrl === event.ctrlKey &&
          !!s.shift === event.shiftKey &&
          !!s.alt === event.altKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
        addToast({
          title: 'Keyboard Shortcut',
          description: shortcut.description,
          type: 'info'
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, addToast]);

  return shortcuts;
};