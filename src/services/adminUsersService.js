import { assertSupabaseConfig, supabase } from '../lib/supabaseClient.js';
import { getSession } from './authService.js';

async function getAccessToken() {
  const { data, error } = await getSession();

  if (error || !data?.session?.access_token) {
    return null;
  }

  return data.session.access_token;
}

export async function listManagedUsers() {
  assertSupabaseConfig();

  const accessToken = await getAccessToken();

  return supabase.functions.invoke('admin-users', {
    body: { action: 'list', accessToken }
  });
}

export async function createManagedUser({ email, password, role = 'contractor' }) {
  assertSupabaseConfig();

  const accessToken = await getAccessToken();

  return supabase.functions.invoke('admin-users', {
    body: {
      action: 'create',
      accessToken,
      payload: { email, password, role }
    }
  });
}

export async function deleteManagedUser(userId) {
  assertSupabaseConfig();

  const accessToken = await getAccessToken();

  return supabase.functions.invoke('admin-users', {
    body: {
      action: 'delete',
      accessToken,
      payload: { userId }
    }
  });
}

export async function updateManagedUser({ userId, email, role, fullName, password }) {
  assertSupabaseConfig();

  const accessToken = await getAccessToken();

  return supabase.functions.invoke('admin-users', {
    body: {
      action: 'update',
      accessToken,
      payload: {
        userId,
        email,
        role,
        fullName,
        password
      }
    }
  });
}
