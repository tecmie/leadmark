'use server';

import { createClient } from '@/supabase/server';
import { BackendResponse, IMessage } from '@repo/types';
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
}): Promise<BackendResponse<IMessage>> => {
  const contentAsHtml = converter.makeHtml(content);

  const { headers, recipients } = extractNecessaryInfo(
    lastMessageHeaders,
    replyToEmailWithDomain
  );
  const stream = 'outbound';
  const supabase = await createClient();
  
  // Mock implementation - simulates sending the reply
  const mockMessage: IMessage = {
    id: `mock_reply_${Date.now()}`,
    thread_id: threadId,
    direction: 'outbound',
    content: content,
    html_content: contentAsHtml,
    created_at: new Date().toISOString(),
    in_reply_to: null,
    is_ai_generated: null,
    message_id: null,
    subject: null,
    postmark_data: {
      headers,
      recipients,
      stream,
    } as any,
  };

  // In a real implementation, this would call the backend API
  // For now, we'll just save to the database without actually sending
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
        mock: true, // Flag to indicate this is a mock
      })),
    },
  ]).select().single();

  if (error || !data) return { success: false, message: error?.message || 'Failed to send reply' };

  return {
    success: true,
    message: 'Reply sent (mock implementation - will be handled by custom backend)',
    data: data as IMessage,
  };
};

export const forwardMessage = async ({
  messageId,
  messageText,
  threadId,
  toEmail,
  fromEmail,
  subject,
  content,
}: {
  messageId: string;
  messageText: string;
  threadId: string;
  toEmail: string;
  fromEmail: string;
  subject: string;
  content: string;
}): Promise<BackendResponse<IMessage>> => {
  const supabase = await createClient();
  const contentAsHtml = converter.makeHtml(content);

  // Mock implementation - simulates forwarding the message
  const mockForwardData = {
    originalMessageId: messageId,
    originalText: messageText,
    forwardedTo: toEmail,
    forwardedFrom: fromEmail,
    forwardedAt: new Date().toISOString(),
  };

  // Create a new message with forward data
  const { data, error } = await supabase.from('messages').insert([
    {
      thread_id: threadId,
      direction: 'outbound',
      content: content,
      html_content: contentAsHtml,
      postmark_data: JSON.parse(JSON.stringify({
        type: 'forward',
        mock: true, // Flag to indicate this is a mock
        forward_data: mockForwardData,
        headers: [
          { name: 'X-Forwarded-Message-ID', value: messageId },
          { name: 'X-Original-Subject', value: subject },
        ],
        recipients: [{ email: toEmail, type: 'to' }],
        stream: 'outbound',
      })),
    },
  ]).select().single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message || 'Failed to forward message',
    };
  }

  return {
    success: true,
    message: 'Message forwarded (mock implementation - will be handled by custom backend)',
    data: data as IMessage,
  };
};
