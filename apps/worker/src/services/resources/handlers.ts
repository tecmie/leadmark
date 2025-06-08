import { IMailbox, IResource, IUser } from "@repo/types";
import { Database } from "@repo/types/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { Attachment } from "postmark";

export type HandleAttachmentsOnReceivedMailOptions = {
  mailbox: IMailbox;
  owner: IUser;
  supabase: SupabaseClient<Database>;
  attachments: Attachment[];
};

enum ResourceType {
  link,
  document,
  image,
}

/**
 *  Handle attachments on received mail
 *  
 * @param mailbox The mailbox to insert the links into.
 * @param owner The owner of the mailbox.
 * @param supabase The supabase client, preferably with an auth header Eg. supabaseWithAuthHeader('user-access-token'), for RLS purposes.
 * @param attachments The attachments to handle.
 * @param model The language model to use.

 * 
 * @returns {ChainTool}
 * @returns {number[]} The resource ids of the inserted resources.
 * 
 * @throws {Error} If there is an error.
 * 
 */
export async function handleAttachmentsOnReceivedMail({
  mailbox,
  owner,
  supabase,
  attachments,
}: HandleAttachmentsOnReceivedMailOptions): Promise<
  { attachmentResourceIds: string[] } | undefined
> {
  if (attachments.length === 0) {
    console.log("No attachments found.");
    return undefined;
  }

  let resources: IResource[] = [];

  for (const [index, attachment] of attachments.entries()) {
    // push attachment to storage
    /* Requires Supabase secret key, or user token with RLS permissions */
    const { data, error } = await supabase.storage
      .from(`leadmark/attachments/${owner.id}`)
      .upload(attachment.Name, attachment.Content, {
        contentType: attachment.ContentType,
        upsert: true,
      });

    if (error) {
      console.error(error);
      throw error;
    }

    console.log({ data, error });

    const decodedBuffer = Buffer.from(attachment.Content, "base64");
    const fileName = attachment.Name;
    const fileSize = new Blob([decodedBuffer], { type: attachment.ContentType })
      .size;

    // const attDoc = await handleAttachmentByMimeType({
    //   mimeType: attachment.ContentType,
    //   decodedBuffer,
    //   metadata,
    // });

    const dataToInsert = {
      name: fileName,
      type: ResourceType.document.toString(),
      file_path: data.path,
      mailbox_id: mailbox.id,
      owner_id: owner.id,
      raw_content: "email content",
      raw_metadata: {
        sizeInBytes: fileSize,
        fullUrl: `storage://leadmark/${data.path}`,
      },
    };

    const { data: resource, error: insertError } = await supabase
      .from("resources")
      .insert(dataToInsert)
      .select("*")
      .single();
    if (insertError) {
      console.error(insertError);
      throw insertError;
    }

    resources.push(resource);
  }

  const attachmentResourceIds = [...new Set(resources.map((item) => item.id))];

  return { attachmentResourceIds };
}
