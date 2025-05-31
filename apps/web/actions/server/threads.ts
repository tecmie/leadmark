'use server';

import { Database } from '@repo/types/database';
import { createClient } from '@/supabase/server';
import { BackendResponse, Thread } from '@repo/types';

export const fetchInboxThreads = async (): Promise<
  BackendResponse<Thread[]>
> => {
  const supabase = createClient();
  const {data: user} = await (await supabase).auth.getUser();
  const { data, error } = await (await supabase)
    .from('threads')
    .select(
      '*, contacts(email, first_name, last_name), message:last_message_id(*), owner:owner_id(*)'
    )
    .eq("owner_id", user!.user!.id)
    ;

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Threads fetched successfully',
    data: data.map(
      (thread: {
        owner: any;
        contacts: { email: string | null; first_name: string | null; last_name: string | null };
      }) => ({
        ...thread,
        contactEmail: thread.contacts?.email ?? '',
        contactName: `${thread.contacts?.first_name ?? ''} ${thread.contacts?.last_name ?? ''}`.trim(),
        fullName: thread.owner?.full_name ?? '',
        // lastMessageText: `${thread.message?.message_text}`
      })
    ),
  };
};

export const getThreadByNamespace = async (
  namespace: string
): Promise<BackendResponse<Thread & { contactName: string }>> => {
  const supabase = createClient();
  const {data: user} = await (await supabase).auth.getUser();

  const { data, error } = await (await supabase)
    .from('threads')
    .select('*, contacts(email, first_name, last_name)')
    .eq('namespace', namespace)
    .eq("owner_id", user!.user!.id)

    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Thread fetched succesfully',
    data: {
      ...data,
      contactEmail: data.contacts?.email ?? '',
      contactName: `${data.contacts?.first_name ?? ''} ${data.contacts?.last_name ?? ''}`.trim(),
    },
  };
};

export const fetchMessagesByThreadNamespace = async (
  namespace: string
): Promise<BackendResponse<any>> => {
  const supabase = createClient();
  const { data, error } = await (await supabase)
    .from('threads')
    .select(
      'messages!messages_thread_id_fkey(*, message_attachments(id, resource:resource_id(id, name, file_path, type)))'
    )
    .eq('namespace', namespace)
    .single()
    .throwOnError();
  if (error || !data) {
    return {
      success: false,
      message:
        (error as unknown as Error)?.message ?? 'Error fetching messages',
    };
  }

  return {
    success: true,
    message: 'Messages fetched successfully',
    data: data.messages,
  };
};
export const toggleAutoResponderByNamespace = async (
  namespace: string,
  auto_responder: boolean
): Promise<BackendResponse<Thread>> => {
  const status: Database['public']['Enums']['thread_status'] = auto_responder
    ? 'open'
    : 'closed';
  const supabase = createClient();
  const { data, error } = await (await supabase)
    .from('threads')
    .update({ status })
    .eq('namespace', namespace)
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Auto Responder updated successfully',
    data: data,
  };
};
