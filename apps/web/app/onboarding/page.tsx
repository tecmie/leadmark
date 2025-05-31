import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { routes } from '@/utils/routes';
import Image from 'next/image';

export default async function OnboardingPage() {
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
        <Link href={routes.ONBOARDING_SETUP_MAIL_ACCOUNT}>
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
