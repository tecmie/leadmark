import { SignUpPage } from '@/components/pages/auth/sign-up';
import { createClient } from '@/supabase/client';
import { redirect } from 'next/navigation';
import { routes } from '@/utils/routes';
import { Suspense } from 'react';

export default async function Page() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user?.id) {
    return redirect(routes.INBOX_OVERVIEW);
  }
  return (
    <Suspense fallback={<></>}>
      <SignUpPage />
    </Suspense>
  );
}
