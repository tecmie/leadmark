'use client';

import useMediaQuery from '@/utils/hooks/use-media-query';
import useDisclosure from '@/utils/hooks/useDisclosure';
import { routes } from '@/utils/routes';
import { cn } from '@/utils/ui';
import { createClient } from '@/supabase/client';
import { LogOutIcon, LucideX, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SVGProps, useEffect } from 'react';
import {
  AllInboxIcon,
  ExternalLinkIcon,
  InportantInboxIcon,
  NeedsAttentionIcon
} from '../../icons/sidebar';
import { Avatar } from '../avatar';
import { LogoMark } from '../logo-mark';
import { Button } from '../button';
import { Progress } from '../progress';
import { AddFolderDialog } from './folder-Modal';
import Folders from './folders';
import { SidebarItem } from './sidebar-item';
import { ComingSoonTag } from '../coming-soon';

interface SidebarEmailCounterProps {
  mailsSent: number | undefined;
  mailsTotal?: number;
  isBottom?: boolean;
}

interface SidebarItem {
  icon: React.FC<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
}
export const SidebarEmailCounter = ({
  mailsSent = 0,
  mailsTotal = 100,
  isBottom = false
}: SidebarEmailCounterProps) => {
  const computedMails = (mailsSent / mailsTotal) * 100;
  return (
    <div
      className={cn(
        'flex gap-2 justify-center ',
        { 'flex-row w-full items-center': isBottom },
        { ' border-t border-[#0000000A] flex-col h-[119px]': !isBottom }
      )}
    >
      <Progress className="w-32" value={computedMails} />
      <div className="items-center flex-shrink-0 hidden gap-1 text-[#000000A3] sm:flex ">
        <span className="font-bold text-black">{mailsSent}</span> of{' '}
        <span className="font-bold text-black">{mailsTotal}</span>
        mails received
      </div>
      <p className="block text-black sm:hidden">
        <span className="font-bold text-black">{mailsSent}</span> of{' '}
        <span className="font-bold text-black">{mailsTotal}</span> mails
        received
      </p>
      <Link href={routes.BILLING} className="w-full text-primary-base">
        Get more mails
      </Link>
    </div>
  );
};

const SIDEBAR_ROUTES: SidebarItem[] = [
  {
    icon: AllInboxIcon,
    href: routes.INBOX_OVERVIEW,
    label: 'All inboxes',
  },
  {
    icon: InportantInboxIcon,
    href: routes.INBOX_IMPORTANT,
    label: 'Important',
  },

  {
    icon: NeedsAttentionIcon,
    href: routes.INBOX_ATTENTION,
    label: 'Needs attention',
  },
];

export const SidebarExternalLinks = () => {
  const links = [
    { label: 'Terms of service', href: '#' },
    { label: 'Privacy policy', href: '#' }
  ];
  return (
    <div className="p-4 sm:h-full flex flex-row sm:flex-col text-[#56A0D2] items-center sm:items-start justify-start sm:justify-center gap-4 border-t border-[#0000000A] ">
      {links.map((link, index) => (
        <Button
          key={index}
          variant={'link'}
          className="p-0 text-sm h-max"
          asChild
        >
          <a href={link.href} target="_blank">
            {link.label} <ExternalLinkIcon className="w-2.5 h-2.5" />
          </a>
        </Button>
      ))}
    </div>
  );
};

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  email?: string;
  initials?: string;
}

