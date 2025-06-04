import { io } from 'socket.io-client';
import { useToastStore } from './store';
import api from './api';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = () => {
  socket.connect();

  socket.on('connect', () => {
    useToastStore.getState().addToast({
      title: 'Connected',
      description: 'Real-time connection established',
      type: 'success'
    });
  });

  socket.on('connect_error', (error) => {
    useToastStore.getState().addToast({
      title: 'Connection Error',
      description: error.message,
      type: 'error'
    });
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const onGencodingResponse = (callback: (response: any) => void) => {
  socket.on('gencoding:response', callback);
  return () => socket.off('gencoding:response', callback);
};

export const onGencodingError = (callback: (error: string) => void) => {
  socket.on('gencoding:error', callback);
  return () => socket.off('gencoding:error', callback);
};

export const sendGencodingPrompt = async (prompt: string, context?: string) => {
  try {
    const response = await api.post('/gencoding/generate', {
      prompt,
      context: context ? JSON.parse(context) : undefined
    });

    socket.emit('gencoding:response', {
      message: response.data.message,
      code: response.data.code,
    });

    // Store the interaction
    await api.post('/hub/interactions', {
      prompt,
      result: response.data.message,
      code: response.data.code,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Gencoding error:', error);
    const { addToast } = useToastStore.getState();
    addToast({
      title: 'Generation Failed',
      description: error instanceof Error ? error.message : 'Failed to generate code',
      type: 'error'
    });
    socket.emit('gencoding:error', 'Failed to generate code');
  }
};

// Collaboration events
socket.on('user:joined', (user) => {
  useToastStore.getState().addToast({
    title: 'User Joined',
    description: `${user.name} joined the session`,
    type: 'info'
  });
});

socket.on('user:left', (user) => {
  useToastStore.getState().addToast({
    title: 'User Left',
    description: `${user.name} left the session`,
    type: 'info'
  });
});

socket.on('file:changed', (data) => {
  useToastStore.getState().addToast({
    title: 'File Updated',
    description: `${data.user.name} updated ${data.file}`,
    type: 'info'
  });
});

export default socket;