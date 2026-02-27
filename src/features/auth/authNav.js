import { hasSupabaseConfig, supabase } from '../../lib/supabaseClient.js';
import { isCurrentUserAdmin } from '../../services/rolesService.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderSignedOutNav() {
  return `
    <li class="nav-item">
      <a class="nav-link" href="/login" data-link>Login</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="/register" data-link>Register</a>
    </li>
  `;
}

function renderSignedInNav(userEmail, isAdmin) {
  const adminLink = isAdmin
    ? '<li class="nav-item"><a class="nav-link" href="/admin" data-link>Admin</a></li>'
    : '';

  return `
    ${adminLink}
    <li class="nav-item d-flex align-items-center me-2">
      <span class="badge text-bg-light border">${escapeHtml(userEmail)}</span>
    </li>
    <li class="nav-item">
      <button class="btn btn-outline-secondary btn-sm" type="button" data-auth-action="logout">
        Logout
      </button>
    </li>
  `;
}

function renderUnconfiguredNav() {
  return `
    <li class="nav-item d-flex align-items-center">
      <span class="badge text-bg-warning">Auth not configured</span>
    </li>
  `;
}

async function updateAuthNav() {
  const navElement = document.querySelector('[data-auth-nav]');

  if (!navElement) {
    return;
  }

  if (!hasSupabaseConfig || !supabase) {
    navElement.innerHTML = renderUnconfiguredNav();
    return;
  }

  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    navElement.innerHTML = renderSignedOutNav();
    return;
  }

  const email = data.session.user?.email || 'Signed user';
  const userId = data.session.user?.id;
  const adminResult = await isCurrentUserAdmin(userId);
  const isAdmin = !adminResult.error && Boolean(adminResult.data);
  navElement.innerHTML = renderSignedInNav(email, isAdmin);
}

export function initAuthNav() {
  window.addEventListener('app:render', () => {
    updateAuthNav();
  });

  if (hasSupabaseConfig && supabase) {
    supabase.auth.onAuthStateChange(() => {
      updateAuthNav();
    });
  }

  updateAuthNav();
}