import { getUser } from '@/actions/server/auth';
import { ContactsPage } from '@/components/pages/contacts';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getUser();

  if (!session) {
    return redirect(routes.SIGN_IN);
  }

  return <ContactsPage />;
}