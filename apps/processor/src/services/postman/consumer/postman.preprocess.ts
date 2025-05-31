import { Job } from "bullmq";
import {
  EventConsumerMQ,
  PostmanEventMQName,
  PostmanValidateReturnValues,
} from "../../../events";
import { IMailbox, IContact, IThread, IUser } from "@repo/types";
// import { parseLinksOnReceivedMail } from '../../resources/handlers/parse-links-on-received-mail';
import { MailRecipients } from "../helpers";
import { fromValueHash } from "~/services/crypto";
import { supabase } from "~/services/supabase/client";
import { contactOperation } from "~/services/supabase/base/contact.base";
import { threadOperation } from "~/services/supabase/base/thread.base";
import { handleAttachmentsOnReceivedMail } from "~/services/resources/handlers";

export type PostmanPreprocessReturnValues = {
  headers: any[];
  subject: string;
  message: string;
  input: PostmanValidateReturnValues["input"];
  recipients: MailRecipients;
  mailbox: IMailbox;
  owner: IUser;
  contact: IContact;
  thread: IThread;
  attachmentResourceIds: string[];
  similaritySearchResults: string;
};

/**
 * @function _fetchAndLockThread
 * @description Fetch and lock a conversation thread
 *
 * @returns {IThread | undefined}
 */
async function _fetchAndLockThread({
  input,
  mailbox,
  subject,
  contact,
}: {
  input: PostmanValidateReturnValues["input"];
  mailbox: IMailbox;
  subject: string;
  contact: IContact;
}): Promise<IThread | undefined> {
  const threadNamespace = fromValueHash(
    JSON.stringify({
      from: input.FromFull.Email,
      mailbox_id: mailbox?.id,
      subject: subject,
    })
  );

  const thread = await threadOperation({
    input,
    threadNamespace,
    mailbox: mailbox,
    contactId: contact?.id as number,
  });

  return thread ?? undefined;
}

/**
 * @callback handlePreprocessCallback
 *
 * @description Handle the callback for the postman preprocess consumer
 * @returns  {PostmanPreprocessReturnValues}
 */
async function handlePreprocessCallback(
  job: Job
): Promise<PostmanPreprocessReturnValues> {
  try {
    const childVals = await job.getChildrenValues();
    const [data] = Object.values(childVals) as [PostmanValidateReturnValues];

    const {
      input,
      mailbox,
      recipients,
      headers,
      message,
      attachments,
      owner,
      subject,
    } = data;

    /**
     * @operation
     * Create a contact using the message input and mailbox
     */
    const contact = await contactOperation({ input, mailbox });
    if (!contact) {
      // If an error occurs while creating the contact, throw an error
      throw "Error creating contact";
    }

    /**
     * @operation
     * Get or create a new thread for this email, then lock the conversation thread
     */
    const thread = await _fetchAndLockThread({
      input,
      mailbox,
      subject,
      contact,
    });
    if (!thread) {
      // If an error occurs while creating the thread, throw an error
      throw "Error creating thread";
    }

    console.log({
      thread,
      mailbox,
      contact,
      s: "inside ppmq.preprocess <<><><><><><><><><<>>><><><<><",
    });

    let attachmentQATool;
    let attachmentResourceIds: string[] = [];
    if (attachments.length != 0) {
      /**
       * @operation
       * Handle attachments, and return Chain Tool
       */
      const handleAttachmentResults = await handleAttachmentsOnReceivedMail({
        mailbox,
        owner,
        supabase,
        attachments,
      });

      console.log({
        handleAttachmentResults,
        s: "inside ppmq.preprocess <<><><><><><><><><<>>><><><<><",
      });

      if (!handleAttachmentResults) {
        // If an error occurs while handling attachments, handleAttactmentResults will be undefined
        throw "Error handling attachments";
      }
      const result = handleAttachmentResults;
      attachmentResourceIds = result.attachmentResourceIds;
    }

    /**
     * @operation
     * Parse links in the received email content
     */
    // const { similaritySearchResults } = await parseLinksOnReceivedMail({
    //   mailbox,
    //   owner,
    //   content: message,
    //   query: message,
    //   supabase,
    // });

    return {
      headers,
      input,
      subject,
      message,
      recipients,
      mailbox,
      owner,
      contact,
      thread,
      attachmentResourceIds,
      similaritySearchResults: "",
    };
  } catch (error) {
    console.error(
      error,
      "Error in postman.preprocess.ts [handlePreprocessCallback]"
    );
    throw error;
  }
}

/* ====================== Handle the postman preprocess consumer here ================ */

export const postmanPreprocessConsumer = new EventConsumerMQ({
  autoRun: true,
  queueName: PostmanEventMQName.PREPROCESS,
  callback: handlePreprocessCallback,
});

/* ====================== Handle the postman preprocess consumer here ================ */
