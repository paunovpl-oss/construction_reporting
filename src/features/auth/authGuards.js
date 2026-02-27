import { navigateTo } from '../../router/index.js';
import { hasSupabaseConfig, supabase } from '../../lib/supabaseClient.js';
import { getSession } from '../../services/authService.js';
import { isCurrentUserAdmin } from '../../services/rolesService.js';

const authPublicPaths = ['/', '/login', '/register'];

function isPublicPath(pathname) {
  return authPublicPaths.includes(pathname);
}

function isAdminPath(pathname) {
  return pathname.startsWith('/admin');
}

function isProtectedPath(pathname) {
  if (isPublicPath(pathname)) {
    return false;
  }

  return true;
}

let checkingGuard = false;

async function enforceGuards(pathname) {
  if (!hasSupabaseConfig || checkingGuard) {
    return;
  }

  checkingGuard = true;

  try {
    const { data, error } = await getSession();
    const session = !error ? data?.session : null;
    const signedIn = Boolean(session);

    if ((pathname === '/login' || pathname === '/register') && signedIn) {
      navigateTo('/dashboard');
      return;
    }

    if (isProtectedPath(pathname) && !signedIn) {
      navigateTo('/login');
      return;
    }

    if (isAdminPath(pathname) && signedIn) {
      const userId = session.user?.id;
      const adminCheck = await isCurrentUserAdmin(userId);
      const isAdmin = !adminCheck.error && Boolean(adminCheck.data);

      if (!isAdmin) {
        navigateTo('/dashboard');
      }
    }
  } finally {
    checkingGuard = false;
  }
}

export function initAuthGuards() {
  window.addEventListener('app:render', (event) => {
    const pathname = event.detail?.pathname || window.location.pathname;
    enforceGuards(pathname);
  });

  if (hasSupabaseConfig && supabase) {
    supabase.auth.onAuthStateChange(() => {
      enforceGuards(window.location.pathname);
    });
  }
}