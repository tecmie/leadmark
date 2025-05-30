import { supabase } from "~/services/supabase/client";
import { ForwardedMessageBase } from "@repo/types";
import { postmark } from "./postman.dispatch";
import { findHeaderKeyValue } from "../header";

const replaceLast = function (str: string, find: string, replace: string) {
  var index = str.lastIndexOf(find);

  if (index >= 0) {
    return (
      str.substring(0, index) + replace + str.substring(index + find.length)
    );
  }

  return str.toString();
};

function formatDateTime(): string {
  const currentDate = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    currentDate
  );

  // Add 'at' between the date and time
  return replaceLast(formattedDate, ",", " at");
}

export async function forwardMessageAPI(message: ForwardedMessageBase) {
  try {
    const messageDetails = await supabase
      .from("forwarded_messages")
      .select(
        "*, message:message_source(id, raw_metadata, owner_id, message_text, message_html, thread:thread_id(subject, mailbox:mailbox_id(unique_address, dotcom, full_name))) "
      )
      .eq("id", message.id)
      .single();

    if (messageDetails.error) {
      throw new Error(messageDetails.error.message);
    }

    const messageToForward: any = messageDetails.data!.message;
    const threadSubject: any = messageToForward.thread.subject;
    const mailbox: any = messageToForward.thread.mailbox;

    const forwarderEmailAddress = await supabase
      .from("tools")
      .select()
      .eq("owner_id", messageToForward.owner_id)
      .eq("name", "MAIL_FORWARDER_ACTION")
      .single()
      .throwOnError();

    const email = (forwarderEmailAddress.data?.credentials as any).forward_to;

    const headers = findHeaderKeyValue(
      JSON.parse(messageToForward.raw_metadata).headers,
      ["Message-ID", "In-Reply-To"]
    );

    const mailboxEmailWithName = `${mailbox.full_name} <${mailbox.unique_address}@${mailbox.dotcom}>`;

    const formattedDate = formatDateTime();
    /**
     * @operation
     * Send a response email to the recipient
     */
    await postmark.sendEmail({
      From: mailboxEmailWithName,
      Headers: headers,
      Subject: threadSubject,
      To: email,
      HtmlBody: `${
        message.message_text
      }\n\n\n---------- Forwarded message ---------\nFrom: ${mailboxEmailWithName}\nDate: ${formattedDate}\nSubject: ${threadSubject}\nTo: <${email}>\n\n\n${
        messageToForward.message_html ?? ""
      }`,
      TextBody: `${
        message.message_text
      }\n\n\n---------- Forwarded message ---------\nFrom:  ${mailboxEmailWithName}\nDate: ${formattedDate}\nSubject: ${threadSubject}\nTo: <${email}>\n\n\n${
        messageToForward.message_text ?? ""
      }`,
    });

    const { error } = await supabase
      .from("forwarded_messages")
      .update({ is_sent: true })
      .eq("id", message.id)
      .single();
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
