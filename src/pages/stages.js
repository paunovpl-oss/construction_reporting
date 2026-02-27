import { renderPageShell } from '../shared/pageShell.js';

export function renderStagesPage() {
  return renderPageShell({
    title: 'Stages',
    description: 'Create and track project stages from Supabase.',
    actions: '<button class="btn btn-primary" type="submit" form="stage-create-form">Save Stage</button>',
    content: `
      <form id="stage-create-form" class="row g-3 mb-4" data-stage-form autocomplete="off">
        <div class="col-12 col-md-4">
          <label class="form-label">Project</label>
          <select class="form-select" name="projectId" data-stage-project-select required>
            <option value="">Select project...</option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Stage Name</label>
          <input class="form-control" name="name" type="text" required placeholder="Foundation" />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Status</label>
          <select class="form-select" name="status" required>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Planned Start</label>
          <input class="form-control" name="plannedStart" type="date" />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Planned End</label>
          <input class="form-control" name="plannedEnd" type="date" />
        </div>
        <div class="col-12">
          <div class="alert alert-secondary mb-0" data-stage-message role="status">Select project and stage details.</div>
        </div>
      </form>

      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Project</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Planned Dates</th>
            </tr>
          </thead>
          <tbody data-stages-rows>
            <tr><td colspan="4" class="text-secondary">Loading stages...</td></tr>
          </tbody>
        </table>
      </div>
    `
  });
}