'use server';

import {
  BackendResponse,
  DeleteFileResourceOptions,
  DownloadFileResourceOptions,
  Resource,
  UploadFileResourceOptions,
} from '@repo/types';
import { createClient } from '@/supabase/server';
import { uniqueFilename } from '@/utils/unique-filename';
import { deleteResource, uploadResources } from './resources';

export async function uploadFileResource({
  form,
  bucket,
  userId,
  upsert = false
}: UploadFileResourceOptions): Promise<BackendResponse<Resource>> {
  const file = form.get('fileUpload') as File;
  const supabase = await createClient();
  const filename = uniqueFilename({ filename: file.name });
  const { data: storageData, error: storageError } = await supabase.storage
    .from(bucket)
    .upload(`resources/${userId}/${filename}`, file, { upsert });

  if (storageError) {
    console.log(storageError);
    return {
      success: false,
      message: 'Error uploading file'
    };
  }

  const { success, message, data } = await uploadResources({
    userId,
    resources: [
      {
        contextSpace: 'global',
        name: filename,
        resourceType: 'document',
        resourceUrl: filename,
        rawMetadata: {
          sizeInBytes: file.size,
          fullUrl: `storage://${bucket}/${storageData.path}`
        }
      }
    ]
  });

  if (!success) {
    return {
      success: false,
      message
    };
  }

  return {
    success: true,
    message: 'File uploaded successfully',
    data: data![0]
  };
}

// export async function fetchFileResources({
//   bucket,
//   userId
// }: FetchFileResourceOptions): Promise<BackendResponse<FileResource[]>> {
//   const supabase = createServerSupabaseClient();
//   const { data, error } = await supabase.storage
//     .from(bucket)
//     .list(`resources/${userId}`, {
//       sortBy: { column: 'created_at', order: 'desc' }
//     });

//   if (error) {
//     return {
//       success: false,
//       message: error.message
//     };
//   }

//   return {
//     success: true,
//     message: 'Files fetched successfully',
//     data: data.map((o) => ({ name: o.name, size: o.metadata.size }))
//   };
// }

export async function downloadFileResource({
  bucket,
  filename,
  userId
}: DownloadFileResourceOptions): Promise<BackendResponse<Blob>> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(`resources/${userId}/${filename}`);

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
}

export async function parseStorageUrl(url: string): Promise<{
  protocol: string;
  bucket: string;
  link: string;
}> {
  const match = url.match(/^([a-z]+):\/\/([^\/]+)\/(.+)$/);

  if (match) {
    const [, protocol, bucket, link] = match as [string, string, string, string];
    return { protocol, bucket, link };
  } else {
    throw new Error('Invalid storage URL format');
  }
}

export async function deleteFileResource({
  resource
}: DeleteFileResourceOptions): Promise<BackendResponse<any>> {
  const supabase = await createClient();

  const { bucket, link } = await parseStorageUrl(
    (resource.raw_metadata as any).fullUrl
  );
  const files = [link];

  const { error } = await supabase.storage.from(bucket).remove(files);

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  return await deleteResource(resource.id);
}
