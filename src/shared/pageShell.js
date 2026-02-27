export function renderPageShell({ title, description, actions = '', content = '' }) {
  return `
    <section class="page-shell">
      <header class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h1 class="h3 mb-1">${title}</h1>
          <p class="text-secondary mb-0">${description}</p>
        </div>
        ${actions ? `<div class="d-flex flex-wrap gap-2">${actions}</div>` : ''}
      </header>
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          ${content}
        </div>
      </div>
    </section>
  `;
}