import { InboundMessageDetails } from 'postmark/dist/client/models';
import { MailBox } from '@repo/types';

export type PostmanResponse = {
  message: string;
};
export type PostmanInput = Omit<InboundMessageDetails, 'Attachments'>;
export type ThreadOperationData = {
  threadNamespace: string;
  input: PostmanInput;
  mailbox: MailBox;
  contactId: number;
};
