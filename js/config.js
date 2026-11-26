// Supabase for Ultimate Season (the guess-the-career project). The publishable key is meant for the browser.
// Never put an sb_secret key here.
export const SUPABASE_URL = 'https://hnsldcynysirhrwahaif.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_xsvYAE4hmW_pq5H3OJGmgA_8lb954_P';

// Player search for answer dropdowns: a database function that returns player names from Guess the Career
// (see supabase/migrations/20261127000000_search_player_names.sql). Only names are exposed, not the rest of the table.
export const PLAYERS_SEARCH_RPC = 'search_player_names';
