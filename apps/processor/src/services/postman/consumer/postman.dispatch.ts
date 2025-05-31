import showdown from "showdown";
import secrets from "../../../secrets";
const converter = new showdown.Converter();
import { simpleCompletion } from "../../resources/openai/simple";

/** @format */

import { Job } from "bullmq";
import { ServerClient } from "postmark";
import { insertMessage } from "~/services/supabase/base/message.base";
import { insertMessageAttachment } from "~/services/supabase/base/message-attachment.base";
import { MessageStream } from "../sender.interface";
import {
  IThread,
  IMailbox,
  IMessage,
  IContact,
  IMessageAttachment,
} from "@repo/types";
import {
  EventConsumerMQ,
  PostmanEventMQName,
  PostmanPreprocessReturnValues,
  PostmanValidateReturnValues,
} from "../../../events";
import { unlockThreadOperation } from "~/services/supabase/base/thread.base";
import { supabase } from "~/services/supabase/client";
import { _GPT4_ } from "~/constants";

// -------------------------------------------------------------------------------------- //
// ---------------------------- METHOD IMPLEMENTATIONS HERE----------------------------- //
// ------------------------------------------------------------------------------------ //
export const postmark = new ServerClient(secrets.POSTMARK_API_KEY);

export async function storeOutboundMessage({
  thread,
  mailbox,
  aiResponse,
  aiResponseToHtml,
  headers,
  recipients,
}: {
  thread: IThread;
  mailbox: IMailbox;
  aiResponse: string;
  aiResponseToHtml: string;
  headers: any;
  recipients: any;
}): Promise<IMessage | undefined> {
  return await insertMessage([
    {
      thread_id: thread?.id,
      is_ai_generated: true,
      direction: "outbound",
      html_content: aiResponseToHtml,
      content: aiResponse,
      postmark_data: {
        headers: headers,
        recipients: recipients,
        stream: MessageStream.OUTBOUND,
      },
    },
  ]);
}

export async function summarizeContext({
  context,
  messageText,
}: {
  context: string;
  messageText: string;
}) {
  return await simpleCompletion({
    name: "Context Summarizer",
    objective:
      "Summarize various sources of information into detailed, meaningful context based on another context or question.",
    text: `Summarize this information:
${context}

Based on this given question/context:
"${messageText}"`,
    attachmentContext: "",
    linksContext: "",
  });
}

async function getAttachmentContext({
  mailbox,
  attachmentResourceIds,
  messageText,
}: {
  mailbox: IMailbox;
  attachmentResourceIds: string[];
  messageText: string;
}): Promise<string> {
  if (attachmentResourceIds.length === 0) return "";

  const { data: resources } = await supabase
    .from("resources")
    .select("raw_content, name, raw_metadata")
    .in("id", attachmentResourceIds)
    .eq("owner_id", mailbox.owner_id);

  if (!resources || resources.length === 0) return "";

  const context = resources
    .map(
      (resource) => `File: ${resource.name}\nContent: ${resource.raw_content}`
    )
    .join("\n\n");

  return await summarizeContext({
    context,
    messageText,
  });
}

