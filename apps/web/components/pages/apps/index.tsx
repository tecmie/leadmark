'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/ui';
import { ArrowRightCircle, ListFilter } from 'lucide-react';
import { ComingSoonTag } from '@/components/ui/coming-soon';
import { appList } from '@/constants/apps';
import { useState } from 'react';
import { GoogleCalendarIntegration } from '@/components/pages/settings/integrations/google-calendar';

export const AppsPage = () => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const handleAppClick = (appName: string) => {
    if (appName === 'Google Calendar') {
      setSelectedApp('Google Calendar');
    }
  };

  if (selectedApp === 'Google Calendar') {
    return <GoogleCalendarIntegration onBack={() => setSelectedApp(null)} />;
  }

  return (
    <div className="flex flex-col w-full h-full overflow-auto [&::-webkit-scrollbar]:hidden pb-20 sm:pb-0">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <div className="text-xl font-medium text-black">Applications</div>
          <ComingSoonTag />
        </div>

        <div
          className={cn(
            buttonVariants({ variant: 'link' }),
            'text-primary-base p-0 flex items-center gap-2 h-5 rounded-sm border-none'
          )}
        >
          Filters <ListFilter size={16} className="text-primary-base" />
        </div>
      </div>
      <div className="p-4 text-base border-t border-b border-[#00000012]">
        Applications supercharge your inbox, granting you access to a multitude
        of applications directly within your inbox.
      </div>
      <div className="flex flex-col gap-4 p-4 pb-10">
        {appList?.map((app) => (
          <Button
            variant={'secondary'}
            key={app.appName}
            className={cn(
              "rounded-full w-full flex justify-between items-center p-4 h-auto bg-[#050e140a]",
              app.appName !== 'Google Calendar' && "opacity-50 cursor-not-allowed"
            )}
            disabled={app.appName !== 'Google Calendar'}
            onClick={() => handleAppClick(app.appName)}
          >
            <div className="flex items-center gap-4">
              <Avatar src={app?.appIcon} className="w-6 h-6" />
              <div className="text-base text-black text-medium">
                {app?.appName}
              </div>
            </div>
            <ArrowRightCircle className="text-[#adb6f9] w-6 h-6" />
          </Button>
        ))}
      </div>
    </div>
  );
};
