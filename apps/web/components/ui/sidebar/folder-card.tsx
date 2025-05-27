import { FolderTagIcon, HamburgerIcon } from '@/components/icons/sidebar';
import { cn } from '@/utils/ui';
import React, { useState } from 'react';

interface FolderProps {
  folder: {
    id: number;
    display: string;
    children: FolderProps[];
  };
  isExpanded: boolean;
}

const FolderCard: React.FC<FolderProps> = ({ folder, isExpanded }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
    setActiveId(folder.id === activeId ? null : folder.id);
  };

  return (
    <li
      className={cn(
        'w-full flex flex-shrink-0 justify-center py-4 px-4 sm:px-2 sm:py-2 flex-col text-sm text-black capitalize dark:text-white',
        { 'py-4': isCollapsed },
        { 'text-black font-medium': folder.id === activeId },
        { 'text-[#000000A3]': folder.id !== activeId }
      )}
      key={folder.id}
    >
      <div
        className={cn(
          'flex items-center w-full gap-3 cursor-pointer',
          { 'justify-center': !isExpanded },
          { 'justify-between': isExpanded }
        )}
        onClick={handleToggleCollapse}
      >
        <div className="flex items-center gap-3">
          <FolderTagIcon className="text-[#adb6f9]" />
          {isExpanded && <span className="">{folder.display}</span>}
        </div>

        {isExpanded && <HamburgerIcon className="mr-2.5" />}
      </div>

      {!isCollapsed && folder?.children?.length > 0 && (
        <div className={cn('', { 'list-style': isExpanded })}>
          <ul>
            {folder.children.map((childFolder: any) => (
              <ChildFolderCard
                key={childFolder.id}
                folder={childFolder}
                isExpanded={isExpanded}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

const ChildFolderCard: React.FC<FolderProps> = ({ folder, isExpanded }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
    setActiveId(folder.id === activeId ? null : folder.id);
  };

  return (
    <li
      className={cn(
        'flex justify-center flex-col mt-4 text-xs text- capitalize',
        { 'pl-0': !isExpanded },
        { 'pl-3': isExpanded },
        { 'text-black font-medium': folder.id === activeId },
        { 'text-[#000000A3]': folder.id !== activeId }
      )}
      key={folder.id}
    >
      <div
        className={cn(
          'flex items-center w-full gap-3 cursor-pointer',
          { 'justify-center': !isExpanded },
          { 'justify-between': isExpanded }
        )}
        onClick={handleToggleCollapse}
      >
        <div className="flex items-center gap-3">
          <FolderTagIcon className="text-[#D7796A]" />
          {isExpanded && (
            <span className="overflow-hidden">{folder.display}</span>
          )}
        </div>
        {isExpanded && <HamburgerIcon className="mr-2.5" />}
      </div>

      {!isCollapsed && folder?.children?.length > 0 && (
        <div className={cn('', { 'list-style': isExpanded })}>
          <ul>
            {folder.children.map((child: any, index: number) => (
              <ChildFolderCard
                key={index}
                folder={child}
                isExpanded={isExpanded}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default FolderCard;
