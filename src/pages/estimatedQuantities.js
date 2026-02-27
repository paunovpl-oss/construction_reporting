import { renderPageShell } from '../shared/pageShell.js';

export function renderEstimatedQuantitiesPage() {
  return renderPageShell({
    title: 'Estimated Quantities',
    description: 'Track estimated item quantities per project and stage.',
    actions: '<button class="btn btn-primary" type="button" disabled>Add Estimate</button>',
    content: `
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Project</th>
              <th>Stage</th>
              <th>Item</th>
              <th>Estimated Qty</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" class="text-secondary">No estimated quantity records yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  });
}