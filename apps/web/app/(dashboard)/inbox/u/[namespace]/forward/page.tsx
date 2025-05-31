import { InboxViewerPage } from '@/components/pages/inbox/forward';
import { fetchMailbox } from '@/actions/server/mailbox';
import {
  fetchMessagesByThreadNamespace,
  getThreadByNamespace,
} from '@/actions/server/threads';
import { getSession } from '@/actions/server/auth';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';

export default async function Page({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { data: messages } = await fetchMessagesByThreadNamespace(
    (await params).namespace
  );
  const { data: thread } = await getThreadByNamespace((await params).namespace);

  const session = await getSession();

  if (!session) {
    return redirect(routes.SIGN_IN);
  }
  const { data: mailbox } = await fetchMailbox(session.user.id);
  
  // Fetch profile data for fullname
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', session.user.id)
    .single();

  if (!messages || !thread) {
    redirect(routes.INBOX_OVERVIEW);
  }

  return (
    <InboxViewerPage
      thread={thread}
      messages={messages}
      email={`${mailbox?.unique_address}@${mailbox?.dotcom}`}
      fullname={profile?.full_name || ''}
      id={(await params).namespace}
    />
  );
}
