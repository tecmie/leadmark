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
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user?.user?.id) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    // // Fetch contacts with aggregated thread and message data
    // const { data, error } = await supabase
    //   .from("contacts")
    //   .select(`
    //     id,
    //     email,
    //     first_name,
    //     last_name,
    //     created_at,
    //     threads(
    //       id,
    //       last_updated,
    //       messages!fk_threads_last_message_id(
    //         id,
    //         content,
    //         created_at
    //       )
    //     )
    //   `)
    //   .eq("threads.owner_id", user.user.id);

    const { data, error } = await supabase
      .from("threads")
      .select(
        `
        id,
        owner_id,
        last_updated,
        messages!fk_threads_last_message_id(
          id,
          content,
          created_at
        ),
        contact:contacts!inner(id, email, first_name, last_name, created_at)
      `
      )
      .eq("owner_id", user.user.id)
      .order("last_updated", { ascending: false });

    console.log("Fetched contacts:", data);

    if (error || !data) {
      console.error("Error fetching contacts:", error);
      return {
        success: false,
        message: error.message,
      };
    }

    // Process the data to calculate statistics
    // Group threads by contact and calculate stats
    const contactsMap = new Map<string, Contact>();

    data?.forEach((thread) => {
      const contact = thread.contact;
      const contactId = contact.id.toString();

      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          id: contactId,
          email: contact.email!,
          first_name: contact.first_name,
          last_name: contact.last_name,
          created_at: contact.created_at ?? new Date().toISOString(),
          thread_count: 0,
          message_count: 0,
        });
      }

      const contactData = contactsMap.get(contactId)!;
      contactData.thread_count += 1;

      // Update last_contacted if this thread is more recent
      if (
        !contactData.last_contacted ||
        (thread.last_updated || new Date().toISOString()) >
          contactData.last_contacted
      ) {
        contactData.last_contacted =
          thread.last_updated || new Date().toISOString();
      }

      // Count messages and get latest message
      if (thread.messages) {
        contactData.message_count += 1;

        if (
          thread.messages.content &&
          (!contactData.latest_message ||
            new Date(
              thread.messages.created_at || new Date().toISOString()
            ).getTime() > new Date(contactData.last_contacted || 0).getTime())
        ) {
          contactData.latest_message =
            thread.messages.content.substring(0, 100) +
            (thread.messages.content.length > 100 ? "..." : "");
        }
      }
    });

    const contactsWithStats = Array.from(contactsMap.values());

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
