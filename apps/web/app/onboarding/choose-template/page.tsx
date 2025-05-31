import { checkOnboardingStep } from '@/actions/server/user-profile';
import ChooseTemplatePage from '@/components/pages/onboarding/choose-template';
import { createClient } from '@/supabase/server';
import { routes } from '@/utils/routes';
import { OnboardingStepEnum } from '@repo/types';
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

  if (onboardingStep !== OnboardingStepEnum.CHOOSE_TEMPLATE) {
    // Redirect to the correct step
    switch (onboardingStep) {
      case OnboardingStepEnum.SETUP_MAIL:
        return redirect(routes.ONBOARDING_SETUP_MAIL_ACCOUNT);
      case OnboardingStepEnum.RESOURCE:
        return redirect(routes.ONBOARDING_SETUP_RESOURCE);
      case OnboardingStepEnum.CUSTOMIZE:
        return redirect(routes.ONBOARDING_CUSTOMIZE);
      case OnboardingStepEnum.WELCOME:
        return redirect(routes.ONBOARDING_WELCOME);
      default:
        return redirect(routes.ONBOARDING_GET_STARTED);
    }
  }
  return <ChooseTemplatePage />;
}
