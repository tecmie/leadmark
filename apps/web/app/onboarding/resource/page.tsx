import ResourcesPage from '@/components/pages/onboarding/resource';
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { routes } from '@/utils/routes';
import { checkOnboardingStep } from '@/actions/server/user-profile';
import { OnboardingStepEnum } from '@repo/types';

export default async function Page() {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getSession();
  if (!session) {
    return redirect(routes.SIGN_IN);
  }

  const onboardingStep = await checkOnboardingStep(
    session?.session?.user?.id || ''
  );

  if (onboardingStep !== OnboardingStepEnum.RESOURCE) {
    // Redirect to the correct step
    switch (onboardingStep) {
      case OnboardingStepEnum.SETUP_MAIL:
        return redirect(routes.ONBOARDING_SETUP_MAIL_ACCOUNT);
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
  return <ResourcesPage />;
}
