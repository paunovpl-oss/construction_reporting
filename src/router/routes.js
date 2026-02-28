import { renderAdminPage } from '../pages/admin.js';
import { renderAdminUsersPage } from '../pages/adminUsers.js';
import { renderBillsPage } from '../pages/bills.js';
import { renderDashboardPage } from '../pages/dashboard.js';
import { renderDeliveryNotesPage } from '../pages/deliveryNotes.js';
import { renderEstimatedQuantitiesPage } from '../pages/estimatedQuantities.js';
import { renderHomePage } from '../pages/home.js';
import { renderLoginPage } from '../pages/login.js';
import { renderNotFoundPage } from '../pages/notFound.js';
import { renderProjectDetailsPage } from '../pages/projectDetails.js';
import { renderProjectsPage } from '../pages/projects.js';
import { renderPurchaseOrdersPage } from '../pages/purchaseOrders.js';
import { renderRegisterPage } from '../pages/register.js';
import { renderStagesPage } from '../pages/stages.js';

export const routes = [
  { path: /^\/$/, page: renderHomePage },
  { path: /^\/login\/?$/, page: renderLoginPage },
  { path: /^\/register\/?$/, page: renderRegisterPage },
  { path: /^\/admin\/?$/, page: renderAdminUsersPage },
  { path: /^\/projects\/?$/, page: renderProjectsPage },
  { path: /^\/stages\/?$/, page: renderStagesPage },
  { path: /^\/estimated-quantities\/?$/, page: renderEstimatedQuantitiesPage },
  { path: /^\/purchase-orders\/?$/, page: renderPurchaseOrdersPage },
  { path: /^\/delivery-notes\/?$/, page: renderDeliveryNotesPage },
  { path: /^\/bills\/?$/, page: renderBillsPage },
  { path: /^\/projects\/([^/]+)\/?$/, page: renderProjectDetailsPage },
  { path: /^\/projects\/([^/]+)\/admin\/?$/, page: renderAdminPage },
  { path: /^\/dashboard\/?$/, page: renderDashboardPage }
];

export const fallbackRoute = renderNotFoundPage;