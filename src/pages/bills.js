import { renderPageShell } from '../shared/pageShell.js';

export function renderBillsPage() {
  return renderPageShell({
    title: 'Bills',
    description: 'Track vendor bills and invoice line items linked to project items.',
    actions: '<button class="btn btn-primary" type="button" disabled>New Bill</button>',
    content: `
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Bill Number</th>
              <th>Project</th>
              <th>Vendor</th>
              <th>Bill Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" class="text-secondary">No bills yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  });
}