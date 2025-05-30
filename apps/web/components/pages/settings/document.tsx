'use client';

import { FileUpload } from '@/components/ui/file-upload';
import { Resource } from '@repo/types';

interface SettingsDocumentPageProps {
  documents: Resource[];
}

export const SettingsDocumentPage = ({
  documents: resourceDocuments
}: SettingsDocumentPageProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="px-6 py-4 text-xl text-black sm:text-2xl dark:text-neutral-strong">
          Documents
        </h3>
        <p className="p-6 border-y border-[#0000000A]">
          Upload documents or resources that will empower your AI inbox
        </p>
      </div>
      <div className="flex flex-col gap-6 px-6">
        <FileUpload documents={resourceDocuments} />
      </div>
    </div>
  );
};
