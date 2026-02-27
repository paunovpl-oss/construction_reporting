import { renderPageShell } from '../shared/pageShell.js';

export function renderRegisterPage() {
  return renderPageShell({
    title: 'Register',
    description: 'User onboarding placeholder.',
    content: `
      <form class="row g-3" autocomplete="off">
        <div class="col-12 col-md-6">
          <label class="form-label">Full Name</label>
          <input class="form-control" type="text" placeholder="Site Manager" disabled />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Email</label>
          <input class="form-control" type="email" placeholder="name@company.com" disabled />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Password</label>
          <input class="form-control" type="password" placeholder="••••••••" disabled />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Confirm Password</label>
          <input class="form-control" type="password" placeholder="••••••••" disabled />
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="button" disabled>Create Account</button>
        </div>
      </form>
    `
  });
}