import { listProjects } from '../../services/projectsService.js';
import { createStage, listStages } from '../../services/stagesService.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setMessage(element, message, variant = 'secondary') {
  if (!element) {
    return;
  }

  element.className = `alert alert-${variant} mb-0`;
  element.textContent = message;
}

function humanStatus(status) {
  return status.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value) {
  return value ? escapeHtml(value) : '—';
}

function renderStagesRows(rowsElement, stages) {
  if (!rowsElement) {
    return;
  }

  if (!stages.length) {
    rowsElement.innerHTML = '<tr><td colspan="4" class="text-secondary">No stage records yet.</td></tr>';
    return;
  }

  rowsElement.innerHTML = stages
    .map(
      (stage) => `
      <tr>
        <td>${escapeHtml(stage.projects?.name || '—')}</td>
        <td>${escapeHtml(stage.name)}</td>
        <td><span class="badge text-bg-secondary">${escapeHtml(humanStatus(stage.status))}</span></td>
        <td>${formatDate(stage.planned_start)} → ${formatDate(stage.planned_end)}</td>
      </tr>
    `
    )
    .join('');
}

async function reloadProjectSelect() {
  const selectElement = document.querySelector('[data-stage-project-select]');
  if (!selectElement) {
    return;
  }

  const { data, error } = await listProjects();
  if (error) {
    selectElement.innerHTML = '<option value="">Unable to load projects</option>';
    return;
  }

  const options = (data || [])
    .map((project) => `<option value="${escapeHtml(project.id)}">${escapeHtml(project.name)}</option>`)
    .join('');

  selectElement.innerHTML = `<option value="">Select project...</option>${options}`;
}

async function reloadStagesData() {
  const rowsElement = document.querySelector('[data-stages-rows]');
  if (!rowsElement) {
    return;
  }

  const { data, error } = await listStages();
  if (error) {
    rowsElement.innerHTML = `<tr><td colspan="4" class="text-danger">${escapeHtml(error.message)}</td></tr>`;
    return;
  }

  renderStagesRows(rowsElement, data || []);
}

async function handleStageSubmit(form) {
  const messageElement = form.querySelector('[data-stage-message]');
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  const projectId = String(formData.get('projectId') || '');
  const name = String(formData.get('name') || '').trim();
  const status = String(formData.get('status') || 'not_started');
  const plannedStart = String(formData.get('plannedStart') || '');
  const plannedEnd = String(formData.get('plannedEnd') || '');

  if (!projectId || !name) {
    setMessage(messageElement, 'Project and stage name are required.', 'warning');
    return;
  }

  submitButton.disabled = true;
  setMessage(messageElement, 'Saving stage...', 'secondary');

  const { error } = await createStage({
    project_id: projectId,
    name,
    status,
    planned_start: plannedStart || null,
    planned_end: plannedEnd || null
  });

  if (error) {
    setMessage(messageElement, error.message, 'danger');
    submitButton.disabled = false;
    return;
  }

  setMessage(messageElement, 'Stage created successfully.', 'success');
  form.reset();
  await reloadProjectSelect();
  await reloadStagesData();
  submitButton.disabled = false;
}

export function initStagesHandlers() {
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.matches('[data-stage-form]')) {
      return;
    }

    event.preventDefault();
    handleStageSubmit(form);
  });

  window.addEventListener('app:render', (event) => {
    if (event.detail?.pathname === '/stages') {
      reloadProjectSelect();
      reloadStagesData();
    }
  });

  window.addEventListener('projects:changed', () => {
    reloadProjectSelect();
  });
}