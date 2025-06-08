"use client";

import {
  deleteFileResource,
  uploadFileResource,
} from "@/actions/server/storage";
import { IResource } from "@repo/types";
import { triggerDownload } from "@/utils/helpers";
import { cn } from "@/utils/ui";
import { createClient } from "@/supabase/client";
import {
  DownloadCloud,
  File,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { ChangeEventHandler, useState } from "react";
import { toast } from "sonner";
import { FilePdfIcon, SettingsDocumentIcon } from "../icons/settings";
import { Button } from "./button";
import { fileDownloadHelper } from "./fileDownloadHelper";
import { Label } from "./label";

type FileUploadActions = "download" | "delete";
interface FileInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  onUpload: (file: IResource) => void;
}

interface FileUploadItemProps {
  resource: IResource;
  actions?: { label: FileUploadActions; onClick?: (name: IResource) => void }[];
  isUploading?: boolean;
}

interface FileUploadProps {
  documents: IResource[];
}

const targetSizeInMB = 2;
const MAX_FILE_SIZE = targetSizeInMB * 1024 * 1024;

export const FileInput = ({
  name,
  onUpload,
  disabled,
  ...props
}: FileInputProps) => {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setIsLoading(true);
    const file = e.target.files?.[0];
    try {
      if (!file) {
        throw new Error("Invalid File!");
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error("File too large!");
      }
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.id) {
        throw new Error("You must be authenticated to upload a resource");
      }

      const form = new FormData();

      form.append("fileUpload", file);

      const { success, message, data } = await uploadFileResource({
        form,
        bucket: "leadmark",
        userId: user.id,
      });

      if (!success) {
        toast.error(message);
      }
      if (success) {
        toast.success(message);
        e.target.value = "";

        onUpload(data!);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Label
      htmlFor={name}
      className={cn(
        "w-full bg-surface-surface-neutral rounded-lg p-6 flex flex-col items-center gap-3",
        {
          "opacity-50 cursor-not-allowed": disabled,
        }
      )}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <div className="flex items-center gap-2">
          <SettingsDocumentIcon />
          <UploadCloud size={16} />
          <File size={16} />
        </div>
      )}
      <div className="flex flex-col items-center gap-2">
        <p className="text-neutral-deep">Click to upload file</p>
        <p className="text-xs text-neutral-main">Maximum file size is 2 MB.</p>
      </div>
      <input
        name={name}
        disabled={disabled}
        type="file"
        {...props}
        className="hidden"
        onChange={handleChange}
      />
    </Label>
  );
};

export const FileUploadItem = ({
  resource,
  actions = [
    {
      label: "download",
    },
    {
      label: "delete",
    },
  ],
  isUploading,
}: FileUploadItemProps) => {
  const rawMetadata: any = resource?.raw_metadata;

  return (
    <div className="flex items-center gap-3 p-2 pr-4 border rounded-lg border-border-neutral-weaker bg-surface-surface-normal h-[62px]">
      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-surface-surface-normal">
        <FilePdfIcon className="" />
      </div>
      <div className="flex-1">
        <p className="w-40 text-base capitalize truncate text-neutral-deep sm:w-full">
          {resource.name?.split("_tulip_")[1]}
        </p>
        <p
          className={cn("text-xs text-black", {
            uppercase: !isUploading,
          })}
        >
          {isUploading
            ? "uploading..."
            : ((rawMetadata?.sizeInBytes ?? 0) / 1024).toFixed(2) + "KB"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isUploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={"ghost"}
                size={"icon"}
                onClick={() => action.onClick?.(resource)}
              >
                {action.label === "download" ? (
                  <DownloadCloud size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export const FileUpload = ({
  documents: resourceDocuments,
}: FileUploadProps) => {
  const supabase = createClient();
  const [documents, setDocuments] = useState(resourceDocuments);
  const handleFileUpload = (document: IResource) => {
    setDocuments([document, ...documents]);
  };

  const handleFileDelete = async (resource: IResource) => {
    // @Note: Mimic optimistic update
    const oldDocuments = documents;
    const updatedDocuments = documents.filter(
      (doc) => doc.name !== resource.name
    );
    setDocuments(updatedDocuments);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      toast.error("User not logged in.");
      return;
    }

    const { message, success } = await deleteFileResource({ resource });

    if (!success) {
      toast.error(message);
      setDocuments(oldDocuments);
      return;
    }

    toast.success(message);
  };

  const handleFileDownload = async (resource: IResource) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      toast.error("User not logged in.");
      return;
    }

    const { message, success, data } = await fileDownloadHelper(resource);

    if (!success || !data) {
      toast.error(message);
      return;
    }

    triggerDownload(data, resource.name!);
    toast.success(message);
  };

  return (
    <div className="flex flex-col gap-4">
      <FileInput disabled={documents.length >= 3} onUpload={handleFileUpload} />
      {documents.length ? (
        <div className="flex flex-col gap-3">
          {documents.map((document, index) => (
            <FileUploadItem
              key={index}
              resource={document}
              actions={[
                { label: "download", onClick: handleFileDownload },
                { label: "delete", onClick: handleFileDelete },
              ]}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
