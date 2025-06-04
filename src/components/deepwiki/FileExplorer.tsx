import React, { useState, useCallback } from 'react';
import { File, Folder, Search, Plus, MoreVertical, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { useEditorStore, useToastStore } from '../../lib/store';
import { Tooltip } from '../ui/Tooltip';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

const FileExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { files, expandedFolders, toggleFolder, setCurrentFile, createFile, deleteFile, renameFile } = useEditorStore();
  const { addToast } = useToastStore();
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');

  const handleCreateFile = (folderPath: string) => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      const filePath = `${folderPath}/${fileName}`;
      createFile(filePath, '');
      addToast({
        title: 'File Created',
        description: `Created ${fileName}`,
        type: 'success'
      });
    }
  };

  const handleDeleteFile = (path: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      deleteFile(path);
      addToast({
        title: 'File Deleted',
        description: `Deleted ${path}`,
        type: 'success'
      });
    }
  };

  const handleRenameFile = (path: string) => {
    setIsRenaming(path);
    setNewFileName(path.split('/').pop() || '');
  };

  const confirmRename = (oldPath: string) => {
    if (newFileName && newFileName !== oldPath.split('/').pop()) {
      const newPath = `${oldPath.substring(0, oldPath.lastIndexOf('/'))}/${newFileName}`;
      renameFile(oldPath, newPath);
      addToast({
        title: 'File Renamed',
        description: `Renamed to ${newFileName}`,
        type: 'success'
      });
    }
    setIsRenaming(null);
    setNewFileName('');
  };

  const fileTree = Object.keys(files).reduce<FileNode[]>((tree, path) => {
    const parts = path.split('/');
    let current = tree;
    
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        current.push({
          name: part,
          type: 'file',
          path
        });
      } else {
        let folder = current.find(node => node.name === part && node.type === 'folder');
        if (!folder) {
          folder = {
            name: part,
            type: 'folder',
            path: parts.slice(0, i + 1).join('/'),
            children: []
          };
          current.push(folder);
        }
        current = folder.children!;
      }
    });
    
    return tree;
  }, []);

  const renderItem = (item: FileNode, depth = 0) => {
    const isExpanded = expandedFolders.has(item.path);
    const paddingLeft = depth * 1.25;

    return (
      <div key={item.path}>
        <div
          className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-100 cursor-pointer group"
          style={{ paddingLeft: `${paddingLeft}rem` }}
          onClick={() => item.type === 'folder' ? toggleFolder(item.path) : setCurrentFile(item.path)}
        >
          {item.type === 'folder' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
              <Folder className="h-4 w-4 text-gray-500" />
            </>
          ) : (
            <File className="h-4 w-4 text-gray-500" />
          )}

          {isRenaming === item.path ? (
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={() => confirmRename(item.path)}
              onKeyDown={(e) => e.key === 'Enter' && confirmRename(item.path)}
              className="flex-1 bg-white border rounded px-2 py-0.5"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm text-gray-700">{item.name}</span>
          )}

          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            {item.type === 'folder' && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateFile(item.path);
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                if (item.type === 'file') {
                  handleRenameFile(item.path);
                }
              }}
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
            {item.type === 'file' && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(item.path);
                }}
              >
                <File className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {item.type === 'folder' && isExpanded && item.children && (
          <div>
            {item.children.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {fileTree.map((item) => renderItem(item))}
      </div>
    </div>
  );
};

export default FileExplorer;