'use client';

import { cn } from '@/utils/ui';
import { PropsWithChildren, useState } from 'react';
import { SearchProvider } from '@/contexts/search-context';
// import { Footer } from '../ui/footer';
// // import { Navbar } from '../ui/navbar';
import { IThread } from '@repo/types';
import { useRouter } from '@bprogress/next/app';
import { usePathname } from 'next/navigation';
import { GoBackIcon } from '../icons/NavIcons';
import { AppsPage } from '../pages/apps';
import { ProfilePage } from '../pages/profile';
import BottomNav from '../ui/bottom-nav';
import { Button } from '../ui/button';
import { Navbar } from '../ui/navbar';
import { Sidebar } from '../ui/sidebar';

interface InboxLayoutProps extends PropsWithChildren {
  name: string;
  domain: string;
  initials: string;
  className?: string;
  email?: string;
  fullname?: string;
  objective: string;
  bio: string;
  uniqueAddress: string;
  threads: IThread[] | undefined;
}

export const InboxLayout = ({
  children,
  className,
  email,
  fullname,
  initials,
  objective,
  bio,
  uniqueAddress,
  threads
}: InboxLayoutProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const toggleSidebar = () => setIsExpanded((prev) => !prev);
  const pathname = usePathname();
  const router = useRouter();
  const showNavbar = !pathname?.startsWith('/settings/');
  const [layoutState, setLayoutState] = useState({
    showProfile: false,
    showApp: false
  });

  const toggleProfile = () => {
    setLayoutState((prevState) => ({
      ...prevState,
      showProfile: !prevState.showProfile,
      showApp: false // Reset showApp to false
    }));
  };

  const toggleApp = () => {
    setLayoutState((prevState) => ({
      ...prevState,
      showApp: !prevState.showApp,
      showProfile: false // Reset showProfile to false
    }));
  };

  return (
    <SearchProvider>
      <main className="relative h-[100dvh] overflow-hidden flex flex-col bg-background">
      {showNavbar ? (
        <Navbar
          name={fullname as string}
          email={email as string}
          initials={initials}
          toggleSidebar={toggleSidebar}
          setApp={toggleApp}
          setProfile={toggleProfile}
          action={layoutState}
        />
      ) : (
        <>
          <div className="hidden sm:block">
            <Navbar
              name={fullname as string}
              email={email as string}
              initials={initials}
              toggleSidebar={toggleSidebar}
              setApp={toggleApp}
              setProfile={toggleProfile}
              action={layoutState}
            />
          </div>

          <div className="block p-4 bg-background sm:hidden">
            <Button onClick={() => router.back()} variant={'ghost'} size="icon">
              <GoBackIcon />
            </Button>
          </div>
        </>
      )}

      <div className="flex items-stretch flex-1 w-full p-0 overflow-hidden sm:px-4 border-t-border">
        <Sidebar
          isExpanded={isExpanded}
          toggleSidebar={toggleSidebar}
          email={email}
          initials={initials}
        />
        <div
          className={cn('flex items-center w-full rounded-lg gap-4', className)}
        >
          {children}

          {layoutState.showApp && (
            <div
              className={cn(
                'w-full h-full overflow-auto bg-background max-w-[400px] [&::-webkit-scrollbar]:hidden rounded-none sm:rounded-lg transition-all duration-300 ease-in-out ',
                {
                  'hidden sm:block ': layoutState.showApp
                },
                { 'hidden ': !layoutState.showApp }
              )}
            >
              <AppsPage />
            </div>
          )}
          {layoutState.showProfile && (
            <div
              className={cn(
                'w-full h-full overflow-auto bg-background max-w-[400px] [&::-webkit-scrollbar]:hidden rounded-none sm:rounded-lg transition-all duration-300 ease-in-out ',
                {
                  'hidden sm:block ': layoutState.showProfile
                },
                { 'hidden ': !layoutState.showProfile }
              )}
            >
              <ProfilePage
                email={String(email)}
                fullname={fullname ?? ''}
                initials={initials}
                mailboxObjective={objective ?? ''}
                uniqueAddress={uniqueAddress ?? ''}
                bio={bio}
              />
            </div>
          )}
        </div>
      </div>
      <BottomNav threadCount={threads?.length} />
    </main>
    </SearchProvider>
  );
};
