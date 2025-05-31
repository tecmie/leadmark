'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { GoogleCalendarIntegration } from './integrations/google-calendar';
import { appList } from '@/constants/apps';

export const SettingsIntegrationsPage = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const handleIntegrationClick = (appName: string) => {
    if (appName === 'Google Calendar') {
      setSelectedIntegration('Google Calendar');
    }
  };

  if (selectedIntegration === 'Google Calendar') {
    return <GoogleCalendarIntegration onBack={() => setSelectedIntegration(null)} />;
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl sm:text-2xl text-neutral-strong flex items-center gap-2">
          Integrations{' '}
          <span className="text-xs px-2 py-1 border border-link text-link">
            Coming soon
          </span>
        </h3>
        <p>
          Integrations, much like actions, supercharge your inbox, granting you
          access to a multitude of applications directly within your inbox.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {appList.map((app, index) => (
          <Button
            key={index}
            variant={'outline'}
            className="border-border-neutral-weaker text-neutral-strong disabled:opacity-80 disabled:cursor-not-allowed"
            disabled={app.appName !== 'Google Calendar'}
            onClick={() => handleIntegrationClick(app.appName)}
          >
            <Image
              src={app.appIcon}
              width={16}
              height={16}
              alt={`${app.appName} icon`}
            />
            <span className="flex-1 text-left">{app.appName}</span>
            <ChevronRight size={16} />
          </Button>
        ))}
      </div>
    </div>
  );
};
