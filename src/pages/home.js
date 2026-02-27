import { renderPageShell } from '../shared/pageShell.js';

export function renderHomePage() {
  return renderPageShell({
    title: 'Construction Works Reporting',
    description: 'Empty starter app with modular pages and URL-based navigation.',
    actions: `
      <a class="btn btn-primary" href="/dashboard" data-link>Open Dashboard</a>
      <a class="btn btn-outline-secondary" href="/projects" data-link>View Projects</a>
    `,
    content: `
      <div class="row g-3">
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