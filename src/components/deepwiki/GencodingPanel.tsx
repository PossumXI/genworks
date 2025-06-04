import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Sparkles, Code, FileCode, Brain, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { useGencodingStore, useEditorStore, useToastStore } from '../../lib/store';
import { connectSocket, disconnectSocket, onGencodingResponse, onGencodingError, sendGencodingPrompt } from '../../lib/socket';
import ChatMessage from './ChatMessage';

const GencodingPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'generate' | 'explain' | 'debug'>('generate');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, addMessage, setLoading } = useGencodingStore();
  const { currentFile, files, updateFile } = useEditorStore();
  const { addToast } = useToastStore();
  const socketListenersRef = useRef<{
    responseCleanup?: () => void;
    errorCleanup?: () => void;
  }>({});

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const handleGencodingResponse = useCallback((response: any) => {
    addMessage({
      id: generateMessageId(),
      type: 'assistant',
      content: response.message,
      code: response.code,
      timestamp: Date.now(),
      status: 'sent',
    });

    // If code was generated and we have a current file, offer to insert it
    if (response.code && currentFile) {
      addToast({
        title: 'Code Generated',
        description: 'Would you like to insert the generated code?',
        type: 'info',
        duration: 10000,
        action: {
          label: 'Insert Code',
          onClick: () => {
            updateFile(currentFile, response.code);
            addToast({
              title: 'Code Inserted',
              description: 'Generated code has been inserted into the current file',
              type: 'success'
            });
          }
        }
      });
    }

    setLoading(false);
  }, [addMessage, generateMessageId, currentFile, updateFile, addToast, setLoading]);

  const handleGencodingError = useCallback((error: string) => {
    addMessage({
      id: generateMessageId(),
      type: 'assistant',
      content: `Error: ${error}`,
      timestamp: Date.now(),
      status: 'error',
    });
    setLoading(false);
  }, [addMessage, setLoading, generateMessageId]);

  useEffect(() => {
    let isComponentMounted = true;

    const initializeSocket = async () => {
      try {
        await connectSocket();
        
        if (isComponentMounted) {
          socketListenersRef.current.responseCleanup = onGencodingResponse(handleGencodingResponse);
          socketListenersRef.current.errorCleanup = onGencodingError(handleGencodingError);
        }
      } catch (error) {
        console.error('Failed to connect socket:', error);
        if (isComponentMounted) {
          handleGencodingError('Failed to connect to the server');
        }
      }
    };

    initializeSocket();

    return () => {
      isComponentMounted = false;
      
      if (socketListenersRef.current.responseCleanup) {
        socketListenersRef.current.responseCleanup();
      }
      if (socketListenersRef.current.errorCleanup) {
        socketListenersRef.current.errorCleanup();
      }
      
      disconnectSocket();
    };
  }, [handleGencodingResponse, handleGencodingError]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const context = currentFile ? {
      fileName: currentFile,
      fileContent: files[currentFile],
      mode
    } : undefined;

    const userMessage = {
      id: generateMessageId(),
      type: 'user' as const,
      content: prompt,
      timestamp: Date.now(),
      status: 'sending' as const,
    };

    addMessage(userMessage);
    setLoading(true);

    try {
      sendGencodingPrompt(prompt, JSON.stringify(context));
      setPrompt('');
    } catch (error) {
      console.error('Failed to send prompt:', error);
      handleGencodingError('Failed to send message');
    }
  }, [prompt, isLoading, currentFile, files, mode, addMessage, setLoading, generateMessageId, handleGencodingError]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  }, [handleSubmit]);

  const getPromptPlaceholder = () => {
    switch (mode) {
      case 'generate':
        return 'Describe what code you want to generate...';
      case 'explain':
        return 'Ask about code you want to understand...';
      case 'debug':
        return 'Describe the issue you want to debug...';
      default:
        return 'What would you like help with?';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-purple-500" />
          AI Assistant
        </h3>
        
        <div className="flex gap-2 mb-3">
          <Button
            variant={mode === 'generate' ? 'primary' : 'outline'}
            size="sm"
            icon={<Code className="h-4 w-4" />}
            onClick={() => setMode('generate')}
          >
            Generate
          </Button>
          <Button
            variant={mode === 'explain' ? 'primary' : 'outline'}
            size="sm"
            icon={<FileCode className="h-4 w-4" />}
            onClick={() => setMode('explain')}
          >
            Explain
          </Button>
          <Button
            variant={mode === 'debug' ? 'primary' : 'outline'}
            size="sm"
            icon={<Brain className="h-4 w-4" />}
            onClick={() => setMode('debug')}
          >
            Debug
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPromptPlaceholder()}
              className="w-full h-20 p-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="absolute bottom-2 right-2"
              icon={<Zap className="h-4 w-4" />}
              loading={isLoading}
              disabled={!prompt.trim() || isLoading}
            >
              Generate
            </Button>
          </div>

          {currentFile && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FileCode className="h-3 w-3" />
              <span>Using context from: {currentFile}</span>
            </div>
          )}
        </form>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                👋 Hi! I'm your AI coding assistant. I can help you:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-purple-700">
                <li>• Generate code from descriptions</li>
                <li>• Explain existing code</li>
                <li>• Debug issues and suggest fixes</li>
                <li>• Optimize and improve code</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium">Try asking me to:</p>
              {[
                'Create a React component for a user profile card',
                'Explain how this useEffect hook works',
                'Debug why my state updates are not rendering',
                'Optimize this database query function'
              ].map((suggestion, i) => (
                <button
                  key={i}
                  className="block w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setPrompt(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default GencodingPanel;