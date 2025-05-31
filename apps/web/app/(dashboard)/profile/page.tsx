import { fetchMailbox } from '@/actions/server/mailbox';
import { getUser } from '@/actions/server/auth';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';
import { ProfilePage } from '@/components/pages/profile';
import { createClient } from '@/supabase/server';

export default async function Page() {
  const session = await getUser();

  if (!session) {
    redirect(routes.SIGN_IN);
  }

  const { data: mailbox } = await fetchMailbox(session.user.id);
  
  // Fetch profile data from the profiles table
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', session.user.id)
    .single();

  const fullName = profile?.full_name || '';
  const initials = fullName
    ? fullName.split(' ').map((name: string) => name.charAt(0)).join('').substring(0, 2).toUpperCase()
    : '';

  return (
    <ProfilePage
      email={`${mailbox?.unique_address}@${mailbox?.dotcom}`}
      fullname={fullName}
      initials={initials}
      mailboxObjective={mailbox?.raw_objective ?? ''}
      uniqueAddress={mailbox?.unique_address ?? ''}
      bio={''} // bio could be stored in user_metadata or added to profiles table
    />
  );
}