export const Sidebar = ({
  isExpanded = false,
  toggleSidebar,
  initials,
  email
}: SidebarProps) => {
  const { isMobile } = useMediaQuery();
  const pathname = usePathname();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (isExpanded && isMobile) {
      toggleSidebar();
    }
  }, [pathname]);

  const router = useRouter();
  const supabase = createClient();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (isMobile)
    return (
      <aside
        className={cn(
          'absolute top-0 left-0 bottom-0 right-0 bg-black/30 backdrop-blur-sm z-30 transition-transform duration-100 sm:hidden',
          {
            'translate-x-0 transition-all duration-300 ease-in-out': isExpanded,
            'translate-x-[-100%] transition-all duration-300 ease-in-out':
              !isExpanded
          }
        )}
        onClick={() => toggleSidebar()}
      >
        <div
          className={cn(
            'bg-[#FFFFFF] dark:bg-background-secondary h-full w-full border-r border-r-border-neutral-weaker py-0 flex flex-col flex-shrink-0 z-10'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-4 p-4 bg-[#92C2E229]">
            <div className="w-full rounded-full p-2 flex justify-between items-center bg-[#00000012] text-black font-bold">
              <LucideX
                className="text-[#000000a3] w-4 h-4 ml-2"
                onClick={() => toggleSidebar()}
              />
              <div>{email}</div>
              <Avatar src="" label={initials} className="w-7 h-7" />
            </div>
            <div className="m-auto">
              <LogoMark />
            </div>
          </div>
          <div className="flex flex-col flex-shrink-0">
            {SIDEBAR_ROUTES.map((route, index) => (
              <SidebarItem key={index} {...route} isExpanded={true} />
            ))}
          </div>
          <div className="flex flex-col overflow-auto">
            <span className=" px-4 flex flex-shrink-0 items-center text-black uppercase text-[10px] tracking-[4%]  mt-4 font-bold">
              Folders
              <ComingSoonTag className="ml-4" />
            </span>
            <div>
              <Folders isExpanded={isExpanded} />
            </div>
            <AddFolderDialog closeDialog={onClose} openDialog={isOpen} />
            {isExpanded && (
              <button
                onClick={() => onOpen()}
                className="flex items-center flex-shrink-0 w-full p-4 text-sm font-medium text-primary-base "
              >
                Add a folder
              </button>
            )}
          </div>
          <div className="flex flex-col mt-auto mb-0 ">
            <div className="p-4">
              {/* <ModeToggle isExpanded={isExpanded} /> */}
              <Button
                className={cn('text-[#D7796A]', { 'p-0': isExpanded })}
                variant="ghost"
                onClick={() => handleLogout()}
              >
                {isExpanded ? (
                  <>
                    <LogOutIcon className="w-4 h-4" /> Logout
                  </>
                ) : (
                  <LogOutIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="px-4">
              <SidebarEmailCounter mailsSent={20} />
            </div>

            <SidebarExternalLinks />
          </div>
        </div>
      </aside>
    );

  return (
    <aside
      className={cn(
        ' transition-all ease-in-out hidden max-w-[200px] bg-[#FFFFFFA3] sm:rounded-l-lg dark:bg-background sm:flex flex-col flex-shrink-0 gap-5 ',
        { 'w-[60px] duration-300 ': !isExpanded },
        { 'w-full duration-700 p-2': isExpanded }
      )}
    >
      <div className="flex flex-col items-center ">
        {SIDEBAR_ROUTES.map((route, index) => (
          <SidebarItem key={index} {...route} isExpanded={isExpanded} />
        ))}
      </div>
      <div className="flex flex-col items-center justify-center overflow-auto">
        <div
          className={`flex items-center p-2 ${
            isExpanded ? 'justify-between' : 'justify-center'
          } w-full`}
        >
          {isExpanded && (
            <span className="flex items-center flex-shrink-0 text-[10px] tracking-[0.4px] leading-3 font-bold text-black uppercase dark:text-white">
              Folders
            </span>
          )}
          {!isExpanded && (
            <Button
              onClick={() => onOpen()}
              size="icon"
              className="bg-transparent "
            >
              <PlusIcon className="w-4 h-4 text-[#000000A3]" />
            </Button>
          )}
        </div>
        <Folders isExpanded={isExpanded} />
        <AddFolderDialog closeDialog={onClose} openDialog={isOpen} />
        {isExpanded && (
          <button
            onClick={() => onOpen()}
            className="flex items-center flex-shrink-0 w-full p-2 text-sm font-medium text-primary-base dark:text-white"
          >
            Add a folder
          </button>
        )}
      </div>
      <div className="flex flex-col px-2 mt-auto mb-0">
        <div>
          {/* <ModeToggle isExpanded={isExpanded} /> */}
          <Button
            className={cn('text-[#D7796A]', { 'p-0': isExpanded })}
            variant="ghost"
            onClick={() => handleLogout()}
          >
            {isExpanded ? (
              <>
                <LogOutIcon className="w-4 h-4" /> Logout
              </>
            ) : (
              <LogOutIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
        {isExpanded && (
          <div className="flex-col hidden ">
            <SidebarEmailCounter mailsSent={20} />
            <SidebarExternalLinks />
          </div>
        )}
      </div>
    </aside>
  );
};
