/**
 * @operation
 * Get or create a new thread for this email
 */

import {
  ThreadPriority,
  ThreadStatus,
} from "~/services/postman/sender.interface";
import { supabase } from "../client";
import { IThread } from "@repo/types";
import { ThreadOperationData } from "~/interfaces/postman.interface";

export async function threadOperation({
  threadNamespace,
  input,
  mailbox,
  contactId,
}: ThreadOperationData) {
  try {
    const { data: thread } = await supabase
      .from("threads")
      .select("*")
      .eq("namespace", threadNamespace)
      .single()
      .throwOnError(); // Throw an error if no thread is found

    if (thread!.status === ThreadStatus.OPEN) {
      return await lockThreadOperation(thread!);
    }

    return thread;
  } catch (error: any) {
    console.error("An unexpected error occurred in getOrCreateThread:", error);

    try {
      if (error.details.includes("The result contains 0 rows")) {
        console.log("creating new thread");

        const { data: newThread } = await supabase
          .from("threads")
          .insert({
            namespace: threadNamespace,
            slug: threadNamespace,
            subject: input.Subject,
            status: ThreadStatus.COMPOSING,
            priority: ThreadPriority.MEDIUM,
            owner_id: mailbox.owner_id,
            mailbox_id: mailbox.id,
            contact_id: contactId,
          })
          .select("*")
          .single()
          .throwOnError();
        return newThread;
      }
    } catch (error) {
      console.error(error, "Error creating new thread");
      throw error;
    }
    throw new Error(error);
  }
}

export async function unlockThreadOperation(thread: IThread) {
  try {
    const { data, error } = await supabase
      .from("threads")
      .update({ status: ThreadStatus.OPEN })
      .eq("id", thread.id)
      .eq("status", ThreadStatus.COMPOSING)
      .eq("namespace", thread.namespace)
      .eq("owner_id", thread?.owner_id)
      .select();

    if (error) {
      console.error(error, "Error unlocking thread");
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      "An unexpected error occurred in unlockThreadOperation:",
      error
    );
  }
}

export async function lockThreadOperation(thread: IThread) {
  try {
    const { data, error } = await supabase
      .from("threads")
      .update({ status: ThreadStatus.COMPOSING })
      .eq("id", thread.id)
      .eq("status", ThreadStatus.OPEN)
      .eq("namespace", thread.namespace)
      .eq("owner_id", thread?.owner_id)
      .select()
      .single()
      .throwOnError();
    if (error) {
      console.error(error, "Error locking thread");
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      "An unexpected error occurred in lockThreadOperation:",
      error
    );
  }
}
