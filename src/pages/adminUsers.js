import { renderPageShell } from '../shared/pageShell.js';

export function renderAdminUsersPage() {
  return renderPageShell({
    title: 'User Roles Dashboard',
    description: 'Manage application users, roles, and profile metadata.',
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

      <form class="row g-3 mb-4 d-none" data-admin-user-edit-form autocomplete="off">
        <input type="hidden" name="userId" />
        <div class="col-12">
          <h3 class="h6 mb-0">Edit User</h3>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Full Name</label>
          <input class="form-control" type="text" name="fullName" placeholder="John Doe" />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">User Email</label>
          <input class="form-control" type="email" name="email" required placeholder="user@company.com" />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Role</label>
          <select class="form-select" name="role" required>
            <option value="admin">Admin</option>
            <option value="contractor">Contractor</option>
            <option value="site_manager">Site Manager</option>
            <option value="project_manager">Project Manager</option>
            <option value="designer">Designer</option>
            <option value="accountant">Accountant</option>
          </select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">New Password (optional)</label>
          <input class="form-control" type="password" name="password" placeholder="Leave empty to keep unchanged" />
        </div>
        <div class="col-12 d-flex gap-2">
          <button class="btn btn-success" type="submit">Save Changes</button>
          <button class="btn btn-outline-secondary" type="button" data-admin-edit-cancel>Cancel</button>
        </div>
      </form>

      <div class="alert alert-secondary mb-4" data-admin-users-message role="status">Load users...</div>

      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody data-admin-users-rows>
            <tr><td colspan="5" class="text-secondary">Loading users...</td></tr>
          </tbody>
        </table>
      </div>
    `
  });
}
