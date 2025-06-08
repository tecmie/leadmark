import GetStarted from '@/components/pages/onboarding/get-started';
import Image from 'next/image';
import { createClient } from '@/supabase/server';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
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
        <GetStarted userId={userId || ''} />
      </div>
    </div>
  );
}
