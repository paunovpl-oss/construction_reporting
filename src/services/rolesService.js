import { assertSupabaseConfig, supabase } from '../lib/supabaseClient.js';

export async function isAdminInitialized() {
  assertSupabaseConfig();
  return supabase.rpc('is_admin_initialized');
}

export async function assignFirstAdmin() {
  assertSupabaseConfig();
  return supabase.rpc('assign_first_admin');
}

export async function isCurrentUserAdmin(userId) {
  assertSupabaseConfig();

  if (userId) {
    return supabase.rpc('is_admin_user', { target_user_id: userId });
  }

  return supabase.rpc('is_admin_user');
}
