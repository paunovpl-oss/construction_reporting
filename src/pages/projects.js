import { renderPageShell } from '../shared/pageShell.js';

export function renderProjectsPage() {
  return renderPageShell({
    title: 'Projects',
    description: 'Create and view projects from Supabase.',
    actions: '<button class="btn btn-primary" type="submit" form="project-create-form">Save Project</button>',
    content: `
      <form id="project-create-form" class="row g-3 mb-4" data-project-form autocomplete="off">
        <div class="col-12 col-md-6">
          <label class="form-label">Project Name</label>
          <input class="form-control" name="name" type="text" required placeholder="Residential Block A" />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Location</label>
          <input class="form-control" name="location" type="text" placeholder="Sofia" />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Client</label>
          <input class="form-control" name="client" type="text" placeholder="Investor Ltd." />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Start Date</label>
          <input class="form-control" name="startDate" type="date" />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Target End Date</label>
          <input class="form-control" name="targetEndDate" type="date" />
        </div>
        <div class="col-12">
          <div class="alert alert-secondary mb-0" data-project-message role="status">Enter project details and save.</div>
        </div>
      </form>

      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Project</th>
              <th>Location</th>
              <th>Client</th>
              <th>Start</th>
              <th>Target End</th>
              <th class="text-end">Open</th>
            </tr>
          </thead>
          <tbody data-projects-rows>
            <tr><td colspan="6" class="text-secondary">Loading projects...</td></tr>
          </tbody>
        </table>
      </div>
    `
  });
}