'use client';

import {
  ArrowBendUpLeft,
  ArrowBendUpRight,
  InboxTagIcon,
} from '@/components/icons/InboxIcons';
import { FilePdfIcon } from '@/components/icons/settings';
// import { AttachmentsViewer } from '@/components/ui/attachments-viewer';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toggleAutoResponderByNamespace } from '@/actions/server/threads';
import { type Message, type TypeMessageAttachment, Thread } from '@repo/types';
import { triggerDownload } from '@/utils/helpers';
import { cn } from '@/utils/ui';
import { createClient } from '@/supabase/client';
import { ArrowLeft, ChevronRight, DownloadCloud, Trash2 } from 'lucide-react';
import { useRouter } from '@bprogress/next/app';
import { useState } from 'react';
import { toast } from 'sonner';

interface InboxMessageItemProps {
  message: Message;
  senderName: string;
  senderEmail: string;
  sendDate: string;
  receiverName: string;
  receiverEmail: string;
}

interface InboxViewerPageProps {
  namespace?: string;
  messages?: Message[];
  thread?: Thread & { contactName: string };
  email: string;
  fullname: string;
}

interface MessageAttachmentProps {
  attachment: TypeMessageAttachment;
  ownerId: string;
}

const MessageAttachment = ({ attachment, ownerId }: MessageAttachmentProps) => {
  const supabase = createClient();
  const resource = attachment?.resource;

  const handleFileDownload = async (name: string) => {
    const { data: sessionInfo } = await supabase.auth.getSession();

    if (!sessionInfo.session?.user.id) {
      toast.error('User not logged in.');
      return;
    }
    const { data, error } = await supabase.storage
      .from('leadmark/attachments')
      .download(`${ownerId}/${resource.source_url}`);

    if (error || !data) {
      toast.error('Error downloading file');
      return;
    }

    triggerDownload(data as Blob, name);
  };
  return (
    <div className="flex items-center w-full max-w-[412px] gap-3 p-2 pr-4 border rounded-md border-[#0000000A] h-[62px] flex-shrink-0 ">
      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-surface-surface-normal">
        <FilePdfIcon />
      </div>
      <div className="flex-1">
        <p className="w-40 text-base capitalize truncate text-neutral-deep sm:w-full">
          {resource.name}
        </p>
        <p className={cn('text-xs text-black')}>
          {/* {(size / 1024).toFixed(2) + 'KB'} */}
          {resource.source_type}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => handleFileDownload(resource.name)}
        >
          <DownloadCloud size={16} />
        </Button>
      </div>
    </div>
  );
};

const InboxActions = () => {
  const router = useRouter();
  return (
    <div className="flex justify-between py-4">
      <ArrowLeft
        size={20}
        onClick={() => router.back()}
        className="cursor-pointer"
      />

      <div className="flex gap-2">
        <Trash2 size={20} />
      </div>
    </div>
  );
};

const InboxMessageItem = ({
  message,
  senderName,
  senderEmail,
  sendDate,
  receiverEmail,
  receiverName,
}: InboxMessageItemProps) => {
  const displayName = message.role === 'recipient' ? senderName : receiverName;
  const date = new Date(sendDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const attachments = message.message_attachments;

  return (
    <article className={cn(' flex flex-col items-start py-4 gap-4')}>
      <div className="flex justify-between w-full ">
        <div className="flex items-center gap-4">
          <Avatar
            label={displayName.substring(0, 2)}
            className="w-12 h-12 font-bold bg-blue-300"
          />
          <div className="flex flex-col gap-0">
            <div className="flex items-center gap-2">
              <p className="text-base font-medium text-black">{displayName}</p>
              <p className="text-sm">{formattedDate}</p>
            </div>
            <p className="text-sm">
              {message.role === 'recipient' ? senderEmail : receiverEmail}
            </p>
          </div>
        </div>

        <div className="mt-2">
          <ArrowBendUpRight />
        </div>
      </div>
      <div className="grid w-full gap-4 overflow-hidden text-base">
        {message.message_html ? (
          <div
            className="overflow-hidden break-words"
            dangerouslySetInnerHTML={{
              __html: message.message_html ? message.message_html : '',
            }}
          />
        ) : (
          <div className="overflow-hidden break-words whitespace-pre-line">
            {message.message_text}
          </div>
        )}
        <div className="flex flex-wrap w-full gap-4">
          {attachments &&
            Array.isArray(attachments) &&
            attachments.map((item: TypeMessageAttachment, index: number) => (
              <MessageAttachment
                key={index}
                attachment={item}
                ownerId={String(message.owner_id)}
              />
            ))}
        </div>
      </div>
    </article>
  );
};

export const InboxViewerPage = ({
  messages,
  thread,
  namespace,
  email,
  fullname,
}: InboxViewerPageProps) => {
  const router = useRouter();

  const [isAutoResponderEnabled, setIsAutoResponderEnabled] = useState(
    thread?.status != 'closed'
  );

  const toggleAutoResponderStatus = async () => {
    if (thread) {
      setIsAutoResponderEnabled(!isAutoResponderEnabled);
      const { success } = await toggleAutoResponderByNamespace(
        thread.namespace,
        !isAutoResponderEnabled
      );

      if (!success) setIsAutoResponderEnabled(isAutoResponderEnabled);
    }
  };

  return (
    <div className="relative flex flex-col items-stretch w-full h-full gap-8 px-4 overflow-auto">
      <div className="flex flex-col gap-4">
        <InboxActions />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex flex-col gap-1 py-2">
            <h3 className="text-xl font-medium text-black sm:text-2xl">
              {thread?.subject}
            </h3>
            <div className="flex items-center gap-2">
              <InboxTagIcon />
              <div className="flex items-center gap-1">
                <div>Sales</div>
                <ChevronRight size={16} color={'#000000A3'} />
                <div className="text-black">Retail</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>Auto-responder</div>
            <Switch
              checked={isAutoResponderEnabled}
              onClick={toggleAutoResponderStatus}
              aria-label="Auto-responder"
            />
          </div>
        </div>
        <div className="flex flex-col pb-4 divide-y divide-neutral-200">
          {messages?.map((message, index) => (
            <InboxMessageItem
              senderName={thread?.contactName ?? ''}
              senderEmail={thread?.contactEmail ?? ''}
              sendDate={thread?.created_at ?? ''}
              message={message}
              key={index}
              receiverName={fullname}
              receiverEmail={email}
            />
          ))}
        </div>
      </div>

      <div className="self-end inline-block w-full mt-auto bg-white items">
        <Separator className="bg-[#0000000A] px-4" />
        <div className="flex items-center gap-4 py-4">
          <Button
            variant={'outline'}
            className="w-full px-8 rounded-full"
            onClick={() => router.push(`/inbox/u/${namespace}/forward`)}
          >
            Forward
            <ArrowBendUpRight />
          </Button>
          <Button
            variant={'outline'}
            className="w-full px-8 rounded-full"
            onClick={() => router.push(`/inbox/u/${namespace}/reply`)}
          >
            Reply
            <ArrowBendUpLeft />
          </Button>
        </div>
      </div>
    </div>
  );
};
