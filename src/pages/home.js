import { renderPageShell } from '../shared/pageShell.js';

export function renderHomePage() {
  return renderPageShell({
    title: 'Construction Works Reporting',
    description: 'Modular app with Supabase auth, project modules, and admin workflows.',
    actions: `
      <a class="btn btn-primary" href="/dashboard" data-link>Open Dashboard</a>
      <a class="btn btn-outline-secondary" href="/projects" data-link>View Projects</a>
    `,
    content: `
      <div class="row g-3">
        <div class="col-12" data-first-admin-section>
          <div class="p-3 rounded-3 border bg-light">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
              <div>
                <h2 class="h6 mb-1">Initial Setup</h2>
                <p class="text-secondary mb-0">Create the first admin user (one-time action).</p>
              </div>
              <button class="btn btn-warning" type="button" data-first-admin-open>Create Admin User</button>
            </div>
            <form class="row g-3 d-none" data-first-admin-form autocomplete="off">
              <div class="col-12 col-md-6">
                <label class="form-label">Admin Email</label>
                <input class="form-control" type="email" name="email" required placeholder="admin@company.com" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Admin Password</label>
                <input class="form-control" type="password" name="password" required placeholder="Strong password" />
              </div>
              <div class="col-12">
                <button class="btn btn-primary" type="submit">Register First Admin</button>
              </div>
              <div class="col-12">
                <div class="alert alert-secondary mb-0" data-first-admin-message role="status">
                  This button disappears permanently after successful admin registration.
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="placeholder-card p-3 rounded-3 border h-100">
            <h2 class="h6">Projects Module</h2>
            <p class="mb-0 text-secondary">Plug project list and CRUD here.</p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="placeholder-card p-3 rounded-3 border h-100">
            <h2 class="h6">Reporting Module</h2>
            <p class="mb-0 text-secondary">Add stage reports and file attachments here.</p>
          </div>
        </div>
      </div>
    `
  });
}