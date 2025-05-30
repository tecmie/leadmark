'use server';

import { createClient } from '@/supabase/server';
import { BackendResponse, Message } from '@repo/types';
import { extractNecessaryInfo } from './message-helpers';
import { Converter } from 'showdown';

const converter = new Converter();

export const getMessageAttachments = async (
  messageId: number
): Promise<
  BackendResponse<{
    message_id: number;
    attachments: {
      id: number;
      name: string;
      source_type: string;
      url: string;
    }[];
  }>
> => {
  const supabase = createClient();
  const { data, error } = await (await supabase)
    .from('message_attachments')
    .select('*, resource:resource_id(*)')
    .eq('message_id', messageId)
    .eq('resource.source_type', 'document');

  if (error) return { success: false, message: error.message };

  const attachments = data.map(
    (attachment: {
      resource: { id: number; name: string; source_type: string; url: string };
    }) => {
      return attachment.resource;
    }
  );

  return {
    success: true,
    message: 'Message attachments fetched successfully',
    data: {
      message_id: data[0].message_id,
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
  threadId: number;
  ownerId: string;
}): Promise<BackendResponse<Message>> => {
  const contentAsHtml = converter.makeHtml(content);

  const { headers, recipients } = extractNecessaryInfo(
    lastMessageHeaders,
    replyToEmailWithDomain
  );
  const stream = 'outbound';
  const supabase = createClient();
  const { data, error } = await (await supabase).from('messages').insert([
    {
      thread_id: threadId,
      role: 'user',
      status: 'enqueue',
      message_html: contentAsHtml,
      message_text: content,
      origin: 'email',
      owner_id: ownerId,
      raw_metadata: JSON.stringify({
        headers,
        recipients,
        stream,
      }),
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
  messageId: number;
  messageText: string;
}): Promise<BackendResponse<Message>> => {
  const supabase = createClient();
  const { data, error } = await (await supabase)
    .from('forwarded_messages')
    .insert([
      {
        message_source: messageId,
        message_text: messageText,
      },
    ]);

  if (error) return { success: false, message: error.message };

  return {
    success: true,
    message: 'Message forwarded',
    data,
  };
};
