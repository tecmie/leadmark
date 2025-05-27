'use server';

import { createClient } from '@/supabase/server';
import {
  BackendResponse,
  Resource,
  UploadResourceOptions
} from '@repo/types';
import { fetchMailbox } from './mailbox';


export const fetchGlobalLinks = async (
  userId: string
): Promise<BackendResponse<Resource[]>> => {
  const supabase = await createClient();

  const mailboxId = (await fetchMailbox(userId)).data?.id;

  if (!mailboxId) throw new Error('Mailbox not found');

  const { data, error } = await supabase
    .from('resources')
    .select()
    .eq('mailbox_id', mailboxId)
    .eq('owner_id', userId)
    .eq('source_type', 'link')
    .eq('context_space', 'global');

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  return {
    success: true,
    message: 'Links fetched successfully',
    data: data.map((resource) => resource)
  };
};

export const fetchGlobalDocuments = async (
  userId: string
): Promise<BackendResponse<Resource[]>> => {
  const supabase = await createClient();

  const mailboxId = (await fetchMailbox(userId)).data?.id;

  if (!mailboxId) throw new Error('Mailbox not found');

  const { data, error } = await supabase
    .from('resources')
    .select()
    .eq('mailbox_id', mailboxId)
    .eq('owner_id', userId)
    .neq('source_type', 'link')
    .eq('context_space', 'global');

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  return {
    success: true,
    message: 'Resources fetched successfully',
    data: data.map((resource) => resource)
  };
};

export const fetchResources = async (
  userId: string
): Promise<BackendResponse<Resource[]>> => {
    const supabase = await createClient();
  
  const mailboxId = (await fetchMailbox(userId)).data?.id;

  if (!mailboxId) throw new Error('Mailbox not found');

  const { data, error } = await supabase
    .from('resources')
    .select()
    .eq('mailbox_id', mailboxId)
    .eq('owner_id', userId);

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  return {
    success: true,
    message: 'Resources fetched successfully',
    data: data.map((resource) => resource)
  };
};

export const deleteResource = async (
  resourceId: number
): Promise<BackendResponse<boolean>> => {
  const supabase = await createClient();

  const { error } = await supabase.from('resources').delete().eq('id', resourceId);

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  return {
    success: true,
    message: 'Resource deleted successfully'
  };
};

export const uploadResources = async ({
  userId,
  resources
}: UploadResourceOptions): Promise<BackendResponse<Resource[]>> => {
  const supabase = await createClient();

  const mailboxId = (await fetchMailbox(userId)).data?.id;

  const processedResources = resources.map((resource) => {
    // TODO: parse instruction here
    const instruction = '';

    return {
      name: resource.name,
      context_space: resource.contextSpace,
      source_url: resource.resourceUrl,
      source_type: resource.resourceType,
      instructions: instruction,
      mailbox_id: mailboxId,
      status: 'pending' as const,
      owner_id: userId,
      raw_metadata: resource.rawMetadata
    };
  });

  const { data, error } = await supabase
    .from('resources')
    .insert(processedResources)
    .select();

  if (error || !data) {
    return {
      success: false,
      message: error.message
    };
  }

  return {
    success: true,
    message: 'Resource uploaded successfully',
    data: data
  };
};
