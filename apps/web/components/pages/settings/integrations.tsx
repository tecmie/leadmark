import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

type Integration = {
  label: string;
  icon: string;
};

const SETTINGS_INTEGRATIONS: Integration[] = [
  { label: 'HTTP/Webhook', icon: '/icons/rss.svg' },
  { label: 'Telegram', icon: '/icons/telegram.jpg' },
  { label: 'Facebook', icon: '/icons/fb.svg' },
  { label: 'Google Workspace', icon: '/icons/google.jpg' },
  { label: 'Microsoft 365', icon: '/icons/ms-365.jpg' },
  { label: 'Zapier', icon: '/icons/zapier.jpg' },
  { label: 'Asana', icon: '/icons/asana.jpg' },
  { label: 'Discord', icon: '/icons/discord.jpg' },
  { label: 'Slack', icon: '/icons/slack.jpg' },
  { label: 'Clickup', icon: '/icons/clickup.jpg' }
];

export const SettingsIntegrationsPage = () => {
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
        {SETTINGS_INTEGRATIONS.map((integration, index) => (
          <Button
            key={index}
            variant={'outline'}
            className="border-border-neutral-weaker text-neutral-strong disabled:opacity-80 disabled:cursor-not-allowed disabled:pointer-events-auto"
            disabled
          >
            <Image
              src={integration.icon}
              width={16}
              height={16}
              alt={`${integration.label} icon`}
            />
            <span className="flex-1 text-left">{integration.label}</span>
            <ChevronRight size={16} />
          </Button>
        ))}
      </div>
    </div>
  );
};
