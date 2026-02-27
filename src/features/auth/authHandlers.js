import { navigateTo } from '../../router/index.js';
import { signInWithPassword, signOut, signUpWithPassword } from '../../services/authService.js';

function setMessage(element, message, variant = 'secondary') {
  if (!element) {
    return;
  }

  element.className = `alert alert-${variant} mb-0`;
  element.textContent = message;
}

async function handleLoginSubmit(form) {
  const messageElement = form.querySelector('[data-auth-message]');
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    setMessage(messageElement, 'Email and password are required.', 'warning');
    return;
  }

  submitButton.disabled = true;
  setMessage(messageElement, 'Signing in...', 'secondary');

  try {
    const { error } = await signInWithPassword({ email, password });

    if (error) {
      setMessage(messageElement, error.message, 'danger');
      return;
    }

    setMessage(messageElement, 'Signed in successfully.', 'success');
    navigateTo('/dashboard');
  } catch (error) {
    setMessage(messageElement, error.message, 'danger');
  } finally {
    submitButton.disabled = false;
  }
}

async function handleRegisterSubmit(form) {
  const messageElement = form.querySelector('[data-auth-message]');
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  const fullName = String(formData.get('fullName') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  if (!fullName || !email || !password || !confirmPassword) {
    setMessage(messageElement, 'All fields are required.', 'warning');
    return;
  }

  if (password !== confirmPassword) {
    setMessage(messageElement, 'Passwords do not match.', 'warning');
    return;
  }

  submitButton.disabled = true;
  setMessage(messageElement, 'Creating account...', 'secondary');

  try {
    const { error } = await signUpWithPassword({ email, password, fullName });

    if (error) {
      setMessage(messageElement, error.message, 'danger');
      return;
    }

    setMessage(messageElement, 'Registration completed. Check email for confirmation if required.', 'success');
    form.reset();
  } catch (error) {
    setMessage(messageElement, error.message, 'danger');
  } finally {
    submitButton.disabled = false;
  }
}

async function handleLogout(button) {
  button.disabled = true;

  try {
    const { error } = await signOut();
    if (error) {
      window.alert(error.message);
      return;
    }

    navigateTo('/login');
  } catch (error) {
    window.alert(error.message);
  } finally {
    button.disabled = false;
  }
}

export function initAuthHandlers() {
  document.addEventListener('submit', (event) => {
    const form = event.target;

    if (form.matches('[data-auth-form="login"]')) {
      event.preventDefault();
      handleLoginSubmit(form);
    }

    if (form.matches('[data-auth-form="register"]')) {
      event.preventDefault();
      handleRegisterSubmit(form);
    }
  });

  document.addEventListener('click', (event) => {
    const logoutButton = event.target.closest('[data-auth-action="logout"]');

    if (!logoutButton) {
      return;
    }

    event.preventDefault();
    handleLogout(logoutButton);
  });
}