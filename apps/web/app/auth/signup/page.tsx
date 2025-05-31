import { SignUpPage } from '@/components/pages/auth/sign-up';
// import { routes } from '@/utils/routes';
// import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { Suspense } from 'react';

export default async function Page() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log(session);
  // if (session) {
  //   return redirect(routes.ONBOARDING_GET_STARTED);
  // }
  return (
    <Suspense fallback={<></>}>
      <SignUpPage />
    </Suspense>
  );
}
