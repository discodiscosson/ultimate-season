// Sparar en genomspelad säsong i ultimate_season.runs om spelaren är inloggad.
// Byt gärna ut createClient-anropet mot er gemensamma inloggningsmodul från de andra disco.games-spelen,
// så att sessionen delas mellan subdomänerna på samma sätt.
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config.js';

let client = null;
function getClient() {
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
