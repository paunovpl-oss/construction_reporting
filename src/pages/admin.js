import { renderPageShell } from '../shared/pageShell.js';

export function renderAdminPage({ params }) {
  const [projectId] = params;

  return renderPageShell({
    title: `Admin: ${projectId}`,
    description: 'Project admin module placeholder.',
    content: `
      <div class="alert alert-secondary mb-0" role="alert">
        Configure project members, permissions, and advanced settings here.
      </div>
    `
  });
}