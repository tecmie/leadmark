import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import { getURL } from '@/utils/helpers';
import { routes } from '@/utils/routes';
import { createClient } from '@/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(getURL() + routes.RESET_PASSWORD);
}
