import { InboundMessage, InboundMessageDetails } from 'postmark/dist/client/models/messages/InboundMessage';

export interface MailRecipients {
  /**
   * The primary recipients of the email.
   * @type {string}
   * @memberof MailRecipients
   */
  To: string;

  /**
   * Recipients we copy ('CC') in our response email.
   * @type {string}
   * @memberof MailRecipients
   */
  Cc: string;

  /**
   * The blind carbon copy recipients of the email.
   * @type {string}
   * @memberof MailRecipients
   */
  Bcc?: string;
}

/**
 * @name prepareMailRecipients
 * @param {Email} email - The email object.
 * @returns {MailRecipients} - The receiver addresses.
 *
 * @example
 *
 * let prepareMailRecipientsAddresses = prepareMailRecipients(email);
 * console.log(prepareMailRecipientsAddresses);
 */
export function prepareMailRecipients(thread: Partial<InboundMessage>): MailRecipients {
  const addresses: MailRecipients = {
    To: thread.FromFull?.Email as string,
    Cc: thread.Cc ? thread.Cc : '',
    // Bcc: email.Bcc ? email.Bcc : '', // Bcc should not be included in the reply
  };

  return addresses;
}

/**
 * @name handleMailSubject
 * @param {string} prevSubject - The previous email's subject.
 * @param {string} action - The action to be performed ('reply' or 'forward').
 * @returns {string} - The updated subject.
 *
 * @example
 *
 * let action = 'reply'; // or 'forward'
 * let newSubject = handleMailSubject(previousEmail.Subject, action);
 * console.log(newSubject);
 */
export function handleMailSubject(prevSubject: string, action = 'reply'): string {
  const prefix = action === 'reply' ? 'Re: ' : 'Fwd: ';

  if (!prevSubject.toLowerCase().startsWith(prefix.toLowerCase())) {
    return prefix + prevSubject;
  } else {
    return prevSubject;
  }
}

/**
 * @name createEmailThread
 * @param {Email} prevEmail - The previous email object.
 * @param {string} newContent - The new content to be added to the email thread.
 * @returns {string} - The updated email thread.
 *
 * @example
 *
 * let newContent = "New message to be added to the thread.";
 * let newThread = createEmailThread(previousEmail, newContent);
 * console.log(newThread);
 */
export function createEmailThread(
  prevEmail: Partial<InboundMessage & InboundMessageDetails>,
  newContent: string
): string {
  const prevContent = prevEmail.TextBody;
  const prevEmailDate = prevEmail.Date;
  const prevEmailFrom = prevEmail.From;

  const newEmailThread = '\n\nOn ' + prevEmailDate + ' ' + prevEmailFrom + ' wrote:\n\n> ' + prevContent;

  return newContent + newEmailThread;
}
