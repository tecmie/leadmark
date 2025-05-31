'use server';

import { createClient } from '@/supabase/server';
import {
  BackendResponse,
  IResource
} from '@repo/types';

type UploadResourceOptions = {
  userId: string;
  resources: {
    name: string;
    contextSpace: string;
    resourceUrl: string;
    resourceType: string;
    rawMetadata: any;
  }[];
};
import { fetchMailbox } from './mailbox';


export const fetchGlobalLinks = async (
  userId: string
): Promise<BackendResponse<IResource[]>> => {
  const supabase = await createClient();

  const mailboxId = (await fetchMailbox(userId)).data?.id;

  if (!mailboxId) throw new Error('Mailbox not found');

  const { data, error } = await supabase
    .from('resources')
    .select()
    .eq('mailbox_id', mailboxId)
    .eq('owner_id', userId)
    .eq('type', 'link');

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
): Promise<BackendResponse<IResource[]>> => {
  const supabase = await createClient();

  const mailboxId = (await fetchMailbox(userId)).data?.id;

  if (!mailboxId) throw new Error('Mailbox not found');

  const { data, error } = await supabase
    .from('resources')
    .select()
    .eq('mailbox_id', mailboxId)
    .eq('owner_id', userId)
    .neq('type', 'link');

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
): Promise<BackendResponse<IResource[]>> => {
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
  resourceId: string
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
}: UploadResourceOptions): Promise<BackendResponse<IResource[]>> => {
  const supabase = await createClient();

  const mailboxId = (await fetchMailbox(userId)).data?.id;

  const processedResources = resources.map((resource: any) => {
    // TODO: parse instruction here
    const instruction = '';

    return {
      name: resource.name,
      type: resource.resourceType,
      mailbox_id: mailboxId!,
      owner_id: userId,
      raw_metadata: resource.rawMetadata,
      file_path: resource.resourceUrl
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
