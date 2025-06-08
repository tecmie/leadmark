import { supabase } from '../client';
import { InsertMessageBase, IMessage } from '@repo/types';

export async function insertMessage(message: InsertMessageBase[]): Promise<IMessage | undefined> {
  const { data, error } = await supabase.from('messages').insert(message).select('*').single().throwOnError();

  if (error) {
    console.error(error);
    return undefined;
  }

  return data;
}
