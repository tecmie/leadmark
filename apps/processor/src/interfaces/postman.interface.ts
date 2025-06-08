import { InboundMessageDetails } from 'postmark/dist/client/models';
import { IMailbox } from '@repo/types';

export type PostmanResponse = {
  message: string;
};
export type PostmanInput = Omit<InboundMessageDetails, 'Attachments'>;
export type ThreadOperationData = {
  threadNamespace: string;
  input: PostmanInput;
  mailbox: IMailbox;
  contactId: number;
};
