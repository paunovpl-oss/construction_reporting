import { navigateTo } from '../../router/index.js';
import { hasSupabaseConfig } from '../../lib/supabaseClient.js';
import { signInWithPassword, signUpWithPassword } from '../../services/authService.js';
import { assignFirstAdmin, isAdminInitialized } from '../../services/rolesService.js';

function setMessage(element, message, variant = 'secondary') {
  if (!element) {
    return;
  }

  element.className = `alert alert-${variant} mb-0`;
  element.textContent = message;
}

async function refreshFirstAdminSection() {
  const section = document.querySelector('[data-first-admin-section]');
  if (!section) {
    return;
  }

  if (!hasSupabaseConfig) {
    const messageElement = section.querySelector('[data-first-admin-message]');
    setMessage(
      messageElement,
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart npm run dev.',
      'warning'
    );
    return;
  }

  const { data, error } = await isAdminInitialized();
  if (error) {
    return;
  }

  section.classList.toggle('d-none', Boolean(data));
}

async function handleFirstAdminSubmit(form) {
  const messageElement = form.querySelector('[data-first-admin-message]');
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    setMessage(messageElement, 'Email and password are required.', 'warning');
    return;
  }

  if (!hasSupabaseConfig) {
    setMessage(
      messageElement,
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart npm run dev.',
      'warning'
    );
    return;
  }

  submitButton.disabled = true;
  setMessage(messageElement, 'Creating first admin user...', 'secondary');

  try {
    const signUpResult = await signUpWithPassword({ email, password, fullName: 'Admin User' });
    if (signUpResult.error) {
      setMessage(messageElement, signUpResult.error.message, 'danger');
      return;
    }

    if (!signUpResult.data.session) {
      const signInResult = await signInWithPassword({ email, password });
      if (signInResult.error) {
        setMessage(
          messageElement,
          'User created. Sign in manually once email confirmation is complete, then click Create Admin again.',
          'warning'
        );
        return;
      }
    }

    const adminResult = await assignFirstAdmin();
    if (adminResult.error) {
      setMessage(messageElement, adminResult.error.message, 'danger');
      return;
    }

    if (!adminResult.data) {
      setMessage(messageElement, 'Admin user is already initialized.', 'warning');
      await refreshFirstAdminSection();
      return;
    }

    setMessage(messageElement, 'First admin user created successfully.', 'success');
    await refreshFirstAdminSection();
    window.dispatchEvent(new CustomEvent('admin:initialized'));
    navigateTo('/admin');
  } catch (error) {
    setMessage(messageElement, error instanceof Error ? error.message : 'Unexpected error.', 'danger');
  } finally {
    submitButton.disabled = false;
  }
}

export function initFirstAdminHandlers() {
  document.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-first-admin-open]');
    if (!openButton) {
      return;
    }

    const section = document.querySelector('[data-first-admin-section]');
    const form = section?.querySelector('[data-first-admin-form]');
    if (!form) {
      return;
    }

    form.classList.remove('d-none');
    openButton.classList.add('d-none');
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.matches('[data-first-admin-form]')) {
      return;
    }

    event.preventDefault();
    handleFirstAdminSubmit(form);
  });

  window.addEventListener('app:render', (event) => {
    if (event.detail?.pathname === '/') {
      refreshFirstAdminSection();
    }
  });

  window.addEventListener('admin:initialized', () => {
    refreshFirstAdminSection();
  });
}
