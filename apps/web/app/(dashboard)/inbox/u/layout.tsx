import { InboxOverviewPage } from '@/components/pages/inbox/overview';
import { fetchInboxThreads } from '@/actions/server/threads';
import { getOrAddToWaitlist, getSession } from '@/actions/server/auth';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getSession();

  if (!session) {
    redirect(routes.signIn);
  }

  const wlist = await getOrAddToWaitlist(session.user.id);

  if (!wlist?.is_onboard) {
    redirect(routes.getStarted);
  }

  const { data: threads } = await fetchInboxThreads();

  return (
    <div className="relative flex w-full h-full ">
      <div className="flex w-full h-full sm:mt-[55.6px] border-t border-[#00000012] overflow-auto sm:overflow-hidden">
        <div className="sm:block hidden max-w-[350px] w-full">
          <InboxOverviewPage data={threads ?? []} />
        </div>
        <div className="sm:border-l border-[#0000000A] pb-2 flex flex-col sm:justify-center justify-start items-center w-full mb-14 bg-white sm:rounded-br-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
