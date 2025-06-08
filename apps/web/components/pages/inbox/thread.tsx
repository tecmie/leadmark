'use client';

import { IThread } from '@repo/types';
import { usePathname } from 'next/navigation';
import { InboxOverviewPage } from './overview';

// Extended thread type that includes the additional properties returned by fetchInboxThreads
type EnhancedThread = IThread & {
  contactEmail: string;
  contactName: string;
  fullName: string;
  contact_metadata?: { [key: string]: string };
};

interface ThreadsLayoutProps {
  threads: EnhancedThread[];
}

export const ThreadInbox = ({ threads }: ThreadsLayoutProps) => {
  const pathname = usePathname();
  const isHome = pathname === '/inbox/u';
  return (
    <div className="flex justify-center w-full ">
      {isHome ? (
        <div className="lg:max-w-[350px] w-full flex sm:hidden flex-shrink-0">
          <InboxOverviewPage data={threads ?? []} className="" />
        </div>
      ) : null}
      <div className="flex-col items-center justify-center hidden w-full sm:flex sm:border-l border-border">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M72.5 30C72.5 28.6739 71.9732 27.4021 71.0355 26.4645C70.0979 25.5268 68.8261 25 67.5 25H57.5V15C57.5 13.6739 56.9732 12.4021 56.0355 11.4645C55.0979 10.5268 53.8261 10 52.5 10H12.5C11.1739 10 9.90215 10.5268 8.96447 11.4645C8.02678 12.4021 7.5 13.6739 7.5 15V55C7.50147 55.4703 7.63558 55.9307 7.88694 56.3283C8.1383 56.7258 8.49671 57.0444 8.92098 57.2474C9.34526 57.4504 9.81819 57.5296 10.2855 57.4758C10.7527 57.4221 11.1953 57.2377 11.5625 56.9437L22.5 48.125V57.5C22.5 58.8261 23.0268 60.0979 23.9645 61.0355C24.9021 61.9732 26.1739 62.5 27.5 62.5H56.7469L68.4375 71.9437C68.8799 72.3016 69.431 72.4978 70 72.5C70.663 72.5 71.2989 72.2366 71.7678 71.7678C72.2366 71.2989 72.5 70.663 72.5 70V30ZM59.2031 58.0563C58.7608 57.6984 58.2096 57.5022 57.6406 57.5H27.5V47.5H52.5C53.8261 47.5 55.0979 46.9732 56.0355 46.0355C56.9732 45.0979 57.5 43.8261 57.5 42.5V30H67.5V64.7656L59.2031 58.0563Z"
            fill="currentColor"
          />
        </svg>

        <div className="text-center ">
          <span className="text-lg font-bold text-foreground">
            No conversation selected
          </span>
          <p className="text-muted-foreground">Select a conversation to read</p>
        </div>
      </div>
    </div>
  );
};
