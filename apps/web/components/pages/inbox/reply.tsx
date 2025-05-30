'use client';

import { ArrowBendUpLeft } from '@/components/icons/InboxIcons';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { replyToMessage } from '@/actions/server/messages';
import { Message, Thread } from '@repo/types';
import { cn } from '@/utils/ui';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
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

const InboxActions = () => {
  const router = useRouter();
  return (
    <div className="flex justify-between py-4">
      {/* <Tooltip
        content={"Back to Threads"}
        side="bottom"
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), {
          'flex sm:hidden': mobileOnly
        })}
      >
        <ArrowLeft size={20} onClick={()=>router.back()} />
      </Tooltip> */}
      <ArrowLeft
        size={20}
        onClick={() => router.back()}
        className="cursor-pointer"
      />

      <div className="flex gap-2">
        {/* <Tooltip
          content={"Add attachments"}
          side="bottom"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), {
            'flex sm:hidden': mobileOnly
          })}
        >
          <Paperclip size={20} />
        </Tooltip> */}
        {/* <Tooltip
          content={"Delete"}
          side="bottom"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), {
            'flex sm:hidden': mobileOnly
          })}
        >
          <Trash2 size={20} />
        </Tooltip> */}
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
  return (
    <article className={cn('py-4 flex flex-col items-start gap-4')}>
      <div className="flex justify-between w-full">
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

        {/* <div className='mt-2'>
          <ArrowBendUpRight />
        </div> */}
      </div>
      <div className="grid overflow-hidden text-base">
        {message.message_html ? (
          <div
            className="overflow-hidden break-words whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: message.message_html ? message.message_html : '',
            }}
          />
        ) : (
          <div className="overflow-hidden break-words whitespace-pre-line">
            {message.message_text}
          </div>
        )}
      </div>
    </article>
  );
};

export const InboxViewerPage = ({
  messages,
  thread,
  fullname,
  email,
}: InboxViewerPageProps) => {
  const router = useRouter();

  const [composedReply, setComposedReply] = useState('');

  const submitReply = async () => {
    if (composedReply) {
      const processedReply = composedReply.trim();
      if (processedReply && processedReply !== '') {
        const { success, message } = await replyToMessage({
          threadId: thread!.id,
          lastMessageHeaders: JSON.parse(
            messages?.[messages.length - 1].raw_metadata as string
          ).headers,
          ownerId: thread!.owner_id,
          replyToEmailWithDomain: thread!.contactEmail ?? '',
          content: composedReply,
        });

        if (success) {
          toast.success(message);
          setComposedReply('');
          router.refresh();
        }

        if (!success) {
          toast.error(message);
        }
      } else {
        toast.warning('Type in a valid reply');
      }
    } else {
      toast.warning('Type in your reply');
    }
  };

  return (
    <ScrollArea className="relative flex flex-col w-full h-full gap-8 px-4 pb-40 overflow-auto ">
      {/* <div className="sticky top-0 z-10 flex items-center gap-3 p-3 sm:gap-4 bg-background">
        
        <Separator orientation="vertical" className="flex h-3 sm:hidden" />
        <Button className="text-link" variant={'link'} size={'sm'}>
          Forward <CornerUpRight size={16} />
        </Button>
      </div> */}
      <InboxActions />
      <div className="flex flex-col gap-1 py-2 mb-4">
        <h3 className="text-xl font-medium text-black sm:text-2xl">
          Re: {thread?.subject}
        </h3>
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
      {/* //TODO rich text editor to replace textarea */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-4 px-4 mb-5 sm:mb-2 bg-whit">
        <textarea
          placeholder="Compose email"
          className="w-full focus-within:outline-0 text-base min-h-[100px] rounded-lg bg-white p-4 border border-[#00000012]"
          onChange={(e) => setComposedReply(e.target?.value)}
          value={composedReply}
        />{' '}
        <Button
          variant={'outline'}
          className="w-full px-8 bg-white rounded-full"
          disabled={!composedReply}
          onClick={() => submitReply()}
        >
          Reply
          <ArrowBendUpLeft />
        </Button>
      </div>
      {/* Assuming the AttachmentsViewer is related to the last message */}
      {/* {messages && messages[messages.length - 1]?.attachments && (
        <AttachmentsViewer
          attachments={
            (messages[messages.length - 1]?.attachments as []) || ['a', 'b']
          }
        />
      )} */}
    </ScrollArea>
  );
};
