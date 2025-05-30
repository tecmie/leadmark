import { ThreadInbox } from '@/components/pages/inbox/thread';
import { fetchInboxThreads } from '@/actions/server/threads';

export default async function Page() {
  const { data: threads, success } = await fetchInboxThreads();
  if (!success) {
    return <div>Error fetching threads</div>;
  }
  return <ThreadInbox threads={threads || []} />;
}
