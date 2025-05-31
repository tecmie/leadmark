'use client';

import { Button } from '@/components/ui/button';
import { LinkPreview } from '@/components/ui/link-preview';
import { uploadResources } from '@/actions/server/resources';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/supabase/client';

interface SettingsLinkPageProps {
  links: string[];
}

export const SettingsLinkPage = ({
  links: resourceLinks
}: SettingsLinkPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState(resourceLinks);
  const supabase = createClient();

  const validateLinks = () => {
    try {
      links.map((o) => {
        try{
        new URL(o);
      }
      catch(e){
        toast.error(`${o} is invalid!`);
        throw new Error(`${o} is invalid!`);
      }
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleLinkUpdate = async () => {
    setIsLoading(true);

    if (!validateLinks()) {
      // toast.error('Some links are invalid.');
      setIsLoading(false);
      return;
    }

    const session = await supabase.auth.getSession();

    if (!session) {
      return;
    }

    const processedLinks: {
      name: string;
      resourceUrl: string;
      resourceType: string;
      contextSpace: string;
      rawMetadata: {
        fullUrl: string;
        sizeInBytes: number;
      };
    }[] = links.map((link) => ({
      name: link || 'unnamed-link',
      resourceUrl: link,
      resourceType: 'link',
      contextSpace: 'global',
      rawMetadata: {
        fullUrl: link,
        sizeInBytes: 0,
      }
    }));

    const { success, message } = await uploadResources({
      userId: session.data.session?.user.id ?? '',
      resources: processedLinks
    });

    if (!success) {
      toast.error(message);
    }

    if (success) {
      toast.success(message);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex flex-col gap-1">
        <h3 className="px-6 py-4 text-xl text-black sm:text-2xl dark:text-neutral-strong">
          Links
        </h3>
        <p className="p-6 border-y border-surface-surface-normal">
          Enter the URL(s) of your external support content that will empower
          your AI inbox. These can be support materials, documentation, sitemaps or
          anything else that helps your inbox perform at its best.
        </p>
      </div>
      <div className="flex flex-col gap-6 px-6">
        <LinkPreview links={links} setLinks={setLinks} orientation="full" />
        <Button
          variant="default"
          onClick={handleLinkUpdate}
          disabled={links === resourceLinks || isLoading}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            'Update links'
          )}
        </Button>
      </div>
    </div>
  );
};
