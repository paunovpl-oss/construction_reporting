import { assertSupabaseConfig, supabase } from '../lib/supabaseClient.js';

export async function listProjects() {
  assertSupabaseConfig();
  return supabase
    .from('projects')
    .select('id,name,location,client,start_date,target_end_date,created_at')
    .order('created_at', { ascending: false });
}

export async function createProject(payload) {
  assertSupabaseConfig();
  return supabase
    .from('projects')
    .insert(payload)
    .select('id,name,location,client,start_date,target_end_date,created_at')
    .single();
}