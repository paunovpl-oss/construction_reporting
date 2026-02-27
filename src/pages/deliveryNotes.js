import { renderPageShell } from '../shared/pageShell.js';

export function renderDeliveryNotesPage() {
  return renderPageShell({
    title: 'Delivery Notes',
    description: 'Track supplier deliveries and received quantities.',
    actions: '<button class="btn btn-primary" type="button" disabled>New Delivery Note</button>',
    content: `
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Note Number</th>
              <th>Project</th>
              <th>Supplier</th>
              <th>Delivery Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" class="text-secondary">No delivery notes yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  });
}