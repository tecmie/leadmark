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
export function prepareMailRecipients(
  replyToEmailWithDomain: string
): MailRecipients {
  const addresses: MailRecipients = {
    To: replyToEmailWithDomain,
    Cc: ''
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
export function handleMailSubject(
  prevSubject: string,
  action = 'reply'
): string {
  const prefix = action === 'reply' ? 'Re: ' : 'Fwd: ';

  if (!prevSubject.toLowerCase().startsWith(prefix.toLowerCase())) {
    return prefix + prevSubject;
  } else {
    return prevSubject;
  }
}

export function findHeaderKeyValue(array: any[], keys: string[]) {
  const output = [];
  const noUnderscoreHyphenKeys = keys.map((key) =>
    key.toLowerCase().replace(/[-_]/g, '')
  );

  for (const item of array) {
    const normalizedItemName = item.Name.toLowerCase().replace(/[-_]/g, '');
    if (noUnderscoreHyphenKeys.includes(normalizedItemName)) {
      output.push(item);
    }
  }

  return output;
}

export function extractNecessaryInfo(
  rawHeaders: any[],
  rawEmailWithDomain: string
) {
  /* ---- prepare email headers and subjects ----- */
  const recipients = prepareMailRecipients(rawEmailWithDomain);

  /* --------- Important email headers to extract -------- */
  const headers = findHeaderKeyValue(rawHeaders, ['Message-ID', 'In-Reply-To']);

  return { recipients, headers };
}
