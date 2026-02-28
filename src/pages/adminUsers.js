import { renderPageShell } from '../shared/pageShell.js';

export function renderAdminUsersPage() {
  return renderPageShell({
    title: 'User Roles Dashboard',
    description: 'Manage application users and assign MVP placeholder roles.',
    content: `
      <form class="row g-3 mb-4" data-admin-user-form autocomplete="off">
        <div class="col-12 col-md-5">
          <label class="form-label">User Email</label>
          <input class="form-control" type="email" name="email" required placeholder="new.user@company.com" />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Temporary Password</label>
          <input class="form-control" type="password" name="password" required placeholder="Temporary password" />
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label">Role</label>
          <select class="form-select" name="role" required>
            <option value="contractor">Contractor</option>
            <option value="site_manager">Site Manager</option>
            <option value="project_manager">Project Manager</option>
            <option value="designer">Designer</option>
            <option value="accountant">Accountant</option>
          </select>
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="submit">Create User</button>
        </div>
      </form>

      <div class="alert alert-secondary mb-4" data-admin-users-message role="status">Load users...</div>

      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody data-admin-users-rows>
            <tr><td colspan="4" class="text-secondary">Loading users...</td></tr>
          </tbody>
        </table>
      </div>
    `
  });
}
