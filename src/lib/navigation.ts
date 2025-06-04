import { useNavigate, useLocation } from 'react-router-dom';
import { useToastStore } from './store';
import { SearchResult } from './types';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToastStore();

  const navigateTo = (path: string, title: string) => {
    if (location.pathname !== path) {
      navigate(path);
      addToast({
        title: 'Navigating',
        description: `Going to ${title}`,
        type: 'info'
      });
    }
  };

  const handleSearchResult = (result: SearchResult) => {
    navigateTo(result.path, result.title);
  };

  const handleVoiceCommand = (transcript: string) => {
    const command = transcript.toLowerCase();

    if (command.includes('open') || command.includes('go to')) {
      if (command.includes('deepwiki') || command.includes('ide')) {
        navigateTo('/deepwiki', 'DeepWiki IDE');
      } else if (command.includes('hub') || command.includes('prompt')) {
        navigateTo('/hub', 'Prompt & Result Hub');
      } else if (command.includes('marketplace') || command.includes('market')) {
        navigateTo('/marketplace', 'Marketplace');
      } else if (command.includes('analytics') || command.includes('dashboard')) {
        navigateTo('/analytics', 'Analytics Dashboard');
      } else if (command.includes('settings')) {
        navigateTo('/settings', 'Settings');
      } else {
        addToast({
          title: 'Voice Command',
          description: 'Command not recognized. Please try again.',
          type: 'error'
        });
      }
    }
  };

  return {
    navigateTo,
    handleSearchResult,
    handleVoiceCommand,
    currentPath: location.pathname
  };
};