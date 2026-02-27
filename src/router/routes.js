import { renderAdminPage } from '../pages/admin.js';
import { renderDashboardPage } from '../pages/dashboard.js';
import { renderHomePage } from '../pages/home.js';
import { renderLoginPage } from '../pages/login.js';
import { renderNotFoundPage } from '../pages/notFound.js';
import { renderProjectDetailsPage } from '../pages/projectDetails.js';
import { renderProjectsPage } from '../pages/projects.js';
import { renderRegisterPage } from '../pages/register.js';

export const routes = [
  { path: /^\/$/, page: renderHomePage },
  { path: /^\/login\/?$/, page: renderLoginPage },
  { path: /^\/register\/?$/, page: renderRegisterPage },
  { path: /^\/projects\/?$/, page: renderProjectsPage },
  { path: /^\/projects\/([^/]+)\/?$/, page: renderProjectDetailsPage },
  { path: /^\/projects\/([^/]+)\/admin\/?$/, page: renderAdminPage },
  { path: /^\/dashboard\/?$/, page: renderDashboardPage }
];

export const fallbackRoute = renderNotFoundPage;