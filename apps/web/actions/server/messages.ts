'use server';

import { createClient } from '@/supabase/server';
import { BackendResponse, Message } from '@repo/types';
import { extractNecessaryInfo } from './message-helpers';
import { Converter } from 'showdown';

const converter = new Converter();

export const getMessageAttachments = async (
  messageId: string
): Promise<
  BackendResponse<{
    message_id: string;
    attachments: {
      id: string;
      name: string;
      type: string;
      file_path: string | null;
    }[];
  }>
> => {
  const supabase = createClient();
  const { data, error } = await (await supabase)
    .from('message_attachments')
    .select('*, resource:resource_id(*)')
    .eq('message_id', messageId)
    .eq('resource.type', 'document');

  if (error) return { success: false, message: error.message };

  const attachments = data.map(
    (attachment: {
      resource: { id: string; name: string; type: string; file_path: string | null };
    }) => {
      return attachment.resource;
    }
  );

  return {
    success: true,
    message: 'Message attachments fetched successfully',
    data: {
      message_id: data[0]?.message_id || messageId,
      attachments,
    },
  };
};

export const replyToMessage = async ({
  lastMessageHeaders,
  replyToEmailWithDomain,
  content,
  threadId,
  ownerId,
}: {
  lastMessageHeaders: any[];
  replyToEmailWithDomain: string;
  content: string;
  threadId: string;
  ownerId: string;
}): Promise<BackendResponse<Message>> => {
  const contentAsHtml = converter.makeHtml(content);

  const { headers, recipients } = extractNecessaryInfo(
    lastMessageHeaders,
    replyToEmailWithDomain
  );
  const stream = 'outbound';
  const supabase = await createClient();
  const { data, error } = await supabase.from('messages').insert([
    {
      thread_id: threadId,
      direction: 'outbound',
      content: content,
      html_content: contentAsHtml,
      postmark_data: JSON.parse(JSON.stringify({
        headers,
        recipients,
        stream,
      })),
    },
  ]);

  if (error) return { success: false, message: error.message };

  return {
    success: true,
    message: 'Reply sent',
    data,
  };
};

export const forwardMessage = async ({
  messageId,
  messageText,
}: {
  messageId: string;
  messageText: string;
}): Promise<BackendResponse<Message>> => {
  // TODO: Implement forwarded message functionality
  // The forwarded_messages table doesn't exist in the current schema
  return {
    success: false,
    message: 'Forward message functionality not yet implemented',
  };
};
