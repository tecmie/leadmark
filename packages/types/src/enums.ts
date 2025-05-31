import { Database } from "./database.types.js";

export class ContextSpaceEnumDeclared {
  static readonly THREAD: Database['public']['Enums']['context_space'] = 'thread';
  static readonly GLOBAL: Database['public']['Enums']['context_space'] = 'global';
}

export class MessageOriginEnumDeclared {
  static readonly EMAIL: Database['public']['Enums']['message_origin'] = 'email';
  static readonly SMS: Database['public']['Enums']['message_origin'] = 'sms';
  static readonly TELEGRAM: Database['public']['Enums']['message_origin'] = 'telegram';
  static readonly LIVECHAT: Database['public']['Enums']['message_origin'] = 'livechat';
  static readonly CONTACT_FORM: Database['public']['Enums']['message_origin'] = 'contact_form';
}

export class MessageRoleEnumDeclared {
  static readonly ASSISTANT: Database['public']['Enums']['message_role'] = 'assistant';
  static readonly RECIPIENT: Database['public']['Enums']['message_role'] = 'recipient';
  static readonly USER: Database['public']['Enums']['message_role'] = 'user';
  static readonly AGENT: Database['public']['Enums']['message_role'] = 'agent';
}

export class MessageStatusEnumDeclared {
  static readonly COMPOSING: Database['public']['Enums']['message_status'] = 'composing';
  static readonly DRAFT: Database['public']['Enums']['message_status'] = 'draft';
  static readonly READY: Database['public']['Enums']['message_status'] = 'ready';
  static readonly SENDING: Database['public']['Enums']['message_status'] = 'sending';
  static readonly SENT: Database['public']['Enums']['message_status'] = 'sent';
  static readonly ERROR: Database['public']['Enums']['message_status'] = 'error';
}

export class PricingPlanIntervalEnumDeclared {
  static readonly DAY: Database['public']['Enums']['pricing_plan_interval'] = 'day';
  static readonly WEEK: Database['public']['Enums']['pricing_plan_interval'] = 'week';
  static readonly MONTH: Database['public']['Enums']['pricing_plan_interval'] = 'month';
  static readonly YEAR: Database['public']['Enums']['pricing_plan_interval'] = 'year';
}

export class PricingTypeEnumDeclared {
  static readonly ONE_TIME: Database['public']['Enums']['pricing_type'] = 'one_time';
  static readonly RECURRING: Database['public']['Enums']['pricing_type'] = 'recurring';
}

export class PrimaryContactEnumDeclared {
  static readonly EMAIL: Database['public']['Enums']['primary_contact'] = 'email';
  static readonly PHONE: Database['public']['Enums']['primary_contact'] = 'phone';
  static readonly USERNAME: Database['public']['Enums']['primary_contact'] = 'username';
}

export class ResourceStatusEnumDeclared {
  static readonly PENDING: Database['public']['Enums']['resource_status'] = 'pending';
  static readonly DONE: Database['public']['Enums']['resource_status'] = 'done';
  static readonly PROCESSING: Database['public']['Enums']['resource_status'] = 'processing';
  static readonly FAILED: Database['public']['Enums']['resource_status'] = 'failed';
}

export class ResourceTypeEnumDeclared {
  static readonly LINK: Database['public']['Enums']['resource_type'] = 'link';
  static readonly DOCUMENT: Database['public']['Enums']['resource_type'] = 'document';
  static readonly IMAGE: Database['public']['Enums']['resource_type'] = 'image';
}

export class SubscriptionStatusEnumDeclared {
  static readonly TRIALING: Database['public']['Enums']['subscription_status'] = 'trialing';
  static readonly ACTIVE: Database['public']['Enums']['subscription_status'] = 'active';
  static readonly CANCELED: Database['public']['Enums']['subscription_status'] = 'canceled';
  static readonly INCOMPLETE: Database['public']['Enums']['subscription_status'] = 'incomplete';
  static readonly INCOMPLETE_EXPIRED: Database['public']['Enums']['subscription_status'] = 'incomplete_expired';
  static readonly PAST_DUE: Database['public']['Enums']['subscription_status'] = 'past_due';
  static readonly UNPAID: Database['public']['Enums']['subscription_status'] = 'unpaid';
  static readonly PAUSED: Database['public']['Enums']['subscription_status'] = 'paused';
}

export class ThreadStatusEnumDeclared {
  static readonly OPEN: Database['public']['Enums']['thread_status'] = 'open';
  static readonly COMPOSING: Database['public']['Enums']['thread_status'] = 'composing';
  static readonly CLOSED: Database['public']['Enums']['thread_status'] = 'closed';
  static readonly ARCHIVED: Database['public']['Enums']['thread_status'] = 'archived';
  static readonly QUARANTINED: Database['public']['Enums']['thread_status'] = 'quarantined';
  static readonly SPAM: Database['public']['Enums']['thread_status'] = 'spam';
  static readonly TRASH: Database['public']['Enums']['thread_status'] = 'trash';
}

export class MailboxStatusEnumDeclared {
  static readonly ACTIVE: Database['public']['Enums']['mailbox_status'] = 'active';
  static readonly INACTIVE: Database['public']['Enums']['mailbox_status'] = 'inactive';
  static readonly QUARANTINED: Database['public']['Enums']['mailbox_status'] = 'quarantined';
  static readonly SUSPENDED: Database['public']['Enums']['mailbox_status'] = 'suspended';
}
