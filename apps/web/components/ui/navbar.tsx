'use client';

import { routes } from '@/utils/routes';
import { LucideMenu, LucidePlus, SearchIcon } from 'lucide-react';
import { useSearch } from '@/contexts/search-context';
import { usePathname } from 'next/navigation';
import {
  ActiveAppIcon,
  ActiveProfileIcon,
  AppsNavIcon,
  ProfileNavIcon
} from '../icons/NavIcons';
import { Avatar } from './avatar';
import { Button } from './button';
import { Input } from './input';
import { LogoMark } from './logo-mark';
import { Tooltip } from './tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
import { ComingSoonTag } from './coming-soon';

interface NavbarProps {
  toggleSidebar: () => void;
  name: string;
  domain?: string;
  email: string;
  initials: string;
  setApp: () => void;
  setProfile: () => void;
  action: {
    showProfile: boolean;
    showApp: boolean;
  };
}

export const Navbar = ({
  toggleSidebar,
  setApp,
  initials,
  setProfile,
  email,
  action,
  name
}: NavbarProps) => {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div
      className={`items-center justify-between gap-10 sm:px-6 px-4 py-4 bg-transparent w-full h-[88px] ${
        pathname?.startsWith(routes?.INBOX_VIEWER) ? 'hidden sm:flex' : 'flex'
      } `}
    >
      <div className="relative items-center justify-center hidden gap-6 sm:flex ">
        <Button size="icon" variant="ghost" onClick={() => toggleSidebar()}>
          <LucideMenu size={16} />
        </Button>
        <div className="m-auto">
          <LogoMark />
        </div>
      </div>
      {/* <div className="relative items-center hidden w-full max-w-[500px] justify-start sm:flex">
        <Input
          startIcon={SearchIcon}
          placeholder="Search inbox"
          className="w-full rounded-full bg-[#00000012] border-0 placeholder:text-[#000000A3]"
        />
        <div className="absolute right-[10px] flex items-center gap-2">
          <span className="hidden font-medium text-black lg:block">
            {email}
          </span>
          <Avatar src="" label={initials} className="w-8 h-8 -right-0.5" />
        </div>
      </div> */}
      {!pathname?.startsWith(routes?.INBOX_VIEWER) && (
        <div className="relative flex items-center w-full sm:hidden">
          <Input
            startIcon={LucideMenu}
            readOnly
            placeholder={
              pathname?.startsWith(routes.INBOX_OVERVIEW)
                ? 'Search inbox'
                : pathname?.startsWith(routes.SETTINGS)
                  ? 'Search settings'
                  : pathname?.startsWith(routes.APPS)
                    ? 'Search applications'
                    : pathname?.startsWith(routes.PROFILE)
                      ? 'Search profile'
                      : 'search'
            }
            className="w-full rounded-full bg-[#00000012] border-0 placeholder:text-[#000000A3] placeholder:opacity-50"
            onClickStartIcon={() => toggleSidebar()}
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute right-1.5">
              <Avatar src="" label={initials} className="w-8 h-8" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white mr-2">
              <div className="text-center">
                <ComingSoonTag />
              </div>
              <DropdownMenuLabel className="text-primary text-xs">
                Switch Mailbox
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <Avatar src="" label={initials} className="w-8 h-8" />
                <div className="flex flex-col text-xs text-black">
                  <div className="font-semibold">{name}</div>
                  <div>{email}</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-300" />
              <DropdownMenuItem className="text-xs">
                <LucidePlus size={4} className="w-6 h-6" />
                <div>Create a new mailbox</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Avatar
            src=""
            label={initials}
            className="w-8 h-8 absolute right-1.5"
          /> */}
        </div>
      )}

      <div className="items-center justify-end hidden w-full gap-5 sm:flex">
        <div className="relative items-center hidden w-full max-w-[500px] justify-start sm:flex">
          <Input
            startIcon={SearchIcon}
            iconClass="text-[#000000A3] opacity-50"
            placeholder="Search inbox"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-[#00000012] border-0 placeholder:text-[#000000A3]"
          />
          <div className="absolute right-[10px] flex items-center gap-2">
            <span className="hidden font-medium text-black lg:block">
              {email}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger className="-right-0.5">
                <Avatar src="" label={initials} className="w-8 h-8" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <div className="text-center">
                  <ComingSoonTag />
                </div>
                <DropdownMenuLabel className="text-primary text-xs">
                  Switch Mailbox
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Avatar src="" label={initials} className="w-8 h-8" />
                  <div className="flex flex-col text-xs text-black">
                    <div className="font-semibold">{name}</div>
                    <div>{email}</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-300" />
                <DropdownMenuItem className="text-xs">
                  <LucidePlus size={4} className="w-6 h-6" />
                  <div>Create a new mailbox</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <Avatar src="" label={initials} className="w-8 h-8 -right-0.5" /> */}
          </div>
        </div>
        <Tooltip content="Apps" side="bottom">
          {action.showApp ? (
            <ActiveAppIcon onClick={setApp} className="inline-block" />
          ) : (
            <AppsNavIcon className="inline-block" onClick={setApp} />
          )}
        </Tooltip>

        <Tooltip content="Profile" side="bottom">
          {action.showProfile ? (
            <ActiveProfileIcon onClick={setProfile} className="inline-block" />
          ) : (
            <ProfileNavIcon className="inline-block" onClick={setProfile} />
          )}
        </Tooltip>

        <div className="mr-4"></div>

        {/* <Tooltip content="Settings" side="bottom">
          <Link
            href={routes.SETTINGS}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
          >
            <SettingsNavIcon className="inline-block" />
          </Link>
        </Tooltip> */}
      </div>
    </div>
  );
};
