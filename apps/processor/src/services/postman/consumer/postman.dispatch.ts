const showdown = require('showdown');
import secrets from '../../../secrets';
const converter = new showdown.Converter();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
});

const openai = new OpenAIApi(configuration);

/** @format */

import { Job } from 'bullmq';
import { ServerClient } from 'postmark';
import { simpleCompletion } from '../../openai/simple';
import { insertMessage } from '../../../supabase/base/message.base';
import { insertMessageAttachment } from '../../../supabase/base/message-attachment.base';
import { MessengerRole, MessageStatus, MessageOrigin, MessageStream, ThreadStatus } from '../sender.interface';
import {
  ThreadBase,
  MailboxBase,
  MessageBase,
  ContactBase,
  MessageAttachmentBase,
} from '../../../supabase/declared-types';
import {
  EventConsumerMQ,
  PostmanEventMQName,
  PostmanPreprocessReturnValues,
  PostmanValidateReturnValues,
} from '../../../events';
import { unlockThreadOperation } from '../../../supabase/base/thread.base';
import * as Sentry from '@sentry/node';
import { getOrCreateDBWorkspace } from '../../../db/vectordb/utils';
import { fetchFormattedContext } from '../../../db/vectordb';
import { _GPT4_MODEL_11_PREVIEW } from '../../../constants';

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
  thread: ThreadBase;
  mailbox: MailboxBase;
  aiResponse: string;
  aiResponseToHtml: string;
  headers: any;
  recipients: any;
}): Promise<MessageBase | undefined> {
  return await insertMessage([
    {
      thread_id: thread?.id,
      role: MessengerRole.ASSISTANT,
      status: MessageStatus.RESOLVED,
      message_html: aiResponseToHtml,
      message_text: aiResponse,
      attachments: [],
      origin: MessageOrigin.EMAIL as 'email',
      owner_id: mailbox.owner_id as string,
      raw_metadata: JSON.stringify({
        headers: headers,
        recipients: recipients,
        stream: MessageStream.OUTBOUND,
      }),
    },
  ]);
}

export async function summarizeContext({ context, messageText }: { context: string; messageText: string }) {
  const chatCompletion = await openai.createChatCompletion({
    model: _GPT4_MODEL_11_PREVIEW,
    messages: [
      {
        role: 'system',
        content:
          'You are a Jabob, helpful assistant that helps to summarise various sources of information in to a detailed meaning full context based on another context or question the I will give you',
      },
      {
        role: 'user',
        content: `
      Summarise these information
      ${context}

      Based on this given question/context from me:
     "${messageText}"
      `,
      },
    ],
  });

  return chatCompletion.data.choices[0].message.content;
}

async function getAttachmentContext({
  mailbox,
  attachmentResourceIds,
  messageText,
}: {
  mailbox: MailboxBase;
  attachmentResourceIds: number[];
  messageText: string;
}): Promise<string> {
  const path = getOrCreateDBWorkspace({ ownerId: mailbox.owner_id });
  const namespace = `${path}_${mailbox.unique_address}_${mailbox.id}`;

  const context = await fetchFormattedContext({
    owner_id: mailbox.owner_id,
    namespace,
    query: messageText,
    filterIds: attachmentResourceIds,
  });

  return await summarizeContext({
    context,
    messageText,
  });
}

export async function getAIResponse({
  thread,
  messageText,
  mailbox,
  contact,
  attachmentResourceIds,
  similaritySearchResults,
}: {
  thread: ThreadBase;
  messageText: string;
  mailbox: MailboxBase;
  contact: ContactBase;
  attachmentResourceIds?: number[];
  similaritySearchResults?: any;
}) {
  const attachmentContext = attachmentResourceIds
    ? await getAttachmentContext({
        mailbox,
        attachmentResourceIds,
        messageText,
      })
    : '';

  const linksContext = similaritySearchResults
    ? await summarizeContext({
        context: similaritySearchResults,
        messageText,
      })
    : '';

  const config: any = mailbox.config;
  const memoryDbName = config.collectionName ?? 'pilot';

  const memoryCollectionName = `${mailbox.owner_id}_${thread.namespace}`;

  const aiResponse = await simpleCompletion({
    text: messageText,
    name: `${contact?.first_name} ${contact?.last_name}`,
    objectiveParsed: mailbox.objective_parsed,
    objective: mailbox.objective_raw as string,
    attachmentContext,
    linksContext,
    memoryDbName,
    memoryCollectionName,
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
  thread: ThreadBase;
  mailbox: MailboxBase;
  input: PostmanValidateReturnValues['input'];
  messageText: string;
}): Promise<MessageBase | undefined> {
  return await insertMessage([
    {
      thread_id: thread?.id,
      role: MessengerRole.RECIPIENT,
      status: MessageStatus.RESOLVED,
      message_html: input.HtmlBody,
      message_text: messageText,
      origin: MessageOrigin.EMAIL,
      attachments: [],
      owner_id: mailbox.owner_id,
      raw_metadata: JSON.stringify({
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
  thread: ThreadBase;
  message: MessageBase;
  resourceIds: number[];
}): Promise<MessageAttachmentBase[] | undefined> {
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

async function handleDispatchCallback(job: Job<any, any, string>): Promise<any> {
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
      attachmentResourceIds,
      similaritySearchResults,
      message: messageText,
    } = data;

    /**
     * @operation
     * Store the inbound message in the thread
     */
    const insertInboundMessage = await _storeInboundMessage({ thread, mailbox, input, messageText });
    if (!insertInboundMessage) {
      // If an error occurs while inserting the inbound message, throw an error
      throw 'Error inserting inbound message';
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
        throw 'Error inserting message attachment references';
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
    const { aiResponse, aiResponseToHtml } =
      mailbox.unique_address == 'workforce'
        ? await getAIResponse({
            thread,
            messageText,
            mailbox,
            contact,
            attachmentResourceIds,
            similaritySearchResults,
          })
        : await getAIResponse({
            thread,
            messageText,
            mailbox,
            contact,
            attachmentResourceIds,
            similaritySearchResults,
          });

    /**
     * @operation
     * Send a response email to the recipient
     */
    await postmark.sendEmail({
      From: `${mailbox.full_name} <${mailbox.unique_address}@${mailbox.dotcom}>`,
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
      ack: '<><><><><><><><><><><><><>< webhook completion for postman with event flow ><><><><><><><><><><><><><><><><<><><><>',
    };
  } catch (error) {
    Sentry.captureException(error);
    console.error(error, 'Error in postman.preprocess.ts [handlePreprocessCallback]');
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
