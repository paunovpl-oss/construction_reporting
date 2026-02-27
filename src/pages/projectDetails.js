import { renderPageShell } from '../shared/pageShell.js';

export function renderProjectDetailsPage({ params }) {
  const [projectId] = params;

  return renderPageShell({
    title: `Project: ${projectId}`,
    description: 'Project detail module placeholder.',
    actions: `<a class="btn btn-outline-secondary" href="/projects/${projectId}/admin" data-link>Admin</a>`,
    content: `
      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <div class="p-3 border rounded-3 h-100">
            <h2 class="h6">Stage Timeline</h2>
            <p class="text-secondary mb-0">Planned vs actual stage progress goes here.</p>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="p-3 border rounded-3 h-100">
            <h2 class="h6">Reports Feed</h2>
            <p class="text-secondary mb-0">Latest stage reports appear here.</p>
          </div>
        </div>
      </div>
    `
  });
}