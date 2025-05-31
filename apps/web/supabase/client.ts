import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env.mjs";
import { Database } from "@repo/types/database";


export const createClient = () =>
  createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
