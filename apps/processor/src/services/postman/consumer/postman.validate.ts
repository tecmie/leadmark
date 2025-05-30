import { Job } from 'bullmq';
import { findHeaderKeyValue } from '../header';
import { textFromHtml } from '~/services/resources/resources.utils'
import { EventConsumerMQ, PostmanEventMQName } from '../../../events';
import { InboundMessageDetails } from 'postmark/dist/client/models';
import { MailBox, MailboxBaseWithUserBase, IUser } from '@repo/types';
import { MailRecipients, handleMailSubject, prepareMailRecipients } from '../helpers';

export type PostmanValidateConsumerContext = {
  payload: InboundMessageDetails;
  mailbox: MailboxBaseWithUserBase;
};

export type PostmanValidateReturnValues = {
  owner: IUser;
  input: Omit<InboundMessageDetails, 'Attachments'>;
  mailbox: MailBox;
  subject: string;
  headers: any[];
  message: string;
  recipients: MailRecipients;
  attachments: InboundMessageDetails['Attachments'];
  mailboxWithOwner: MailboxBaseWithUserBase;
};

async function _extractNecessaryInfo(input: any): Promise<any> {
  /* ---- prepare email headers and subjects ----- */
  const subject = handleMailSubject(input.Subject);
  const recipients = prepareMailRecipients(input);

  /* --------- Important email headers to extract -------- */
  const headers = findHeaderKeyValue(input.Headers, ['Message-ID', 'In-Reply-To']);
  const messageText = input.TextBody === '' ? textFromHtml(input.HtmlBody) : input.TextBody;

  return { subject, recipients, headers, messageText };
}

function _parseOwner(mailbox: any): IUser {
  const owner = mailbox.owner;

  if (Array.isArray(owner)) {
    return owner[0];
  }

  return owner;
}

/**
 * @description Handle the callback for the postman validate consumer
 * @returns {PostmanValidateReturnValues}
 */
async function handleValidateCallback(
  job: Job<PostmanValidateConsumerContext, any, string>
): Promise<PostmanValidateReturnValues> {
  try {
    /**
     * @operation
     * Extract attachments and other message details
     */
    const { payload, mailbox: mailboxWithOwner } = job.data;
    const { Attachments, ...input } = payload;

    /**
     * @operation
     * Extract necessary message details
     */
    const { subject, recipients, headers, messageText } = await _extractNecessaryInfo(input);

    // Create a mailbox object without the owner information
    const mailbox: MailBox = Object.assign({}, mailboxWithOwner, { owner: undefined });

    /**
     * @operation
     * Parse the owner of the mailbox
     */
    const owner = _parseOwner(mailboxWithOwner);
    if (!owner) {
      // If owner not found, throw an error
      throw 'Owner not found';
    }

    return {
      owner: owner,
      input: input,
      mailbox: mailbox,
      subject: subject,
      headers: headers,
      message: messageText,
      recipients: recipients,
      attachments: Attachments,
      mailboxWithOwner: mailboxWithOwner,
    };
  } catch (error) {
    console.error(error, 'Error in postman.validate.ts [handleValidateCallback]');
    throw error;
  }
}

/* ====================== Handle the postman validate consumer here ================ */

export const postmanValidateConsumer = new EventConsumerMQ({
  autoRun: true,
  queueName: PostmanEventMQName.VALIDATE,
  callback: handleValidateCallback,
});

/* ====================== Handle the postman validate consumer here ================ */
