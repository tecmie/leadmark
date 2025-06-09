import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import { routes } from '@/utils/routes';
import { getURL } from '@/utils/helpers';
import { createClient } from '@/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(getURL() + routes.ONBOARDING_GET_STARTED);
}
