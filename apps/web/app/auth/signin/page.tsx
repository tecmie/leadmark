import { SignInPage } from '@/components/pages/auth/sign-in';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/client';

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect(routes.INBOX_OVERVIEW);
  }
  return <SignInPage />;
}
