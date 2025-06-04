import React, { useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useEditorStore } from '../../lib/store';
import { setupCollaboration } from '../../lib/collaboration';

const Editor: React.FC = () => {
  const { currentFile, files, updateFile } = useEditorStore();
  const editorRef = useRef<any>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (currentFile && value !== undefined) {
      updateFile(currentFile, value);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Handle collaboration setup with useEffect
  useEffect(() => {
    if (editorRef.current && currentFile) {
      // Clean up previous collaboration if it exists
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      // Setup new collaboration
      const { cleanup } = setupCollaboration(editorRef.current, currentFile);
      cleanupRef.current = cleanup;
    }

    // Cleanup function for useEffect
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [currentFile]); // Re-run when currentFile changes

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  const getLanguage = (filename: string) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'jsx':
        return 'javascript';
      case 'tsx':
        return 'typescript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="h-full w-full bg-white">
      <MonacoEditor
        height="100%"
        language={currentFile ? getLanguage(currentFile) : 'typescript'}
        theme="vs-light"
        value={currentFile ? files[currentFile] : '// Select a file to begin editing'}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          minimap: {
            enabled: true,
            scale: 2,
            showSlider: 'mouseover',
          },
          wordWrap: 'on',
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          folding: true,
          foldingStrategy: 'indentation',
          renderLineHighlight: 'all',
          parameterHints: {
            enabled: true,
          },
          suggest: {
            showMethods: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showStructs: true,
            showInterfaces: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showKeywords: true,
            showWords: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showSnippets: true,
          },
        }}
      />
    </div>
  );
};

export default Editor;