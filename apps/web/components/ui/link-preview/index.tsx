/* eslint-disable @next/next/no-img-element */
'use client';

import { LinkPreviewData, getLinkPreviewData } from '@/utils/link-preview';
import { cn } from '@/utils/ui';
import { LinkIcon, Plus, X } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { LabelledInput } from '../input';
import { Label } from '../label';
import { Skeleton } from '../skeleton';
import styles from './link-preview.module.css';

interface LinkPreviewItemProps extends LinkPreviewData {
  className?: string;
  orientation: 'fixed' | 'full';
}

export const LinkPreviewItemSkeleton = ({
  orientation,
}: {
  orientation: 'fixed' | 'full';
}) => {
  return (
    <div
      className={cn(
        'h-20 w-full flex items-center gap-3 p-3 border border-primary-100 rounded-md snap-start',
        orientation === 'fixed' ? 'w-60' : 'w-full'
      )}
    >
      <Skeleton className="w-14 h-14 bg-blue-50" />
      <div
        className={cn(
          'flex flex-col items-start w-full gap-1 text-left h-14 ',
          orientation === 'fixed' ? 'w-[148px]' : 'w-full'
        )}
      >
        <Skeleton className="w-full h-4 bg-blue-50" />
        <Skeleton className="w-full h-4 bg-blue-50" />
        <Skeleton className="w-full h-4 bg-blue-50" />
      </div>
    </div>
  );
};

export const LinkPreviewItem = ({
  className,
  description,
  title,
  domain,
  sitename,
  image,
  orientation,
}: LinkPreviewItemProps) => {
  return (
    <div
      className={cn(
        'h-20 flex items-center gap-3 p-3 border border-border-neutral-weak rounded-md',
        className,
        orientation === 'fixed' ? 'w-60' : 'w-full'
      )}
    >
      <img
        src={image ?? `https://avatar.vercel.sh/${domain}`}
        alt="Preview image for link"
        className="object-cover w-14 h-14"
      />
      <div
        className={cn(
          'flex flex-col items-start w-full gap-0.5 text-left h-14',
          orientation === 'fixed' ? 'w-[148px]' : 'w-full'
        )}
      >
        <h3 className={`${styles.title} font-medium`}>
          {title ? title : sitename}
        </h3>
        <p
          className={`${styles.desc} text-xs overflow-hidden text-ellipsis max-h-8`}
        >
          {description ?? `Website domain: ${domain}`}
        </p>
      </div>
    </div>
  );
};

interface LinkPreviewProps {
  links: string[];
  setLinks: Dispatch<SetStateAction<string[]>>;
  isPreview?: boolean;
  orientation?: 'fixed' | 'full';
}

export const LinkPreview = ({
  links,
  setLinks,
  isPreview = true,
  orientation = 'fixed',
}: LinkPreviewProps) => {
  const [showLinkPreviews, setShowLinkPreviews] = useState(true);
  const [value] = useDebounce(links, 500);
  const [linkPreviews, setLinkPreviews] = useState<LinkPreviewData[]>([]);

  const validateLinks = () => {
    return links.every((link) => link.trim() !== '');
  };

  const addLinkInput = () => {
    if (links.length >= 3 || !validateLinks()) return;
    setLinks([...links, '']);
  };

  const removeLinkInput = (index: number) => {
    const newLinks = [...links];
    const newLinkPreviews = [...linkPreviews];

    newLinks.splice(index, 1);
    newLinkPreviews.splice(index, 1);

    setLinks(newLinks);
    setLinkPreviews(newLinkPreviews);
  };

  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  useEffect(() => {
    if (showLinkPreviews) {
      links.map(async (link, index) => {
        if (!link.length) return;

        try {
          const url = new URL(link);

          if (linkPreviews.length && linkPreviews[index]?.domain === url.host)
            return;

          const data = await getLinkPreviewData(url.href);

          if (data.status === 200 && data.data) {
            const newLinkPreviews = [...linkPreviews];
            newLinkPreviews[index] = data.data;
            setLinkPreviews(newLinkPreviews);
          }
        } catch {
          // toast.error(`${link} is invalid!`);
        }
      });
    }
  }, [value]);

  return (
    <div className="flex flex-col w-full gap-4">
      {links.map((link, index) => (
        <LabelledInput
          key={index}
          label={`Link ${index + 1}`}
          value={link}
          onChange={(e) => handleLinkChange(index, e.target.value.trim())}
          placeholder="Paste your link"
          type="text"
          startIcon={LinkIcon}
          endIcon={links.length > 1 ? X : undefined}
          onClickEndIcon={
            links.length > 1 ? () => removeLinkInput(index) : undefined
          }
        />
      ))}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {isPreview && (
          <Label
            htmlFor="show-link-previews"
            className="flex items-center gap-2 text-[#000000A3] "
          >
            <Checkbox
              name="show-link-previews"
              checked={showLinkPreviews}
              onClick={() => setShowLinkPreviews(!showLinkPreviews)}
            />{' '}
            Show link previews
          </Label>
        )}
        <Button
          onClick={addLinkInput}
          variant={'link'}
          disabled={links.length >= 3 || !validateLinks()}
          className="flex items-center gap-2 font-medium text-primary-base disabled:cursor-not-allowed "
        >
          Add link
          <Plus size={16} />
        </Button>
      </div>
      {showLinkPreviews && isPreview && (
        <div className="w-full overflow-auto no-scrollbar snap-x snap-mandatory">
          <div
            className={cn(
              'flex items-center gap-3 ',
              orientation === 'fixed' ? 'w-max' : 'flex-col w-full'
            )}
          >
            {linkPreviews && linkPreviews?.length > 0
              ? linkPreviews.map((linkPreview, index) => (
                  <LinkPreviewItem
                    key={index}
                    {...linkPreview}
                    className="snap-start"
                    orientation={orientation}
                  />
                ))
              : links.map((_, index) => (
                  <LinkPreviewItemSkeleton
                    key={index}
                    orientation={orientation}
                  />
                ))}
          </div>
        </div>
      )}
    </div>
  );
};
