import { renderPageShell } from '../shared/pageShell.js';

export function renderLoginPage() {
  return renderPageShell({
    title: 'Login',
    description: 'Authentication page placeholder.',
    content: `
      <form class="row g-3" autocomplete="off">
        <div class="col-12 col-md-6">
          <label class="form-label">Email</label>
          <input class="form-control" type="email" placeholder="name@company.com" disabled />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Password</label>
          <input class="form-control" type="password" placeholder="••••••••" disabled />
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="button" disabled>Sign In</button>
        </div>
      </form>
    `
  });
}