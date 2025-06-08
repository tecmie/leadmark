import secrets from '~/secrets';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@repo/types/database';

/**
 * @exports supabase
 * Create and export the Service Role Client
 * This has full access and permissions to the Supabase Database
 */
export const supabase = createClient<Database>(secrets.SUPABASE_URL, secrets.SUPABASE_KEY);

/**
 * @exports supabaseWithAuthHeader
 * Create and export the User Role Client
 * This has limited access and permissions to the Supabase Database
 *
 * @param userAccessToken
 * @returns
 */
export const supabaseWithAuthHeader = (userAccessToken: string) =>
  createClient<Database>(secrets.SUPABASE_URL, secrets.SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${userAccessToken}` } },
  });
