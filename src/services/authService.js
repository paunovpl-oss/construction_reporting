import { assertSupabaseConfig, supabase } from '../lib/supabaseClient.js';

export async function signInWithPassword({ email, password }) {
  assertSupabaseConfig();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword({ email, password, fullName }) {
  assertSupabaseConfig();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });
}

export async function signOut() {
  assertSupabaseConfig();
  return supabase.auth.signOut();
}

export async function getSession() {
  assertSupabaseConfig();
  return supabase.auth.getSession();
}

export async function getCurrentUser() {
  assertSupabaseConfig();
  return supabase.auth.getUser();
}