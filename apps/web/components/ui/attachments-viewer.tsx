'use client';

import { ChevronDown, ChevronUp, DownloadCloud } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from './collapsible';
import { FileUploadItem } from './file-upload';
import { Resource } from '@repo/types';

interface AttachmentsViewerProps {
  attachments: Resource[];
}

export const AttachmentsViewer = ({ attachments }: AttachmentsViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="p-4 bg-background text-neutral"
    >
      <CollapsibleTrigger className="flex items-center gap-2">
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Attachments
        <span className="py-1 px-2 bg-surface-strong text-link text-[10px] rounded-md">
          {attachments.length}
        </span>
        {attachments.length > 0 && (
          <Button variant={'link'} size={'sm'} className="text-link" asChild>
            <p>
              Download all <DownloadCloud size={16} />
            </p>
          </Button>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-2">
        {attachments.map((attachment, index) => (
          <FileUploadItem
            key={index}
           resource={attachment}
            actions={[{ label: 'download' }]}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
