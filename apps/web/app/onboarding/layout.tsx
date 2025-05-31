import { checkOnboardingStatus } from '@/actions/server/user-profile';
import { OnboardingLayout } from '@/components/layouts/onboarding-layout';
import { createClient } from '@/supabase/server';
import { routes } from '@/utils/routes';
import { OnboardingStatusEnum } from '@repo/types';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user?.id) {
    return redirect(routes.SIGN_IN);
  }

  // check if the user is onboarded
  const onboardingStatus = await checkOnboardingStatus(
    user.user?.id || ''
  );
  if (onboardingStatus === OnboardingStatusEnum.COMPLETED) {
    return redirect(routes.INBOX_OVERVIEW);
  }

  return <OnboardingLayout>{children}</OnboardingLayout>;
}
