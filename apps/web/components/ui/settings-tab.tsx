'use client';

import { routes } from '@/utils/routes';
import { Box, FileEdit, FileText, LucideIcon, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

export type SettingsTabType = 'profile' | 'documents' | 'actions' | 'integrations';

interface SettingsTabItem {
  label: SettingsTabType;
  icon: LucideIcon;
  href: string;
}

const SETTING_TABS: SettingsTabItem[] = [
  { label: 'profile', icon: User, href: routes.PROFILE },
  {
    label: 'documents',
    icon: FileText,
    href: routes.SETTINGS_DOCUMENTS,
  },
  {
    label: 'actions',
    icon: FileEdit,
    href: routes.SETTINGS_ACTIONS,
  },
  {
    label: 'integrations',
    icon: Box,
    href: routes.SETTINGS_INTEGRATIONS,
  },
];

interface SettingsTabProps extends PropsWithChildren {
  activeTab: SettingsTabType;
}

const SettingsTabComponent = ({ children, activeTab }: SettingsTabProps) => {
  const router = useRouter();

  return (
    <Tabs defaultValue={activeTab} className="flex flex-col w-full gap-8">
      <TabsList className="overflow-auto no-scrollbar">
        {SETTING_TABS.map(({ icon: Icon, label, href }, index) => (
          <TabsTrigger
            onClick={() => router.push(href)}
            key={index}
            value={label}
            className="capitalize"
          >
            <Icon size={16} />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={activeTab}>{children}</TabsContent>
    </Tabs>
  );
};

export { SettingsTabComponent as SettingsTab };
