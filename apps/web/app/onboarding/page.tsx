import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { routes } from '@/utils/routes';
import Image from 'next/image';
import { checkOnboardingStep } from '@/actions/server/user-profile';
import { OnboardingStepEnum } from '@repo/types';
import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getSession();

  const onboardingStep = await checkOnboardingStep(
    session?.session?.user?.id || ''
  );

  if (onboardingStep !== OnboardingStepEnum.NOT_STARTED) {
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
        return redirect(routes.ONBOARDING_SETUP_MAIL_ACCOUNT);
    }
  }
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <div className="max-w-md text-center space-y-6">
        <div className="flex items-center justify-center">
          <Image
            className="w-full h-full object-contain"
            src="/get-started.svg"
            alt="Leadmark"
            width={300}
            height={300}
            priority
          />
        </div>
        <h1 className="text-2xl font-semibold">Welcome to Leadmark</h1>
        <p className="text-muted-foreground text-sm">
          Your AI-powered inbox for customer support and lead management
        </p>
        //update the step to setup_mail
        <Button asChild>
          <Link href={routes.ONBOARDING_SETUP_MAIL_ACCOUNT}>Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
