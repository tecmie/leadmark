import { SettingsDocumentPage } from '@/components/pages/settings/document';
import { fetchGlobalDocuments } from '@/actions/server/resources';
import { getSession } from '@/actions/server/auth';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect(routes.signIn);
  }

  const { data: documents } = await fetchGlobalDocuments(session.user.id);

  return <SettingsDocumentPage documents={documents ?? []} />;
}
