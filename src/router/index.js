import { renderLayout } from '../shared/layout.js';
import { fallbackRoute, routes } from './routes.js';

const pathState = {
  currentPath: window.location.pathname
};

function matchRoute(pathname) {
  for (const route of routes) {
    const match = pathname.match(route.path);
    if (match) {
      return {
        page: route.page,
        params: match.slice(1)
      };
    }
  }

  return {
    page: fallbackRoute,
    params: []
  };
}

function render(appElement) {
  const { page, params } = matchRoute(pathState.currentPath);
  const pageView = page({
    pathname: pathState.currentPath,
    params
  });

  appElement.innerHTML = renderLayout(pageView, pathState.currentPath);
}

export function navigateTo(pathname) {
  if (pathname === pathState.currentPath) {
    return;
  }

  window.history.pushState({}, '', pathname);
  pathState.currentPath = pathname;
  window.dispatchEvent(new CustomEvent('app:navigate'));
}

export function initRouter(appElement) {
  render(appElement);

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-link]');
    if (!link) {
      return;
    }

    event.preventDefault();
    navigateTo(link.getAttribute('href'));
  });

  window.addEventListener('popstate', () => {
    pathState.currentPath = window.location.pathname;
    render(appElement);
  });

  window.addEventListener('app:navigate', () => {
    render(appElement);
  });
}