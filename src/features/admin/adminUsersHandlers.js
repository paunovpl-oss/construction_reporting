import { createManagedUser, deleteManagedUser, listManagedUsers, updateManagedUser } from '../../services/adminUsersService.js';
import { getCurrentUser, getSession } from '../../services/authService.js';
import { navigateTo } from '../../router/index.js';

const cachedUsersById = new Map();

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
    rowsElement.innerHTML = '<tr><td colspan="5" class="text-secondary">No users available.</td></tr>';
    return;
  }

  cachedUsersById.clear();
  for (const user of users) {
    cachedUsersById.set(user.id, user);
  }

  rowsElement.innerHTML = users
    .map((user) => {
      const isCurrent = user.id === currentUserId;
      const actionButtons = isCurrent
        ? '<span class="badge text-bg-secondary">Current user</span>'
        : `
            <button class="btn btn-sm btn-outline-primary" type="button" data-admin-edit-user="${escapeHtml(user.id)}">Edit</button>
            <button class="btn btn-sm btn-outline-danger" type="button" data-admin-delete-user="${escapeHtml(user.id)}">Delete</button>
          `;

      return `
        <tr>
          <td>${escapeHtml(user.full_name || '—')}</td>
          <td>${escapeHtml(user.email || '—')}</td>
          <td>${escapeHtml(user.role || 'contractor')}</td>
          <td>${escapeHtml((user.created_at || '').slice(0, 10) || '—')}</td>
          <td class="text-end d-flex justify-content-end gap-2">${actionButtons}</td>
        </tr>
      `;
    })
    .join('');
}

function showEditForm(user) {
  const editForm = document.querySelector('[data-admin-user-edit-form]');
  if (!editForm || !user) {
    return;
  }

  editForm.classList.remove('d-none');
  editForm.querySelector('[name="userId"]').value = user.id;
  editForm.querySelector('[name="fullName"]').value = user.full_name || '';
  editForm.querySelector('[name="email"]').value = user.email || '';
  editForm.querySelector('[name="role"]').value = user.role || 'contractor';
  editForm.querySelector('[name="password"]').value = '';
}

function hideEditForm() {
  const editForm = document.querySelector('[data-admin-user-edit-form]');
  if (!editForm) {
    return;
  }

  editForm.classList.add('d-none');
  editForm.reset();
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

async function handleEditUserSubmit(form) {
  const messageElement = document.querySelector('[data-admin-users-message]');
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  const userId = String(formData.get('userId') || '').trim();
  const fullName = String(formData.get('fullName') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const role = String(formData.get('role') || 'contractor').trim();
  const password = String(formData.get('password') || '').trim();

  if (!userId || !email || !role) {
    setMessage(messageElement, 'User ID, email and role are required.', 'warning');
    return;
  }

  submitButton.disabled = true;
  setMessage(messageElement, 'Updating user...', 'secondary');

  const hasSession = await ensureAuthenticatedSession(messageElement);
  if (!hasSession) {
    submitButton.disabled = false;
    return;
  }

  const result = await updateManagedUser({
    userId,
    email,
    role,
    fullName,
    password: password || null
  });

  if (result.error) {
    setMessage(messageElement, resolveEdgeFunctionError(result.error), 'danger');
    submitButton.disabled = false;
    return;
  }

  setMessage(messageElement, 'User updated successfully.', 'success');
  hideEditForm();
  await reloadAdminUsers();
  submitButton.disabled = false;
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

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.matches('[data-admin-user-edit-form]')) {
      return;
    }

    event.preventDefault();
    handleEditUserSubmit(form);
  });

  document.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-admin-edit-user]');
    if (editButton) {
      event.preventDefault();
      const userId = editButton.getAttribute('data-admin-edit-user');
      showEditForm(cachedUsersById.get(userId));
      return;
    }

    const deleteButton = event.target.closest('[data-admin-delete-user]');
    if (deleteButton) {
      event.preventDefault();
      handleDeleteUser(deleteButton.getAttribute('data-admin-delete-user'));
      return;
    }

    const cancelEditButton = event.target.closest('[data-admin-edit-cancel]');
    if (cancelEditButton) {
      event.preventDefault();
      hideEditForm();
    }
  });

  window.addEventListener('app:render', (event) => {
    if (event.detail?.pathname === '/admin') {
      reloadAdminUsers();
    }
  });
}
