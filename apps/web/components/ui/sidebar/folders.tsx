import React, { useState } from 'react';
import FolderCard from './folder-card';

interface FolderData {
  id: number;
  display: string;
  children: ChildFolderData[];
}

interface ChildFolderData {
  id: number;
  display: string;
}

interface FolderProps {
  isExpanded: boolean;
}

const Folders: React.FC<FolderProps> = ({ isExpanded }: FolderProps) => {
  const [folders] = useState<FolderData[]>([
    {
      id: 1,
      display: 'Sales',
      children: [
        {
          id: 2,
          display: 'child folder two'
        }
      ]
    },
    {
      id: 8,
      display: 'Marketing',
      children: []
    }
  ]);

  return (
    <>
      <ul className="w-full">
        {folders.map((folder: any) => (
          <FolderCard key={folder.id} folder={folder} isExpanded={isExpanded} />
        ))}
      </ul>
    </>
  );
};

export default Folders;