async function getMessageHistory({
  threadId,
  limit = 10,
}: {
  threadId: string;
  limit?: number;
}): Promise<string> {
  const { data: messages } = await supabase
    .from("messages")
    .select("direction, content, created_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (!messages || messages.length === 0) return "";

  return messages.map((msg) => `${msg.direction}: ${msg.content}`).join("\n\n");
}

export async function getAIResponse({
  thread,
  messageText,
  mailbox,
  contact,
  attachmentResourceIds,
  full_name,
}: {
  thread: IThread;
  messageText: string;
  mailbox: IMailbox;
  contact: IContact;
  attachmentResourceIds?: string[];
  full_name: string;
}) {
  const attachmentContext = attachmentResourceIds
    ? await getAttachmentContext({
        mailbox,
        attachmentResourceIds,
        messageText,
      })
    : "";

  const messageHistory = await getMessageHistory({
    threadId: thread.id.toString(),
  });

  const linksContext = [
    messageHistory && `Previous conversation:\n${messageHistory}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const senderName =
    contact?.first_name && contact?.last_name
      ? `${contact.first_name} ${contact.last_name}`
      : "User";

  // Check if we have parsed objectives
  const objectiveParsed = mailbox.processed_objective
    ? JSON.parse(mailbox.processed_objective)
    : null;

  const aiResponse = await simpleCompletion({
    name: senderName,
    objective:
      mailbox.raw_objective ||
      "You are an AI assistant responding via email. Always respond in markdown format.",
    objectiveParsed,
    text: messageText,
    attachmentContext,
    linksContext,
    full_name,
  });

  // Convert markdown response to HTML
  const aiResponseToHtml = converter.makeHtml(aiResponse);

  return { aiResponse, aiResponseToHtml };
}

async function _storeInboundMessage({
  thread,
  mailbox,
  input,
  messageText,
}: {
  thread: IThread;
  mailbox: IMailbox;
  input: PostmanValidateReturnValues["input"];
  messageText: string;
}): Promise<IMessage | undefined> {
  return await insertMessage([
    {
      thread_id: thread?.id,
      html_content: input.HtmlBody,
      content: messageText,
      direction: "inbound",
      subject: input.Subject,
      postmark_data: JSON.stringify({
        stream: input.MessageStream,
        attachments: [],
        headers: input.Headers,
        stripped_reply: input.StrippedTextReply,
      }),
    },
  ]);
}

async function _storeAttachmentReferences({
  message,
  resourceIds,
  thread,
}: {
  thread: IThread;
  message: IMessage;
  resourceIds: string[];
}): Promise<IMessageAttachment[] | undefined> {
  const resourceIdsSet = new Set(resourceIds);

  const dataToInsert: any[] = [];

  for (const resourceId of resourceIdsSet) {
    dataToInsert.push({
      message_id: message.id,
      resource_id: resourceId,
      thread_id: thread.id,
    });
  }

  return await insertMessageAttachment(dataToInsert);
}

// -------------------------------------------------------------------------------------- //
// ---------------------------- METHOD IMPLEMENTATIONS HERE----------------------------- //
// ------------------------------------------------------------------------------------ //

async function handleDispatchCallback(
  job: Job<any, any, string>
): Promise<any> {
  try {
    const childVals = await job.getChildrenValues();
    const [data] = Object.values(childVals) as [PostmanPreprocessReturnValues];

    const {
      input,
      mailbox,
      thread,
      contact,
      recipients,
      headers,
      subject,
      owner,
      attachmentResourceIds,
      message: messageText,
    } = data;

    /**
     * @operation
     * Store the inbound message in the thread
     */
    const insertInboundMessage = await _storeInboundMessage({
      thread,
      mailbox,
      input,
      messageText,
    });
    if (!insertInboundMessage) {
      // If an error occurs while inserting the inbound message, throw an error
      throw "Error inserting inbound message";
    }

    /**
     * @operation
     * Store the attachment references for the messages
     */
    if (attachmentResourceIds.length != 0) {
      const insertAttachmentReferences = await _storeAttachmentReferences({
        thread,
        message: insertInboundMessage,
        resourceIds: attachmentResourceIds,
      });

      if (!insertAttachmentReferences) {
        // If an error occurs while inserting the attachment references, throw an error
        throw "Error inserting message attachment references";
      }
    }

    /** 
    /* @todo TEMPORARY COMMENTING THIS TO AVOID STORIES THAT TOUCH
    // if (thread.status !== ThreadStatus.COMPOSING) {
    //   throw new Error('Thread is not in composing state');
    // }
    /* =============== Our Conversation operations now begin =============== */

    /**
     * @operation
     * Handle AI Response to the conversation
     */
    const { aiResponse, aiResponseToHtml } = await getAIResponse({
      thread,
      messageText,
      mailbox,
      contact,
      attachmentResourceIds,
      full_name: owner.full_name!,
    });

    console.log({
      From: `${owner.full_name} <${mailbox.unique_address}@${mailbox.dotcom}>`,
      Headers: headers,
      Subject: subject,
      To: input.FromFull.Email,
      HtmlBody: aiResponseToHtml,
      TextBody: aiResponse,
    });

    /**
     * @operation
     * Send a response email to the recipient
     */
    await postmark.sendEmail({
      From: `${owner.full_name} <${mailbox.unique_address}@${mailbox.dotcom}>`,
      Headers: headers,
      Subject: subject,
      To: input.FromFull.Email,
      HtmlBody: aiResponseToHtml,
      TextBody: aiResponse,
    });

    /**
     * @operation
     * Store the outbound message in the thread
     */
    const processMessages = await storeOutboundMessage({
      thread,
      mailbox,
      aiResponse,
      aiResponseToHtml,
      headers,
      recipients,
    });

    /**
     * @operation
     * Finally, unlock our thread and set status to open
     */
    const unlockedThread = await unlockThreadOperation(thread);

    return {
      subject,
      processMessages,
      thread: unlockedThread,
      ack: "<><><><><><><><><><><><><>< webhook completion for postman with event flow ><><><><><><><><><><><><><><><><<><><><>",
    };
  } catch (error) {
    console.error(
      error,
      "Error in postman.preprocess.ts [handlePreprocessCallback]"
    );
    throw error;
  }
}

/* ====================== Handle the postman dispatch consumer here ================ */

export const postmanDispatchConsumer = new EventConsumerMQ({
  autoRun: true,
  queueName: PostmanEventMQName.DISPATCH,
  callback: handleDispatchCallback,
});

/* ====================== Handle the postman dispatch consumer here ================ */
