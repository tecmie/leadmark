import { SettingsLinkPage } from '@/components/pages/settings/link';
import { fetchGlobalLinks } from '@/actions/server/resources';
import { getUser } from '@/actions/server/auth';
import { routes } from '@/utils/routes';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getUser();
  if (!session) {
    redirect(routes.SIGN_IN);
  }

  const { data } = await fetchGlobalLinks(session.user.id);

  const links = data?.map((resource) => resource.file_path ?? '') ?? [''];

  return <SettingsLinkPage links={links.length ? links : ['']} />;
}
