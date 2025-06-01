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
import { type IMessage, type TypeMessageAttachment, IThread } from '@repo/types';

// Extended message type that includes the additional properties returned by server actions
type EnhancedMessage = IMessage & {
  message_attachments?: {
    id: number;
    resource: {
      id: string;
      name: string;
      file_path: string | null;
      type: string;
    };
  }[];
};
import { triggerDownload } from '@/utils/helpers';
import { cn } from '@/utils/ui';
import { createClient } from '@/supabase/client';
import { ArrowLeft, ChevronRight, DownloadCloud, Trash2 } from 'lucide-react';
import { useRouter } from '@bprogress/next/app';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchMessagesByThreadNamespace } from '@/actions/server/threads';

interface InboxMessageItemProps {
  message: EnhancedMessage;
  senderName: string;
  senderEmail: string;
  sendDate: string;
  receiverName: string;
  receiverEmail: string;
  ownerId?: string;
}

interface InboxViewerPageProps {
  namespace?: string;
  messages?: EnhancedMessage[];
  thread?: IThread & { contactName: string; contactEmail: string };
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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
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
    <div className="flex items-center w-full max-w-[412px] gap-3 p-2 pr-4 border rounded-md border-border bg-card h-[62px] flex-shrink-0 ">
      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-secondary">
        <FilePdfIcon />
      </div>
      <div className="flex-1">
        <p className="w-40 text-base capitalize truncate text-foreground sm:w-full">
          {resource.name}
        </p>
        <p className={cn('text-xs text-muted-foreground')}>
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
  ownerId,
}: InboxMessageItemProps) => {
  const displayName = message.direction === 'inbound' ? senderName : receiverName;
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
              <p className="text-base font-medium text-foreground">{displayName}</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {message.direction === 'inbound' ? senderEmail : receiverEmail}
            </p>
          </div>
        </div>

        <div className="mt-2">
          <ArrowBendUpRight />
        </div>
      </div>
      <div className="grid w-full gap-4 overflow-hidden text-base">
        {message.html_content ? (
          <div
            className="overflow-hidden break-words text-foreground"
            dangerouslySetInnerHTML={{
              __html: message.html_content ? message.html_content : '',
            }}
          />
        ) : (
          <div className="overflow-hidden break-words whitespace-pre-line text-foreground">
            {message.content}
          </div>
        )}
        <div className="flex flex-wrap w-full gap-4">
          {attachments &&
            Array.isArray(attachments) &&
            attachments.map((item: TypeMessageAttachment, index: number) => (
              <MessageAttachment
                key={index}
                attachment={item}
                ownerId={String(ownerId || '')}
              />
            ))}
        </div>
      </div>
    </article>
  );
};

export const InboxViewerPage = ({
  messages: initialMessages,
  thread,
  namespace,
  email,
  fullname,
}: InboxViewerPageProps) => {
  const router = useRouter();
  const supabase = createClient();

  const [messages, setMessages] = useState<EnhancedMessage[]>(initialMessages || []);
  const [isAutoResponderEnabled, setIsAutoResponderEnabled] = useState(
    thread?.status != 'closed'
  );

  // Real-time message updates
  useEffect(() => {
    if (!thread?.id || !namespace) return;

    const messagesChannel = supabase
      .channel(`thread-${thread.id}-messages`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `thread_id=eq.${thread.id}`
        },
        async (payload) => {
          console.log('New message received in thread:', payload);
          
          // Get the current user to filter
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          // Check if this thread belongs to the current user
          if (thread.owner_id !== user.id) return;

          try {
            // Fetch the complete message with attachments
            const { data: newMessage, error } = await supabase
              .from('messages')
              .select(`
                *,
                message_attachments (
                  id,
                  resource:resource_id (
                    id,
                    name,
                    file_path,
                    type
                  )
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (!error && newMessage) {
              // Add the new message to the messages list
              setMessages(prev => [...prev, newMessage as EnhancedMessage]);
              
              // Show notification for inbound messages
              if (payload.new.direction === 'inbound') {
                toast.success('New message received!', {
                  description: 'You have a new incoming message',
                });
              }
            } else {
              // Fallback: refresh all messages for this thread
              const result = await fetchMessagesByThreadNamespace(namespace);
              if (result.data) {
                setMessages(result.data);
              }
            }
          } catch (error) {
            console.error('Error fetching new message:', error);
            // Fallback: refresh all messages for this thread
            const result = await fetchMessagesByThreadNamespace(namespace);
            if (result.data) {
              setMessages(result.data);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'messages',
          filter: `thread_id=eq.${thread.id}`
        },
        async (payload) => {
          console.log('Message updated in thread:', payload);
          
          // Update the specific message in the list
          setMessages(prev => 
            prev.map(message => 
              message.id === payload.new.id 
                ? { ...message, ...payload.new } as EnhancedMessage
                : message
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [thread?.id, namespace, supabase]);

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
    <div className="w-full h-full gap-8 px-4">
      <div className="flex flex-col gap-4">
        <InboxActions />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex flex-col gap-1 py-2">
            <h3 className="text-xl font-medium text-foreground sm:text-2xl">
              {thread?.subject}
            </h3>
            {/* <div className="flex items-center gap-2">
              <InboxTagIcon />
              <div className="flex items-center gap-1">
                <div>Sales</div>
                <ChevronRight size={16} color={'#000000A3'} />
                <div className="text-foreground">Retail</div>
              </div>
            </div> */}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="text-foreground">Auto-responder</div>
            <Switch
              checked={isAutoResponderEnabled}
              onClick={toggleAutoResponderStatus}
              aria-label="Auto-responder"
            />
          </div>
        </div>
        <div className="pb-4 divide-y divide-border relative flex flex-col items-stretch w-full flex-1 gap-8 overflow-y-auto max-h-[60vh] min-h-[200px]">
          {messages?.map((message, index) => (
            <InboxMessageItem
              senderName={thread?.contactName ?? ''}
              senderEmail={thread?.contactEmail ?? ''}
              sendDate={thread?.created_at ?? ''}
              message={message}
              key={index}
              receiverName={fullname}
              receiverEmail={email}
              ownerId={thread?.owner_id}
            />
          ))}
        </div>
      </div>

      <div className="self-end inline-block w-full mt-auto bg-background items">
        <Separator className="bg-border px-4" />
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
