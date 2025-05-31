// import { unlockThreadOperation } from '../../../supabase/base/thread.base';
// import { supabase } from '../../../supabase/client';
// import { IMessage } from '../../../supabase/declared-types';
// import { parseLinksOnReceivedMail } from '../../resources/handlers/parse-links-on-received-mail';
// import { getAIResponse, postmark, storeOutboundMessage } from './postman.dispatch';

// export async function contactFormReplyAPI(message: IMessage) {
//   const { data: messageData, error: messageError } = await supabase
//     .from('messages')
//     .select('owner:owner_id(*), thread:thread_id(*)')
//     .eq('id', message.id)
//     .single();

//   if (messageError) throw new Error(messageError.message);

//   const { owner, thread }: { owner: any; thread: any } = messageData;

//   const { data: threadData, error: threadDataError } = await supabase
//     .from('threads')
//     .select('mailbox:mailbox_id(*), contact:contact_id(*)')
//     .eq('id', thread.id)
//     .single();

//   if (threadDataError) throw new Error(threadDataError.message);

//   const { error } = await supabase.from('threads').update({ status: 'composing' }).eq('id', thread.id).single();

//   if (error) throw new Error(error.message);

//   const { mailbox, contact }: { mailbox: any; contact: any } = threadData;

//   const { similaritySearchResults } = await parseLinksOnReceivedMail({
//     mailbox,
//     owner,
//     content: message.message_text ?? '',
//     query: message.message_text ?? '',
//     supabase,
//   });

//   /**
//    * @operation
//    * Handle AI Response to the conversation
//    */
//   const { aiResponse, aiResponseToHtml } = await getAIResponse({
//     thread,
//     messageText: message.message_text ?? '',
//     mailbox,
//     contact,
//     similaritySearchResults,
//   });

//   const recipients = {
//     To: contact.email,
//     // Cc: thread.Cc ? thread.Cc : '',
//   };

//   console.log({ aiResponse, aiResponseToHtml, recipients });

//   await postmark.sendEmail({
//     From: `${mailbox.full_name} <${mailbox.unique_address}@${mailbox.dotcom}>`,
//     Headers: [],
//     Subject: thread.subject,
//     To: contact.email,
//     HtmlBody: aiResponseToHtml,
//     TextBody: aiResponse,
//   });

//   const processMessages = await storeOutboundMessage({
//     thread,
//     mailbox,
//     aiResponse,
//     aiResponseToHtml,
//     headers: [],
//     recipients,
//   });

//   // mark the inbound message as resolved
//   const { error: updateMessageError } = await supabase
//     .from('messages')
//     .update({ status: 'resolved' })
//     .eq('id', message.id)
//     .single();

//   if (updateMessageError) throw new Error(updateMessageError.message);

//   const unlockedThread = await unlockThreadOperation(thread);

//   console.log({
//     subject: thread.subject,
//     processMessages,
//     thread: unlockedThread,
//     ack: '<><><><><><><><><><><><><>< webhook completion for postman contact form with event flow ><><><><><><><><><><><><><><><><<><><><>',
//   });
//   return {
//     subject: thread.subject,
//     processMessages,
//     thread: unlockedThread,
//     ack: '<><><><><><><><><><><><><>< webhook completion for postman with event flow ><><><><><><><><><><><><><><><><<><><><>',
//   };
// }
