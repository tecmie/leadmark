'use client';

import { SettingsTab, SettingsTabType } from '@/components/ui/settings-tab';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

export const SettingsSlot = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const activeTab = pathname?.match(/^\/settings\/(.+?)(\?.*)?$/)?.[1] as
    | SettingsTabType
    | undefined;

  return (
    <SettingsTab activeTab={activeTab ?? 'profile'}>{children}</SettingsTab>
  );
};
