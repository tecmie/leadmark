import { InboxViewerPage } from '@/components/pages/inbox/viewer';
import { fetchMailbox } from '@/actions/server/mailbox';
import {
  fetchMessagesByThreadNamespace,
  getThreadByNamespace,
} from '@/actions/server/threads';
import { getSession } from '@/actions/server/auth';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';

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

  if (!messages || !thread) {
    redirect(routes.INBOX_OVERVIEW);
  }

  return (
    <InboxViewerPage
      thread={thread}
      messages={messages}
      email={`${mailbox?.unique_address}@${mailbox?.dotcom}`}
      fullname={mailbox?.full_name ?? ''}
      namespace={(await params).namespace}
    />
  );
}
