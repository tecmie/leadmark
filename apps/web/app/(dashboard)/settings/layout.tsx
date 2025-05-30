import { getSession } from '@/actions/server/auth';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getSession();

  if (!session) {
    return redirect(routes.signIn);
  }

  return (
    <div className="flex flex-col w-full h-full mx-auto overflow-auto bg-white rounded-none sm:rounded-lg pb-[100px]">
      {children}
    </div>
  );
}
