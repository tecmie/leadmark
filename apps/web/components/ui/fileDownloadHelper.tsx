'use client';

import { parseStorageUrl } from "@/actions/server/storage";
import { IResource } from '@repo/types';
import { createClient } from '@/supabase/client';

export const fileDownloadHelper = async (resource: IResource) => {
  const supabase = createClient();

  console.log('resource', resource)

  const { bucket, link } = await  parseStorageUrl(
    (resource.raw_metadata as any).fullUrl
  );

  const { data, error } = await supabase.storage.from(bucket).download(link);

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  return {
    success: true,
    message: 'File downloaded',
    data
  };
};
