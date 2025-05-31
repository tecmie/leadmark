'use server';


import { createClient } from '@/supabase/server';
import {
  BackendResponse,
  IMailbox
} from '@repo/types';

type UpsertMailboxOptions = {
  userId: string;
  fullname?: string;
  objective: string;
  uniqueAddress: string;
  bio?: string;
};
// import { api } from '@/trpc/server';
// import { isReservedAddress } from '../utils/blacklisted-email';
// import { splitEmailAddress } from '../utils/email';


export const fetchMailbox = async (
  userId: string
): Promise<BackendResponse<IMailbox>> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mailboxes')
    .select()
    .eq('owner_id', userId)
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? 'Mailbox not found'
    };
  }

  return {
    success: true,
    message: 'Mailbox information fetched successfully',
    data: data
  };
};

export const setupMailbox = async ({
  userId,
  fullname,
  objective,
  uniqueAddress,
  bio
}: UpsertMailboxOptions): Promise<BackendResponse> => {
  const supabase = await createClient();

  // Update user profile with fullname if provided
  if (fullname) {
    await supabase
      .from('profiles')
      .update({ full_name: fullname })
      .eq('id', userId);
  }

  const { data, error } = await supabase
    .from('mailboxes')
    .insert({
      unique_address: uniqueAddress.toLowerCase(),
      owner_id: userId,
      raw_objective: objective
    })
    .select('id')
    .single();

  if (error) {
    return {
      success: false,
      message:
        error.code == '23505'
          ? 'This email address is unavailable. Try another.'
          : error.message
    };
  }

  const result = await parseObjective({
    objective,
    mailboxId: data.id,
    mailboxName: (fullname
      ? fullname.split(' ')[0]
      : uniqueAddress?.toLowerCase()) || 'mailbox',
    successMessage: 'Mailbox created successfully'
  });

  if (!result.success) {
    await supabase.from('mailboxes').delete().eq('id', data.id);
  }

  return result;
};

//parse mailbox objective
const parseObjective = async ({
  objective,
  mailboxId,
  mailboxName,
  successMessage = 'Objectives parsed successfully'
}: {
  objective: string;
  mailboxId: number;
  mailboxName: string;
  successMessage?: string;
}): Promise<BackendResponse> => {

  try {
    // await api.mailbox.create.mutate({
    //   objective: objective,
    //   mailboxId: mailboxId,
    //   mailboxName: mailboxName
    // });

    return {
      success: true,
      message: successMessage
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: 'Error parsing objectives'
    };
  }
};

// update mailbox
export const updateMailbox = async ({
  userId,
  fullname,
  objective,
  uniqueAddress,
  bio
}: UpsertMailboxOptions): Promise<BackendResponse<void>> => {
  const supabase = await createClient();

  // Fetch existing data from the database
  const existingData = await fetchMailbox(userId);

  // Update user profile with fullname if provided
  if (fullname) {
    await supabase
      .from('profiles')
      .update({ full_name: fullname })
      .eq('id', userId);
  }

  // Check if the objective has changed
  const objectiveChanged = existingData?.data?.raw_objective !== objective;

  const { data, error } = await supabase
    .from('mailboxes')
    .update({
      raw_objective: objective
    })
    .eq('owner_id', userId)
    .select('id')
    .single();

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  // Call parseObjective only if the objective has changed
  if (objectiveChanged) {
    return await parseObjective({
      objective,
      mailboxId: data.id,
      mailboxName: (fullname
        ? fullname.split(' ')[0]
        : uniqueAddress?.toLowerCase()) || 'mailbox',
      successMessage: 'Mailbox updated successfully'
    });
  }
  return {
    success: true,
    message: 'Mailbox updated successfully'
  };
};
