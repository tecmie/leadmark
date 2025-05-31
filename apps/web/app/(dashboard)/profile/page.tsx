import { fetchMailbox } from '@/actions/server/mailbox';
import { getSession } from '@/actions/server/auth';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';
import { ProfilePage } from '@/components/pages/profile';

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect(routes.SIGN_IN);
  }

  const { data: mailbox } = await fetchMailbox(session.user.id);

  return (
    <ProfilePage
      email={`${mailbox?.unique_address}@${mailbox?.dotcom}`}
      fullname={mailbox?.full_name ?? ''}
      initials={String(mailbox?.full_name).substring(0, 2)}
      mailboxObjective={mailbox?.objective_raw ?? ''}
      uniqueAddress={mailbox?.unique_address ?? ''}
      bio={mailbox?.bio ?? ''}
    />
  );
}
