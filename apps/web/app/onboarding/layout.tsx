import { OnboardingLayout } from '@/components/layouts/onboarding-layout';
import { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  return <OnboardingLayout>{children}</OnboardingLayout>;
}
