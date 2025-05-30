'use client';

import { Thread } from '@repo/types';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { createClient } from '@/supabase/client';
import { useEffect, useState } from 'react';

interface InboxOverviewPageProps {
  data: Thread[];
  className?: string;
}

export const InboxOverviewPage = ({
  data,
  className,
}: InboxOverviewPageProps) => {
  const supabase = createClient();

  const [inboxOverviewData, setInboxOverviewData] = useState<Thread[]>(data);

  useEffect(() => {
    const inboxOverviewChannel = supabase
      .channel('inboxOverviewDataFetch')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'threads' },
        (payload) => {
          setInboxOverviewData((prev) => [...prev, payload.new] as Thread[]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(inboxOverviewChannel);
    };
  }, []);

  return (
    <DataTable
      className={className}
      columns={columns}
      data={inboxOverviewData.sort((a: Thread, b: Thread) =>
        a.last_updated < b.last_updated ? 1 : -1
      )}
    />
  );
};
