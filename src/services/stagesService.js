import { assertSupabaseConfig, supabase } from '../lib/supabaseClient.js';

export async function listStages() {
  assertSupabaseConfig();
  return supabase
    .from('stages')
    .select('id,name,status,planned_start,planned_end,project_id,created_at,projects(name)')
    .order('created_at', { ascending: false });
}

export async function createStage(payload) {
  assertSupabaseConfig();
  return supabase
    .from('stages')
    .insert(payload)
    .select('id,name,status,planned_start,planned_end,project_id,created_at,projects(name)')
    .single();
}