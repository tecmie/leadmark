'use client';

import { ExternalLinkIcon } from '@/components/icons/sidebar';
import { routes } from '@/utils/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';
import {
  ActiveAppIcon,
  ActiveHomeIcon,
  ActiveProfileIcon,
  ActiveSettingsIcon,
  AppsNavIcon,
  HomeNavIcon,
  ProfileNavIcon,
  SettingsNavIcon
} from '../icons/NavIcons';
import { Button } from './button';
import { SidebarEmailCounter } from './sidebar';

const links = [
  { label: 'Terms of service', href: '#' },
  { label: 'Privacy policy', href: '#' }
];

const navs = [
  {
    title: 'Home',
    route: routes.inboxOverview,
    icon: <HomeNavIcon className="inline-block mb-1" />,
    activeIcon: <ActiveHomeIcon className="inline-block mb-1" />
  },
  {
    title: 'Apps',
    route: routes.apps,
    icon: <AppsNavIcon className="inline-block mb-1" />,
    activeIcon: <ActiveAppIcon className="inline-block mb-1" />
  },
  {
    title: 'Profile',
    route: routes.profile,
    icon: <ProfileNavIcon className="inline-block mb-1" />,
    activeIcon: <ActiveProfileIcon className="inline-block mb-1" />
  },
  {
    title: 'Settings',
    route: routes.settings,
    icon: <SettingsNavIcon className="inline-block mb-1" />,
    activeIcon: <ActiveSettingsIcon className="inline-block mb-1" />
  }
];

interface BottomNavProps extends PropsWithChildren {
  threadCount: number | undefined;
}

const BottomNav = ({ threadCount }: BottomNavProps) => {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {/* <section id="bottom-navigation" class="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-white shadow"> // if shown only tablet/mobile*/}
      <div className="hidden px-8 py-4 sm:h-[56px] h-[72px] sm:flex items-center justify-between gap-4 bg-transparent w-full">
        <SidebarEmailCounter mailsSent={threadCount} isBottom />
        <div className="flex items-center justify-end w-full gap-4">
          {links.map((link, index) => (
            <Button
              key={index}
              variant={'link'}
              className="p-0 text-sm text-primary-base"
              asChild
            >
              <a href={link.href} target="_blank">
                {link.label} <ExternalLinkIcon className="w-2 h-2" />
              </a>
            </Button>
          ))}
        </div>
      </div>
      <section
        id="bottom-navigation"
        className="sm:hidden block fixed inset-x-0 bottom-0 z-2 shadow py-3 px-2 bg-white dark:bg-transparent border-t border-[#00000012]"
      >
        <div id="tabs" className="flex justify-between">
          {navs?.map((nav, index) => (
            <Link
              href={nav.route}
              className="justify-center inline-block w-full pt-2 pb-1 text-center text-primary-base"
              key={index}
            >
              {pathname && pathname.startsWith(nav.route)
                ? nav.activeIcon
                : nav.icon}
              <span className="block text-xs tab tab-home">{nav.title}</span>
            </Link>
          ))}
          {/* <Link
            href={routes.inboxOverview}
            className="w-full focus:text-[#56A0D2] hover:text-[#56A0D2] justify-center inline-block text-center pt-2 pb-1"
          >
            <HomeNavIcon className="inline-block mb-1" />
            <span className="block text-xs tab tab-home">Home</span>
          </Link>
          <Link
            href={routes.apps}
            className="w-full focus:text-[#56A0D2] hover:text-[#56A0D2] justify-center inline-block text-center pt-2 pb-1"
          >
            <AppsNavIcon className="inline-block mb-1" />
            <span className="block text-xs tab tab-kategori">Apps</span>
          </Link>
          <Link
            href={routes.profile}
            className="w-full focus:text-[#56A0D2] hover:text-[#56A0D2] justify-center inline-block text-center pt-2 pb-1"
          >
            <ProfileNavIcon className="inline-block mb-1" />
            <span className="block text-xs tab tab-explore">Profile</span>
          </Link>
          <Link
            href={routes.settings}
            className="w-full focus:text-[#56A0D2] hover:text-[#56A0D2] justify-center inline-block text-center pt-2 pb-1"
          >
            <SettingsNavIcon className="inline-block mb-1" />
            <span className="block text-xs tab tab-whishlist">Settings</span>
          </Link> */}
        </div>
      </section>
    </div>
  );
};
export default BottomNav;
