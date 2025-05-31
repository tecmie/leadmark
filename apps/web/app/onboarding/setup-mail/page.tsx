import { checkOnboardingStep } from '@/actions/server/user-profile';
import SetupMailPage from '@/components/pages/onboarding/setup-mail';
import { routes } from '@/utils/routes';
import { OnboardingStepEnum } from '@repo/types';
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getSession();
  if (!session) {
    return redirect(routes.SIGN_IN);
  }

  const onboardingStep = await checkOnboardingStep(
    session?.session?.user?.id || ''
  );

  if (onboardingStep !== OnboardingStepEnum.SETUP_MAIL) {
    // Redirect to the correct step
    switch (onboardingStep) {
      case OnboardingStepEnum.RESOURCE:
        return redirect(routes.ONBOARDING_SETUP_RESOURCE);
      case OnboardingStepEnum.CHOOSE_TEMPLATE:
        return redirect(routes.ONBOARDING_CHOOSE_TEMPLATE);
      case OnboardingStepEnum.CUSTOMIZE:
        return redirect(routes.ONBOARDING_CUSTOMIZE);
      case OnboardingStepEnum.WELCOME:
        return redirect(routes.ONBOARDING_WELCOME);
      default:
        return redirect(routes.ONBOARDING_GET_STARTED);
    }
  }
  return <SetupMailPage />;
}
