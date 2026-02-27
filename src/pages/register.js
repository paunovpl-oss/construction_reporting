import { renderPageShell } from '../shared/pageShell.js';

export function renderRegisterPage() {
  return renderPageShell({
    title: 'Register',
    description: 'Create an account with Supabase Auth.',
    content: `
      <form class="row g-3" autocomplete="off" data-auth-form="register">
        <div class="col-12 col-md-6">
          <label class="form-label">Full Name</label>
          <input class="form-control" type="text" name="fullName" placeholder="Site Manager" required />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Email</label>
          <input class="form-control" type="email" name="email" placeholder="name@company.com" required />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Password</label>
          <input class="form-control" type="password" name="password" placeholder="••••••••" required />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Confirm Password</label>
          <input class="form-control" type="password" name="confirmPassword" placeholder="••••••••" required />
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="submit">Create Account</button>
        </div>
        <div class="col-12">
          <div class="alert alert-secondary mb-0" data-auth-message role="status">
            Complete the form to register.
          </div>
        </div>
      </form>
    `
  });
}