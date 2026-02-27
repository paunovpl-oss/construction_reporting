import { renderPageShell } from '../shared/pageShell.js';

export function renderPurchaseOrdersPage() {
  return renderPageShell({
    title: 'Purchase Orders',
    description: 'Manage purchase order headers and status lifecycle.',
    actions: '<button class="btn btn-primary" type="button" disabled>New PO</button>',
    content: `
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Project</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Issue Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" class="text-secondary">No purchase orders yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  });
}