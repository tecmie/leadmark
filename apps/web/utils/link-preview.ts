'use server';

/**
 * {
 *  domain: string
 *  success: bool
 *  title: string
 *  description?: string
 *  image?: string
 *  ogUrl?: string
 *  type?: string
 *  sitename?: string
 *  message?: string
 * }
 * */

export interface LinkPreviewData {
  success: boolean;
  domain?: string;
  title?: string;
  description?: string;
  image?: string;
  ogUrl?: string;
  type?: string;
  sitename?: string;
  message?: string;
}

export async function getLinkPreviewData(url: string) {
  try {
    const res = await fetch(`https://getlinkpreview.onrender.com/?url=${url}`);

    const data: LinkPreviewData = await res.json();

    if (data.success) {
      return { status: 200, data };
    } else {
      return { status: 400, error: data.message };
    }
  } catch (err: any) {
    if (err.response?.data?.message) {
      return { status: 400, error: err.response.data.message };
    } else {
      return { status: 400, error: 'Something went wrong' };
    }
  }
}
