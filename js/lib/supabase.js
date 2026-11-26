// Saves a completed season to ultimate_season.runs if the player is signed in.
// Swap createClient for the shared sign-in module from the other disco.games games
// so the session is shared across subdomains the same way.
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config.js';

let client = null;
export function getClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !window.supabase) return null;
  client ||= window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

export async function saveRun(run) {
  const sb = getClient();
  if (!sb) return { status: 'off' };
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return { status: 'guest' };
  const { error } = await sb.schema('ultimate_season').from('runs').insert(run);
  return error ? { status: 'error', message: error.message } : { status: 'saved' };
}
