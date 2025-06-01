'use client';

import { IThread } from '@repo/types';

// Extended thread type that includes the additional properties returned by fetchInboxThreads
type EnhancedThread = IThread & {
  contactEmail: string;
  contactName: string;
  fullName: string;
  contact_metadata?: { [key: string]: string };
  hasNewMessages?: boolean;
};
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { createClient } from '@/supabase/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchInboxThreads } from '@/actions/server/threads';

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
  const [newThreadIds, setNewThreadIds] = useState<Set<string>>(new Set());

  const refreshThreadData = async () => {
    try {
      const result = await fetchInboxThreads();
      if (result.success && result.data) {
        setInboxOverviewData(result.data);
      }
    } catch (error) {
      console.error('Error refreshing thread data:', error);
    }
  };

  useEffect(() => {
    // Subscribe to thread changes (new threads)
    const threadsChannel = supabase
      .channel('inboxThreads')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'threads' },
        async (payload) => {
          console.log('New thread received:', payload);
          
          // Get the current user to filter
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || payload.new.owner_id !== user.id) return;
          
          try {
            // Fetch the new thread with proper joins to get contact info
            const { data: newThreadData, error } = await supabase
              .from("threads")
              .select(
                "*, contacts(email, first_name, last_name), message:last_message_id(*), owner:owner_id(*)"
              )
              .eq("id", payload.new.id)
              .single();
            
            if (!error && newThreadData) {
              const enhancedThread = {
                ...newThreadData,
                contactEmail: newThreadData.contacts?.email ?? "",
                contactName: `${newThreadData.contacts?.first_name ?? ""} ${newThreadData.contacts?.last_name ?? ""}`.trim(),
                fullName: newThreadData.owner?.full_name ?? "",
                hasNewMessages: true,
              };
              
              // Add to the beginning of the list
              setInboxOverviewData(prev => [enhancedThread, ...prev]);
              
              // Mark as new thread
              setNewThreadIds(prev => new Set([...prev, payload.new.id]));
              
              // Show notification
              toast.success('New email thread received!', {
                description: `From: ${enhancedThread.contactName || enhancedThread.contactEmail || 'Unknown'}`,
              });
            } else {
              // Fallback to refresh if direct fetch fails
              await refreshThreadData();
              setNewThreadIds(prev => new Set([...prev, payload.new.id]));
            }
          } catch (error) {
            console.error('Error fetching new thread:', error);
            // Fallback to refresh
            await refreshThreadData();
            setNewThreadIds(prev => new Set([...prev, payload.new.id]));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'threads' },
        async (payload) => {
          console.log('Thread updated:', payload);
          
          // Get the current user to filter
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || payload.new.owner_id !== user.id) return;
          
          // Update the specific thread in the list
          setInboxOverviewData(prev => 
            prev.map(thread => 
              thread.id === payload.new.id 
                ? { 
                    ...thread, 
                    ...payload.new,
                    hasNewMessages: payload.new.last_updated !== payload.old.last_updated ? true : thread.hasNewMessages
                  } 
                : thread
            )
          );
          
          // Mark as having new messages if last_updated changed
          if (payload.new.last_updated !== payload.old.last_updated) {
            setNewThreadIds(prev => new Set([...prev, payload.new.id]));
            
            toast.info('Thread updated', {
              description: `${payload.new.subject || 'Thread'} has new activity`,
            });
          }
        }
      )
      .subscribe();

    // Subscribe to message changes (new messages in existing threads)
    const messagesChannel = supabase
      .channel('inboxMessages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Get the current user to filter
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          // Check if this message belongs to user's thread
          const threadExists = inboxOverviewData.find(thread => thread.id === payload.new.thread_id && thread.owner_id === user.id);
          if (!threadExists) return;
          
          // Update the thread's last_updated time and mark as having new messages
          setInboxOverviewData(prev => 
            prev.map(thread => 
              thread.id === payload.new.thread_id 
                ? { 
                    ...thread, 
                    last_updated: payload.new.created_at,
                    hasNewMessages: true
                  } 
                : thread
            )
          );
          
          // Mark thread as having new messages
          if (payload.new.thread_id) {
            setNewThreadIds(prev => new Set([...prev, payload.new.thread_id]));
            
            // Show notification
            toast.success('New message received!', {
              description: payload.new.direction === 'inbound' 
                ? 'You have a new incoming message' 
                : 'Message sent successfully',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(threadsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [supabase]);

  // Remove new thread indicator after a delay
  useEffect(() => {
    if (newThreadIds.size > 0) {
      const timer = setTimeout(() => {
        setNewThreadIds(new Set());
      }, 10000); // Remove indicators after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [newThreadIds]);

  // Add new message indicators to thread data
  const dataWithIndicators = inboxOverviewData.map(thread => ({
    ...thread,
    hasNewMessages: newThreadIds.has(thread.id),
  }));

  return (
    <DataTable
      className={className}
      columns={columns}
      data={dataWithIndicators.sort((a: EnhancedThread, b: EnhancedThread) =>
        (a.last_updated || '') < (b.last_updated || '') ? 1 : -1
      )}
    />
  );
};
