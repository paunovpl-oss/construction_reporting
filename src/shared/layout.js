function isActiveRoute(currentPath, href) {
  if (href === '/') {
    return currentPath === '/';
  }

  return currentPath.startsWith(href);
}

function navLink({ href, label, currentPath }) {
  const activeClass = isActiveRoute(currentPath, href) ? 'active' : '';
  return `
    <li class="nav-item">
      <a class="nav-link ${activeClass}" href="${href}" data-link>${label}</a>
    </li>
  `;
}

export function renderLayout(content, currentPath) {
  return `
    <div class="app-shell d-flex flex-column min-vh-100">
      <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
        <div class="container">
          <a class="navbar-brand fw-semibold" href="/" data-link>BuildTrack</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNavbar">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              ${navLink({ href: '/dashboard', label: 'Dashboard', currentPath })}
              ${navLink({ href: '/projects', label: 'Projects', currentPath })}
              ${navLink({ href: '/stages', label: 'Stages', currentPath })}
              ${navLink({ href: '/estimated-quantities', label: 'Estimated Quantities', currentPath })}
              ${navLink({ href: '/purchase-orders', label: 'Purchase Orders', currentPath })}
              ${navLink({ href: '/delivery-notes', label: 'Delivery Notes', currentPath })}
            </ul>
            <ul class="navbar-nav" data-auth-nav></ul>
          </div>
        </div>
      </nav>

      <main class="container flex-grow-1 py-4">
        ${content}
      </main>
    </div>
  `;
}