import { SettingsActionsPage } from '@/components/pages/settings/actions';
import { fetchForwarderTool, fetchPaymentInfo } from '@/actions/server/tools';
import { getSession } from '@/actions/server/auth';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect(routes.SIGN_IN);
  }
  const { data: payment } = await fetchPaymentInfo(session.user.id);
  const { data: forwarder } = await fetchForwarderTool(session.user.id);

  return (
    <SettingsActionsPage
      userId={session.user.id}
      paymentData={payment}
      forwarder={forwarder ?? ''}
    />
  );
}
