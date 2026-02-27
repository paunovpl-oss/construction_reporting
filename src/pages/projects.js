import { renderPageShell } from '../shared/pageShell.js';

export function renderProjectsPage() {
  return renderPageShell({
    title: 'Projects',
    description: 'Project list module placeholder.',
    actions: '<button class="btn btn-primary" type="button" disabled>New Project</button>',
    content: `
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Project</th>
              <th>Location</th>
              <th>Status</th>
              <th class="text-end">Open</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Placeholder Project</td>
              <td>—</td>
              <td><span class="badge text-bg-secondary">Not Started</span></td>
              <td class="text-end">
                <a class="btn btn-sm btn-outline-primary" href="/projects/demo-project" data-link>Details</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  });
}