"use client";

import { routes } from "@/utils/routes";
import { LucideMenu, LucidePlus, SearchIcon } from "lucide-react";
import { useSearch } from "@/contexts/search-context";
import { usePathname } from "next/navigation";
import {
  ActiveAppIcon,
  ActiveProfileIcon,
  AppsNavIcon,
  ProfileNavIcon,
} from "../icons/NavIcons";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { Input } from "./input";
import { LogoMark } from "./logo-mark";
import { Tooltip } from "./tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ComingSoonTag } from "./coming-soon";

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
  name,
}: NavbarProps) => {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div
      className={`items-center justify-between gap-10 sm:px-6 px-4 py-4 bg-transparent w-full h-[88px] ${
        pathname?.startsWith(routes?.INBOX_VIEWER) ? "hidden sm:flex" : "flex"
      } `}
    >

      <div className="flex items-center gap-2">

        <LogoMark />

        <div className="flex gap-4 ml-6">
            {[
            { label: "Inbox", path: routes.INBOX_VIEWER },
            { label: "Contacts", path: routes.APPS },
            { label: "Forms", path: routes.FORMS },
            { label: "Insights", path: routes.FORMS },
            ].map((item) => {
            const isActive = pathname?.startsWith(item.path);
            return (
              <button
              key={item.label}
              type="button"
              onClick={() => (window.location.href = item.path)}
              className={`text-sm font-medium px-2 py-1 rounded transition-colors cursor-pointer ${
                isActive
                ? "text-primary bg-muted"
                : "text-muted-foreground hover:text-primary"
              }`}
              >
              {item.label}
              </button>
            );
            })}
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
      {pathname?.startsWith(routes?.INBOX_VIEWER) && (
        <div className="relative flex items-center w-full sm:hidden">
          <Input
            startIcon={LucideMenu}
            readOnly
            placeholder={
              pathname?.startsWith(routes.INBOX_OVERVIEW)
                ? "Search inbox"
                : pathname?.startsWith(routes.SETTINGS)
                  ? "Search settings"
                  : pathname?.startsWith(routes.APPS)
                    ? "Search applications"
                    : pathname?.startsWith(routes.PROFILE)
                      ? "Search profile"
                      : "search"
            }
            className="w-full rounded-full bg-input border border-border placeholder:text-muted-foreground placeholder:opacity-50"
            onClickStartIcon={() => toggleSidebar()}
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute right-1.5">
              <Avatar src="" label={initials} className="w-8 h-8" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover border-border mr-2">
              <div className="text-center">
                <ComingSoonTag />
              </div>
              <DropdownMenuLabel className="text-primary text-xs">
                Switch Mailbox
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <Avatar src="" label={initials} className="w-8 h-8" />
                <div className="flex flex-col text-xs text-foreground">
                  <div className="font-semibold">{name}</div>
                  <div>{email}</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
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
            iconClass="text-muted-foreground opacity-50"
            placeholder="Search inbox"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-input border border-border placeholder:text-muted-foreground"
          />
          <div className="absolute right-[10px] flex items-center gap-2">
            <span className="hidden font-medium text-foreground lg:block">
              {email}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger className="-right-0.5">
                <Avatar src="" label={initials} className="w-8 h-8" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border-border">
                <div className="text-center">
                  <ComingSoonTag />
                </div>
                <DropdownMenuLabel className="text-primary text-xs">
                  Switch Mailbox
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Avatar src="" label={initials} className="w-8 h-8" />
                  <div className="flex flex-col text-xs text-foreground">
                    <div className="font-semibold">{name}</div>
                    <div>{email}</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
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

        <div ></div>

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
