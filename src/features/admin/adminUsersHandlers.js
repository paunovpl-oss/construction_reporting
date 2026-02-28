import { createManagedUser, deleteManagedUser, listManagedUsers } from '../../services/adminUsersService.js';
import { getCurrentUser, getSession } from '../../services/authService.js';
import { navigateTo } from '../../router/index.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setMessage(element, message, variant = 'secondary') {
  if (!element) {
    return;
  }

  element.className = `alert alert-${variant} mb-4`;
  element.textContent = message;
}

async function ensureAuthenticatedSession(messageElement) {
  const sessionResult = await getSession();
  const session = !sessionResult.error ? sessionResult.data?.session : null;

  if (session) {
    return true;
  }

  setMessage(messageElement, 'Your session has expired. Please sign in again.', 'warning');
  navigateTo('/login');
  return false;
}

function resolveEdgeFunctionError(error) {
  const genericMessage = error?.message || 'Request failed.';

  if (genericMessage.includes('non-2xx')) {
    return 'Action failed. Ensure you are logged in as admin, then try again.';
  }

  return genericMessage;
}

function renderUsersRows(rowsElement, users, currentUserId) {
  if (!rowsElement) {
    return;
  }

  if (!users.length) {
    rowsElement.innerHTML = '<tr><td colspan="4" class="text-secondary">No users available.</td></tr>';
    return;
  }

  rowsElement.innerHTML = users
    .map((user) => {
      const isCurrent = user.id === currentUserId;
      const deleteButton = isCurrent
        ? '<span class="badge text-bg-secondary">Current user</span>'
        : `<button class="btn btn-sm btn-outline-danger" type="button" data-admin-delete-user="${escapeHtml(user.id)}">Delete</button>`;

      return `
        <tr>
          <td>${escapeHtml(user.email || '—')}</td>
          <td>${escapeHtml(user.role || 'contractor')}</td>
          <td>${escapeHtml((user.created_at || '').slice(0, 10) || '—')}</td>
          <td class="text-end">${deleteButton}</td>
        </tr>
      `;
    })
    .join('');
}

async function reloadAdminUsers() {
  const rowsElement = document.querySelector('[data-admin-users-rows]');
  const messageElement = document.querySelector('[data-admin-users-message]');

  if (!rowsElement || !messageElement) {
    return;
  }

  const hasSession = await ensureAuthenticatedSession(messageElement);
  if (!hasSession) {
    rowsElement.innerHTML = '<tr><td colspan="4" class="text-warning">Please sign in to manage users.</td></tr>';
    return;
  }

  const [{ data: currentUserData }, listResult] = await Promise.all([getCurrentUser(), listManagedUsers()]);

  if (listResult.error) {
    setMessage(messageElement, resolveEdgeFunctionError(listResult.error), 'danger');
    rowsElement.innerHTML = '<tr><td colspan="4" class="text-danger">Unable to load users.</td></tr>';
    return;
  }

  const users = listResult.data?.users || [];
  const currentUserId = currentUserData?.user?.id || null;

  renderUsersRows(rowsElement, users, currentUserId);
  setMessage(messageElement, `Loaded ${users.length} users.`, 'success');
}

async function handleCreateUser(form) {
  const messageElement = document.querySelector('[data-admin-users-message]');
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const role = String(formData.get('role') || 'contractor');

  if (!email || !password) {
    setMessage(messageElement, 'Email and password are required.', 'warning');
    return;
  }

  submitButton.disabled = true;
  setMessage(messageElement, 'Creating user...', 'secondary');

  const hasSession = await ensureAuthenticatedSession(messageElement);
  if (!hasSession) {
    submitButton.disabled = false;
    return;
  }

  const result = await createManagedUser({ email, password, role });
  if (result.error) {
    setMessage(messageElement, resolveEdgeFunctionError(result.error), 'danger');
    submitButton.disabled = false;
    return;
  }

  form.reset();
  setMessage(messageElement, 'User created successfully.', 'success');
  await reloadAdminUsers();
  submitButton.disabled = false;
}

async function handleDeleteUser(userId) {
  const messageElement = document.querySelector('[data-admin-users-message]');

  const hasSession = await ensureAuthenticatedSession(messageElement);
  if (!hasSession) {
    return;
  }

  setMessage(messageElement, 'Deleting user...', 'secondary');
  const result = await deleteManagedUser(userId);

  if (result.error) {
    setMessage(messageElement, resolveEdgeFunctionError(result.error), 'danger');
    return;
  }

  setMessage(messageElement, 'User deleted successfully.', 'success');
  await reloadAdminUsers();
}

export function initAdminUsersHandlers() {
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.matches('[data-admin-user-form]')) {
      return;
    }

    event.preventDefault();
    handleCreateUser(form);
  });

  document.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('[data-admin-delete-user]');
    if (!deleteButton) {
      return;
    }

    event.preventDefault();
    handleDeleteUser(deleteButton.getAttribute('data-admin-delete-user'));
  });

  window.addEventListener('app:render', (event) => {
    if (event.detail?.pathname === '/admin') {
      reloadAdminUsers();
    }
  });
}
