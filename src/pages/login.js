import { renderPageShell } from '../shared/pageShell.js';

export function renderLoginPage() {
  return renderPageShell({
    title: 'Login',
    description: 'Sign in with Supabase Auth credentials.',
    content: `
      <form class="row g-3" autocomplete="off" data-auth-form="login">
        <div class="col-12 col-md-6">
          <label class="form-label">Email</label>
          <input class="form-control" type="email" name="email" placeholder="name@company.com" required />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Password</label>
          <input class="form-control" type="password" name="password" placeholder="••••••••" required />
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="submit">Sign In</button>
        </div>
        <div class="col-12">
          <div class="alert alert-secondary mb-0" data-auth-message role="status">
            Enter credentials to sign in.
          </div>
        </div>
      </form>
    `
  });
}