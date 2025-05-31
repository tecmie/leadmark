'use client';

import { ArrowBendUpRight } from '@/components/icons/InboxIcons';
// import { AttachmentsViewer } from '@/components/ui/attachments-viewer';
import { Avatar } from '@/components/ui/avatar';
import { Button, ButtonProps } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IMessage, IThread } from '@repo/types';

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
import { cn } from '@/utils/ui';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from '@bprogress/next/app';

interface InboxMessageItemProps {
  message: EnhancedMessage;
  senderName: string;
  senderEmail: string;
  sendDate: string;
  receiverName: string;
  receiverEmail: string;
}

interface InboxViewerPageProps {
  id?: string;
  messages?: EnhancedMessage[];
  thread?: IThread & { contactName: string; contactEmail: string };
  email: string;
  fullname: string;
}

interface InboxActionsProps extends ButtonProps {
  mobileOnly?: boolean;
}

const InboxActions = ({}: InboxActionsProps) => {
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
  const displayName = message.direction === 'inbound' ? senderName : receiverName;
  const date = new Date(sendDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return (
    <article className={cn('py-4  flex flex-col items-start gap-4 !border-0')}>
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
              {message.direction === 'inbound' ? senderEmail : receiverEmail}
            </p>
          </div>
        </div>

        {/* <div className='mt-2'>
          <ArrowBendUpRight />
        </div> */}
      </div>
      <div className="grid overflow-hidden text-base">
        {message.html_content ? (
          <div
            className="overflow-hidden break-words"
            dangerouslySetInnerHTML={{
              __html: message.html_content ? message.html_content : '',
            }}
          />
        ) : (
          <div className="overflow-hidden break-words whitespace-pre-line">
            {message.content}
          </div>
        )}
      </div>
    </article>
  );
};

export const InboxViewerPage = ({
  messages,
  thread,
  email,
  fullname,
}: InboxViewerPageProps) => {
  const formatDateToCustomString = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(date));
  };

  const formattedDate = formatDateToCustomString(
    new Date(thread?.created_at ?? '')
  );

  return (
    <ScrollArea className="relative flex flex-col w-full h-full gap-8 px-4 overflow-auto">
      {/* <div className="sticky top-0 z-10 flex items-center gap-3 p-3 sm:gap-4 bg-background">
        
        <Separator orientation="vertical" className="flex h-3 sm:hidden" />
        <Button className="text-link" variant={'link'} size={'sm'}>
          Forward <CornerUpRight size={16} />
        </Button>
      </div> */}
      <InboxActions mobileOnly />

      <div className="py-2">
        <div className="flex gap-1 border-[#00000012] border-b border-t  py-2 items-center text-base">
          <div>From</div>
          <Input className="h-6 px-2 text-base border-0 focus-visible:ring-0" />
        </div>
        <div className="flex gap-1 border-[#00000012] border-b  py-2 items-center text-base">
          <div>To</div>
          <Input className="h-6 px-2 text-base border-0 focus-visible:ring-0" />
        </div>
        {/* <div className="flex gap-1 border-[#00000012] border-b  py-2 items-center text-base">
          <div>Cc</div>
          <Input className="h-6 px-2 text-base border-0 focus-visible:ring-0" />
        </div> */}
      </div>

      <div className="flex flex-col gap-1 py-6 mb-2">
        <h3 className="text-xl text-black sm:text-2xl">
          Fwd: {thread?.subject}
        </h3>
      </div>

      {/* rich text editor to replace textarea */}
      <div className=" py-4 mb-2 border-b border-[#00000012]">
        <textarea
          placeholder="Compose email"
          className="p-0 w-full focus-within:outline-0 text-base min-h-[120px]"
        />
      </div>

      <div className="flex flex-col pb-4 divide-y divide-neutral-200">
        {messages?.map((message, index) =>
          messages?.length - 1 === index ? (
            <>
              <div className="py-4 ">
                <div className="mb-2 font-medium text-black">
                  Forwarded message
                </div>
                {message.direction === 'inbound' ? (
                  <div>
                    From{' '}
                    <span className="font-medium text-black">
                      {thread?.contactName ?? ''} {`<`}
                      {thread?.contactEmail ?? ''}
                      {`>`}{' '}
                    </span>
                  </div>
                ) : (
                  <div>
                    From{' '}
                    <span className="font-medium text-black">
                      {fullname ?? ''} {`<`}
                      {email ?? ''}
                      {`>`}{' '}
                    </span>
                  </div>
                )}
                <div>
                  Date{' '}
                  <span className="font-medium text-black">
                    {' '}
                    {formattedDate}{' '}
                  </span>{' '}
                </div>
                <div>
                  Subject{' '}
                  <span className="font-medium text-black">
                    {thread?.subject}
                  </span>{' '}
                </div>
                {message.direction === 'inbound' ? (
                  <div>
                    To{' '}
                    <span className="font-medium text-black">
                      {fullname ?? ''} {`<`}
                      {email ?? ''}
                      {`>`}{' '}
                    </span>
                  </div>
                ) : (
                  <div>
                    To{' '}
                    <span className="font-medium text-black">
                      {thread?.contactName ?? ''} {`<`}
                      {thread?.contactEmail ?? ''}
                      {`>`}{' '}
                    </span>
                  </div>
                )}
              </div>
              <InboxMessageItem
                senderName={thread?.contactName ?? ''}
                senderEmail={thread?.contactEmail ?? ''}
                sendDate={thread?.created_at ?? ''}
                message={message}
                key={index}
                receiverName={fullname}
                receiverEmail={email}
              />
            </>
          ) : (
            ''
          )
        )}
      </div>

      <div className="flex justify-center w-full gap-4 py-4">
        <Button variant={'outline'} className="w-full rounded-full">
          Forward
          <ArrowBendUpRight />
        </Button>
        {/* <Button variant={"outline"} className='w-full px-8 rounded-full'>
          Reply
          <ArrowBendUpLeft/>
        </Button> */}
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
