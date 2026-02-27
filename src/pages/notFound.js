import { renderPageShell } from '../shared/pageShell.js';

export function renderNotFoundPage() {
  return renderPageShell({
    title: 'Page Not Found',
    description: 'The URL does not match any app route.',
    actions: '<a class="btn btn-primary" href="/" data-link>Go Home</a>',
    content: '<p class="mb-0 text-secondary">Check the URL and try again.</p>'
  });
}