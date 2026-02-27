import { renderPageShell } from '../shared/pageShell.js';

export function renderDashboardPage() {
  return renderPageShell({
    title: 'Dashboard',
    description: 'Progress overview module placeholder.',
    content: `
      <div class="row g-3">
        <div class="col-12 col-md-6 col-xl-3">
          <div class="metric-card p-3 rounded-3 border h-100">
            <p class="text-secondary mb-1">Active Projects</p>
            <p class="h4 mb-0">0</p>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="metric-card p-3 rounded-3 border h-100">
            <p class="text-secondary mb-1">In Progress Stages</p>
            <p class="h4 mb-0">0</p>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="metric-card p-3 rounded-3 border h-100">
            <p class="text-secondary mb-1">Blocked Stages</p>
            <p class="h4 mb-0">0</p>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="metric-card p-3 rounded-3 border h-100">
            <p class="text-secondary mb-1">Completed Stages</p>
            <p class="h4 mb-0">0</p>
          </div>
        </div>
      </div>
    `
  });
}