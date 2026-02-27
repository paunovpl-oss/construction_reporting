import { createProject, listProjects } from '../../services/projectsService.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(value) {
  return value ? escapeHtml(value) : '—';
}

function setMessage(element, message, variant = 'secondary') {
  if (!element) {
    return;
  }

  element.className = `alert alert-${variant} mb-0`;
  element.textContent = message;
}

function renderProjectsRows(rowsElement, projects) {
  if (!rowsElement) {
    return;
  }

  if (!projects.length) {
    rowsElement.innerHTML = '<tr><td colspan="6" class="text-secondary">No projects yet.</td></tr>';
    return;
  }

  rowsElement.innerHTML = projects
    .map(
      (project) => `
      <tr>
        <td>${escapeHtml(project.name)}</td>
        <td>${escapeHtml(project.location || '—')}</td>
        <td>${escapeHtml(project.client || '—')}</td>
        <td>${formatDate(project.start_date)}</td>
        <td>${formatDate(project.target_end_date)}</td>
        <td class="text-end">
          <a class="btn btn-sm btn-outline-primary" href="/projects/${escapeHtml(project.id)}" data-link>Details</a>
        </td>
      </tr>
    `
    )
    .join('');
}

export async function reloadProjectsData() {
  const rowsElement = document.querySelector('[data-projects-rows]');
  if (!rowsElement) {
    return;
  }

  const { data, error } = await listProjects();

  if (error) {
    rowsElement.innerHTML = `<tr><td colspan="6" class="text-danger">${escapeHtml(error.message)}</td></tr>`;
    return;
  }

  renderProjectsRows(rowsElement, data || []);
}

async function handleProjectSubmit(form) {
  const messageElement = form.querySelector('[data-project-message]');
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  const name = String(formData.get('name') || '').trim();
  const location = String(formData.get('location') || '').trim();
  const client = String(formData.get('client') || '').trim();
  const startDate = String(formData.get('startDate') || '');
  const targetEndDate = String(formData.get('targetEndDate') || '');

  if (!name) {
    setMessage(messageElement, 'Project name is required.', 'warning');
    return;
  }

  submitButton.disabled = true;
  setMessage(messageElement, 'Saving project...', 'secondary');

  const payload = {
    name,
    location: location || null,
    client: client || null,
    start_date: startDate || null,
    target_end_date: targetEndDate || null
  };

  const { error } = await createProject(payload);

  if (error) {
    setMessage(messageElement, error.message, 'danger');
    submitButton.disabled = false;
    return;
  }

  setMessage(messageElement, 'Project created successfully.', 'success');
  form.reset();
  await reloadProjectsData();
  window.dispatchEvent(new CustomEvent('projects:changed'));
  submitButton.disabled = false;
}

export function initProjectsHandlers() {
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.matches('[data-project-form]')) {
      return;
    }

    event.preventDefault();
    handleProjectSubmit(form);
  });

  window.addEventListener('app:render', (event) => {
    if (event.detail?.pathname === '/projects') {
      reloadProjectsData();
    }
  });
}