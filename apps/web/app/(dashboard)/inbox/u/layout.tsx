import { InboxOverviewPage } from "@/components/pages/inbox/overview";
import { fetchInboxThreads } from "@/actions/server/threads";
import { getOrAddToWaitlist, getUser } from "@/actions/server/auth";
import { routes } from "@/utils/routes";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  // const session = await getUser();

  // if (!session) {
  //   redirect(routes.SIGN_IN);
  // }

  const { data: threads } = await fetchInboxThreads();

  return (
    <div className="relative flex w-full h-full ">
      <div className="flex w-full h-full border-t border-[#00000012] overflow-auto sm:overflow-hidden">
        <div className="sm:block hidden max-w-[350px] w-full">
          <InboxOverviewPage data={threads ?? []} />
        </div>
        <div className="sm:border-l border-[#0000000A] pb-2 flex flex-col sm:justify-center justify-start items-center w-full sm:rounded-br-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
