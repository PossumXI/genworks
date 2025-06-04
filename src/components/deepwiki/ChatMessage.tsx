import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    code?: string;
    status?: 'sending' | 'sent' | 'error';
  };
}

// Simple markdown parser for basic formatting
const parseMarkdown = (text: string) => {
  // Handle code blocks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const inlineCodeRegex = /`([^`]+)`/g;
  
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\n/g, '<br>');

  return html;
};

// Simple syntax highlighter
const highlightCode = (code: string, language: string) => {
  // Basic keyword highlighting for common languages
  const keywords = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export'],
    python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'return', 'try', 'except'],
    java: ['public', 'private', 'class', 'interface', 'extends', 'implements', 'if', 'else', 'for', 'while', 'return'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'interface', 'type']
  };

  let highlighted = code;
  const langKeywords = keywords[language as keyof typeof keywords] || [];
  
  langKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span style="color: #0ea5e9; font-weight: 600;">${keyword}</span>`);
  });

  // Highlight strings
  highlighted = highlighted.replace(/"([^"]*)"/g, '<span style="color: #10b981;">"$1"</span>');
  highlighted = highlighted.replace(/'([^']*)'/g, '<span style="color: #10b981;">\'$1\'</span>');
  
  // Highlight comments
  highlighted = highlighted.replace(/\/\/(.*)/g, '<span style="color: #6b7280; font-style: italic;">//$1</span>');
  highlighted = highlighted.replace(/\/\*([\s\S]*?)\*\//g, '<span style="color: #6b7280; font-style: italic;">/*$1*/</span>');

  return highlighted;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  
  // Provide default values if message is undefined
  if (!message) {
    return null;
  }
  
  const isUser = message.type === 'user';

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(message.content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = message.content.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          parts.push(
            <div 
              key={`text-${lastIndex}`}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(textBefore) }}
              className="mb-2"
            />
          );
        }
      }

      // Add code block
      const language = match[1] || 'plaintext';
      const code = match[2].trim();
      const highlighted = highlightCode(code, language);

      parts.push(
        <div key={`code-${match.index}`} className="relative mt-2 mb-2">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase">{language}</span>
              <button
                onClick={() => handleCopyCode(code)}
                className="p-1 rounded hover:bg-gray-700 transition-colors group"
                title="Copy code"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400 group-hover:text-white" />
                )}
              </button>
            </div>
            <pre className="text-sm overflow-x-auto text-gray-100">
              <code
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            </pre>
          </div>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last code block
    if (lastIndex < message.content.length) {
      const textAfter = message.content.slice(lastIndex);
      if (textAfter.trim()) {
        parts.push(
          <div 
            key={`text-${lastIndex}`}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(textAfter) }}
          />
        );
      }
    }

    // If no code blocks found, just render the markdown
    if (parts.length === 0) {
      return (
        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }} />
      );
    }

    return <div>{parts}</div>;
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      data-status={message.status}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser
            ? 'bg-purple-100 text-purple-900'
            : 'bg-white border border-gray-200 shadow-sm'
        }`}
      >
        <div className="prose prose-sm max-w-none">
          {renderContent()}
          {message.status === 'sending' && (
            <div className="mt-2 text-xs text-gray-500 italic">Sending...</div>
          )}
          {message.status === 'error' && (
            <div className="mt-2 text-xs text-red-500">
              Failed to send message. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

// Demo component with sample data
const ChatMessageDemo = () => {
  const sampleMessages = [
    {
      id: '1',
      type: 'user' as const,
      content: 'Can you show me a simple React component?',
      status: 'sent' as const
    },
    {
      id: '2',
      type: 'assistant' as const,
      content: `Here's a simple React component example:

\`\`\`javascript
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

export default Counter;
\`\`\`

This component demonstrates:
- **State management** with useState hook
- **Event handling** with onClick
- **JSX rendering** with dynamic content`,
      status: 'sent' as const
    },
    {
      id: '3',
      type: 'user' as const,
      content: 'Thanks! That\'s helpful.',
      status: 'sending' as const
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Chat Message Component Demo</h1>
      <div className="space-y-4">
        {sampleMessages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};