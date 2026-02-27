import { assertSupabaseConfig, supabase } from '../lib/supabaseClient.js';

export async function listManagedUsers() {
  assertSupabaseConfig();
  return supabase.functions.invoke('admin-users', {
    body: { action: 'list' }
  });
}

export async function createManagedUser({ email, password, role = 'user' }) {
  assertSupabaseConfig();
  return supabase.functions.invoke('admin-users', {
    body: {
      action: 'create',
      payload: { email, password, role }
    }
  });
}

export async function deleteManagedUser(userId) {
  assertSupabaseConfig();
  return supabase.functions.invoke('admin-users', {
    body: {
      action: 'delete',
      payload: { userId }
    }
  });
}
