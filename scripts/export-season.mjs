// Hämtar en säsong från Supabase och skriver den som statisk JSON som spelet läser.
// Användning: SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/export-season.mjs ucl-2025-26
import { createClient } from '@supabase/supabase-js';
import { writeFile } from 'node:fs/promises';

const id = process.argv[2];
if (!id) { console.error('Ange säsongens id, t.ex. ucl-2025-26'); process.exit(1); }
const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) { console.error('Sätt SUPABASE_URL och SUPABASE_ANON_KEY'); process.exit(1); }

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const { data, error } = await sb.schema('ultimate_season').rpc('season_json', { p_season: id });
if (error) { console.error(error.message); process.exit(1); }
if (!data) { console.error(`Hittade ingen säsong med id ${id}`); process.exit(1); }
await writeFile(`data/seasons/${id}.json`, JSON.stringify(data, null, 1) + '\n');
console.log(`Skrev data/seasons/${id}.json`);
