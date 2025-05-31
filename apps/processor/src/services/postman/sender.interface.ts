/**
 * @typedef {string} StreamRegion
 * @description StreamRegion - The type of the stream ('inbound' or 'outbound')
 */

export enum MediumIntegrationName {
  /** @description Integration with Whatsapp */
  WHATSAPP = 'whatsapp',
  /** @description Integration with Postmark */
  POSTMARK = 'postmark',
  /** @description Integration with Twilio */
  TWILIO = 'twilio',
  /** @description Our CORE api */
  API = 'core_api',
}

export enum ThreadStatus {
  /** @description Open status */
  OPEN = 'open',
  /** @description Composing status - AI is writing */
  COMPOSING = 'composing',
  /** @description Closed status */
  CLOSED = 'closed',
  /** @description flagged or reported for violation */
  FLAGGED = 'flagged',
  /** @description Archived status */
  ARCHIVED = 'archived',
  /** @description Quarantined status */
  QUARANTINED = 'quarantined',
  /** @description Spam status */
  SPAM = 'spam',
  /** @description Trash status */
  TRASH = 'trash',
}

export enum ThreadPriority {
  LOW = 'low',
  HIGH = 'high',
  MEDIUM = 'medium',
}

export enum MessageStatus {
  /**
   * @description
   * The message has been resolved on the server, applies to inbound and outbound
   */
  RESOLVED = 'resolved',

  /** The message is in draft */
  DRAFTED = 'drafted',

  /** The AI message is ready */
  READY = 'ready',

  /** The message is flagged */
  FLAGGED = 'flagged',

  /** The message is deleted */
  DELETED = 'deleted',

  /** The message is processing for retrieval or outbox */
  ENQUEUE = 'enqueue',

  /** The message is pending reply */
  PENDING = 'pending',

  /** The message is failed delivery */
  FAILED = 'failed',
}

export enum MessengerRole {
  /** @description System role */
  SYSTEM = 'system',

  /** @description Our inbound Recipient role */
  RECIPIENT = 'recipient',

  /** @description Manager role */
  MANAGER = 'manager',

  /** @description Signed In User role */
  USER = 'user',

  /** @description AI Assistant role */
  ASSISTANT = 'assistant',
}

export enum MessageOrigin {
  EMAIL = 'email',
  CONTACT_FORM = 'contact_form',
}

/**
 * @typedef {string} MessageStream
 * @description MessageStream - The type of the stream ('inbound' or 'outbound')
 */
export enum MessageStream {
  /** @description Inbound stream */
  INBOUND = 'inbound',

  /** @description Outbound stream */
  OUTBOUND = 'outbound',
}
