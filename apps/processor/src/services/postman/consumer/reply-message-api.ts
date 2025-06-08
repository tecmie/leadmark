// import { supabase } from '~/services/supabase/client';
// import { IMessage } from '@repo/types';
// import { postmark } from './postman.dispatch';

// export async function replyMessageAPI(message: IMessage) {
//   try {
//     const { data: messageData, error: messageError } = await supabase
//       .from('messages')
//       .select('owner:owner_id(*), thread:thread_id(*, mailbox:mailbox_id(*))')
//       .eq('id', message.id)
//       .single();

//     if (messageError) throw new Error(messageError.message);

//     const thread: any = messageData.thread;
//     const mailbox: any = thread.mailbox;

//     const messageMetadata: any = message.raw_metadata;
//     const headers = messageMetadata.headers;
//     const recipients = messageMetadata.recipients;

//     /**
//      * @operation
//      * Send a response email to the recipient
//      */
//     await postmark.sendEmail({
//       From: `${mailbox.full_name} <${mailbox.unique_address}@${mailbox.dotcom}>`,
//       Headers: headers,
//       Subject: thread.subject,
//       To: recipients.To,
//       HtmlBody: message.message_html ?? '',
//       TextBody: message.message_text ?? '',
//     });

//     const { error } = await supabase.from('messages').update({ status: 'resolved' }).eq('id', message.id).single();
//     if (error) throw new Error(error.message);
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }
