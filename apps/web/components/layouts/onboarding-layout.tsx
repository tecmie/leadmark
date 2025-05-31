'use client';

import type React from 'react';
import { usePathname } from 'next/navigation';
import { LogoMark } from '@/components/ui/logo-mark';
import { PropsWithChildren } from 'react';
import { routes } from '@/utils/routes';
import { logout } from '@/actions/server/auth';
import { LogOutIcon } from 'lucide-react';

const steps = [
  { path: routes.ONBOARDING_SETUP_MAIL_ACCOUNT, label: 'Setup', number: 1 },
  { path: routes.ONBOARDING_SETUP_RESOURCE, label: 'Resources', number: 2 },
  { path: routes.ONBOARDING_CHOOSE_TEMPLATE, label: 'Templates', number: 3 },
  { path: routes.ONBOARDING_CUSTOMIZE, label: 'Customize', number: 4 },
];

export const OnboardingLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen relative overflow-hidden w-full">
      <div className="app-container z-10 flex items-center justify-between w-full py-4">
        <header className="flex-1">
          <LogoMark />
        </header>
        <button
          className="ml-4 flex items-center gap-2 whitespace-nowrap font-medium cursor-pointer right-4 text-destructive"
          onClick={async () => {
            await logout();
            window.location.reload();
          }}
        >
          Logout <LogOutIcon className="w-4 h-4" />
        </button>
      </div>
      <main className="py-8 max-w-[680px] mx-auto w-full">
        {/* if onboarding route is /onboarding don't show onboarding progress */}
        {pathname !== routes.ONBOARDING_GET_STARTED && <OnboardingProgress />}
        <div className="mt-12">{children}</div>
      </main>
    </div>
  );
};

function OnboardingProgress() {
  'use client';

  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-0">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                  ${
                    index <= currentStepIndex
                      ? 'bg-primary-base text-white shadow-[0_4px_16px_rgba(79,63,253,0.24)]'
                      : 'bg-[#F1F1F6] text-[#7C7C8A]'
                  }
                `}
                style={{
                  border:
                    index <= currentStepIndex
                      ? '2px solid #8EA7E0'
                      : '2px solid #F1F1F6',
                }}
              >
                {step.number}
              </div>
              <span className="text-xs text-[#7C7C8A] mt-2 hidden font-medium tracking-wide">
                {step.label}
              </span>
            </div>
            {/* Progress Bar */}
            {index < steps.length - 1 && (
              <div className="relative flex items-center mx-3 w-28 h-2">
                {/* Background bar */}
                <div className="absolute w-full h-2 rounded bg-[#F1F1F6]" />
                {/* Filled bar */}
                <div
                  className={`absolute h-2 rounded transition-all duration-300`}
                  style={{
                    width:
                      index < currentStepIndex
                        ? '100%'
                        : index === currentStepIndex
                          ? '50%'
                          : '0%',
                    background: '#8EA7E0',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
