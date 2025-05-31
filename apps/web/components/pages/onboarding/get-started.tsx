import { Button } from '@/components/ui/button';
import { routes } from '@/utils/routes';
import { createClient } from '@/supabase/server';
import { OnboardingStatusEnum } from '@repo/types';
import { OnboardingStepEnum } from '@repo/types';
import { updateOnboardingProgress } from '@/actions/server/user-profile';
import { toast } from 'sonner';
import { useRouter } from '@bprogress/next/app';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function GetStartedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleGetStarted = async () => {
    setIsLoading(true);
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    if (!userId) {
      return router.push(routes.SIGN_IN);
    }

    const updateResult = await updateOnboardingProgress(
      userId,
      OnboardingStatusEnum.IN_PROGRESS,
      OnboardingStepEnum.SETUP_MAIL
    );
    if (!updateResult.success) {
      toast.error(
        updateResult.message || 'Failed to update onboarding progress'
      );
      return;
    }

    router.push(routes.ONBOARDING_SETUP_MAIL_ACCOUNT);
  };

  return (
    //show loading state
    <Button className="w-full" onClick={handleGetStarted} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Getting Started...
        </>
      ) : (
        'Get Started'
      )}
    </Button>
  );
}
