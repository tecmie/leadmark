import { supabase } from '../client';
import { InsertMessageAttachmentBase, IMessageAttachment } from '@repo/types';

export async function insertMessageAttachment(message: InsertMessageAttachmentBase[]): Promise<IMessageAttachment[] | undefined> {
  const { data, error } = await supabase.from('message_attachments').insert(message).select('*');

  if (error) {
    console.error(error);
    return undefined;
  }

  return data;
}
