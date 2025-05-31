import { fetchMailbox } from '@/actions/server/mailbox';
import { fetchInboxThreads } from '@/actions/server/threads';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { getSession } from '@/actions/server/auth';
import { InboxLayout } from '@/components/layouts/inbox-layout';

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getSession();

  if (!session) {
    return redirect(routes.SIGN_IN);
  }

  const { data } = await fetchMailbox(session.user.id);
  const { data: threads } = await fetchInboxThreads();
  return (
    <InboxLayout
      objective={String(data?.raw_objective)}
      name={data?.unique_address ?? ''}
      email={`${data?.unique_address}@${data?.dotcom}`}
      fullname={(data?.owner as any).full_name ?? ''}
      domain={data?.dotcom ?? ''}
      initials={String(data?.unique_address)
        .substring(0, 2)
        .toUpperCase()}
      bio={(data?.owner as any).full_name ?? ''}
      uniqueAddress={data?.unique_address ?? ''}
      className=""
      threads={threads}
    >
      {children}
    </InboxLayout>
  );
}
