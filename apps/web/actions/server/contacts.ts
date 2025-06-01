"use server";

import { createClient } from "@/supabase/server";
import { BackendResponse } from "@repo/types";

interface Contact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  last_contacted?: string;
  message_count: number;
  latest_message?: string;
  thread_count: number;
}

export const fetchContacts = async (): Promise<BackendResponse<Contact[]>> => {
  const supabase = createClient();
  const { data: user } = await (await supabase).auth.getUser();
  
  if (!user?.user?.id) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    // Fetch contacts with aggregated thread and message data
    const { data, error } = await (await supabase)
      .from("contacts")
      .select(`
        id,
        email,
        first_name,
        last_name,
        created_at,
        threads(
          id,
          last_updated,
          messages!fk_threads_last_message_id(
            id,
            content,
            created_at
          )
        )
      `)
      .eq("threads.owner_id", user.user.id);

    if (error) {
      console.error("Error fetching contacts:", error);
      return {
        success: false,
        message: error.message,
      };
    }

    // Process the data to calculate statistics
    const contactsWithStats = data?.map((contact: any) => {
      const threads = contact.threads || [];
      const allMessages = threads.flatMap((thread: any) => thread.messages || []);
      
      return {
        id: contact.id,
        email: contact.email,
        first_name: contact.first_name,
        last_name: contact.last_name,
        created_at: contact.created_at,
        thread_count: threads.length,
        message_count: allMessages.length,
        last_contacted: threads.length > 0 
          ? threads.reduce((latest: string, thread: any) => 
              thread.last_updated > latest ? thread.last_updated : latest, 
              threads[0].last_updated
            )
          : undefined,
        latest_message: allMessages.length > 0
          ? allMessages
              .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
              ?.content?.substring(0, 100) + (allMessages[0]?.message_text?.length > 100 ? '...' : '')
          : undefined,
      };
    }) || [];

    return {
      success: true,
      message: "Contacts fetched successfully",
      data: contactsWithStats,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch contacts",
    };
  }
};