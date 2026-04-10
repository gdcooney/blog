/**
 * Server-only Supabase client.
 *
 * Uses the service-role key which bypasses Row Level Security.
 * NEVER expose this client to the browser or include it in public bundles.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in the environment.
 * Add it to .env for local dev; it is set in Vercel for production.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.PUBLIC_SUPABASE_URL ?? import.meta.env.SUPABASE_URL;
// Use || so an empty string (e.g. SUPABASE_SERVICE_ROLE_KEY= in .env)
// is treated the same as missing — prevents Supabase from throwing on
// an empty key.
const serviceRoleKey: string =
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!import.meta.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[supabase-server] SUPABASE_SERVICE_ROLE_KEY is not set. " +
      "Queries that require bypassing RLS (e.g. ms_sprints) will return no data. " +
      "Add the key to .env to fix this in local dev."
  );
}

export const supabaseServer = createClient(supabaseUrl, serviceRoleKey);
