'use client';

import { IThread } from '@repo/types';

// Extended thread type that includes the additional properties returned by fetchInboxThreads
type EnhancedThread = IThread & {
  contactEmail: string;
  contactName: string;
  fullName: string;
  contact_metadata?: { [key: string]: string };
};
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { createClient } from '@/supabase/client';
import { useEffect, useState } from 'react';

interface InboxOverviewPageProps {
  data: EnhancedThread[];
  className?: string;
}

export const InboxOverviewPage = ({
  data,
  className,
}: InboxOverviewPageProps) => {
  const supabase = createClient();

  const [inboxOverviewData, setInboxOverviewData] = useState<EnhancedThread[]>(data);

  useEffect(() => {
    const inboxOverviewChannel = supabase
      .channel('inboxOverviewDataFetch')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'threads' },
        (payload) => {
          setInboxOverviewData((prev) => [...prev, payload.new] as EnhancedThread[]);
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
      data={inboxOverviewData.sort((a: EnhancedThread, b: EnhancedThread) =>
        (a.last_updated || '') < (b.last_updated || '') ? 1 : -1
      )}
    />
  );
};
