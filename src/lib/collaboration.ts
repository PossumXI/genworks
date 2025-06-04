import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { editor } from 'monaco-editor';
import { useUserStore } from './store';

// Initialize Yjs document
const ydoc = new Y.Doc();

// Connect to WebSocket server
const wsProvider = new WebsocketProvider(
  'wss://collaboration.genworks.ai',
  'genworks-editor',
  ydoc
);

// Track connected users
const awareness = wsProvider.awareness;

export const setupCollaboration = (
  monacoEditor: editor.IStandaloneCodeEditor,
  filepath: string
) => {
  const user = useUserStore.getState().user;
  
  // Set user data for awareness
  awareness.setLocalStateField('user', {
    name: user?.name || 'Anonymous',
    color: getRandomColor(),
    cursor: null,
  });

  // Create text for the current file
  const ytext = ydoc.getText(filepath);

  // Bind Monaco editor to Yjs
  new MonacoBinding(
    ytext,
    monacoEditor.getModel()!,
    new Set([monacoEditor]),
    awareness
  );

  return {
    cleanup: () => {
      wsProvider.disconnect();
      ydoc.destroy();
    },
  };
};

// Get random color for user cursor
const getRandomColor = () => {
  const colors = [
    '#f472b6', // pink
    '#818cf8', // indigo
    '#34d399', // emerald
    '#fbbf24', // amber
    '#fb7185', // rose
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get currently connected users
export const getConnectedUsers = () => {
  const states = awareness.getStates();
  const users: any[] = [];
  states.forEach((state: any) => {
    if (state.user) {
      users.push(state.user);
    }
  });
  return users;
};

// Subscribe to user presence changes
export const onPresenceChange = (callback: () => void) => {
  awareness.on('change', callback);
  return () => awareness.off('change', callback);
};