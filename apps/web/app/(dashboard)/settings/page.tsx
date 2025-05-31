/* eslint-disable @typescript-eslint/no-unused-vars */
import { CaretRightIcon, CreditIcon } from '@/components/icons/sidebar';
import { fetchMailbox } from '@/actions/server/mailbox';
import { getUser } from '@/actions/server/auth';
import { routes } from '@/utils/routes';
import { cn } from '@/utils/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ActionsIcon,
  DeleteIcon,
  DocumentIcon,
  LinkIcon,
} from '../../../components/icons/sidebar';

export default async function Page() {
  const session = await getUser();

  if (!session) {
    return redirect(routes.SIGN_IN);
  }

  const SETTINGS_ROUTE = [
    {
      icon: LinkIcon,
      href: routes.SETTINGS_LINKS,
      label: 'Links',
    },
    {
      icon: DocumentIcon,
      href: routes.SETTINGS_DOCUMENTS,
      label: 'Documents',
    },

    {
      icon: ActionsIcon,
      href: routes.SETTINGS_ACTIONS,
      label: 'Actions',
    },
    {
      icon: CreditIcon,
      href: routes.BILLING,
      label: 'Billing',
    },
    {
      icon: DeleteIcon,
      href: '#',
      label: 'Delete account',
    },
  ];

  const { data: mailbox } = await fetchMailbox(session.user.id);

  return (
    <div className="flex flex-col w-full h-full gap-3 py-6 max-w-screen">
      <div className="flex flex-col gap-1 px-6 border-b border-[#0000000A] pb-4">
        <h3 className="text-xl font-bold text-black sm:text-2xl ">
          Settings
        </h3>
      </div>
      {/* <SettingsSlot>{children}</SettingsSlot> */}
      <div className="flex flex-col">
        {SETTINGS_ROUTE.map((route, index) => (
          <Link
            key={index}
            href={route.href}
            className={cn(
              'px-6 py-4 rounded-none flex items-center justify-between border-b border-[#0000000A] gap-3 font-medium  text-[#000000A3]'
            )}
          >
            <div className="flex items-center justify-center gap-3">
              <route.icon
                className={cn(' text-[#000000A3]')}
              />

              <span>{route.label}</span>
            </div>
            <CaretRightIcon
              className={cn(' text-[#000000A3] ')}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
