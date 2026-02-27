import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/global.css';

import { initAdminUsersHandlers } from './features/admin/adminUsersHandlers.js';
import { initFirstAdminHandlers } from './features/admin/firstAdminHandlers.js';
import { initAuthGuards } from './features/auth/authGuards.js';
import { initAuthHandlers } from './features/auth/authHandlers.js';
import { initAuthNav } from './features/auth/authNav.js';
import { initProjectsHandlers } from './features/projects/projectsHandlers.js';
import { initStagesHandlers } from './features/stages/stagesHandlers.js';
import { initRouter } from './router/index.js';

const appElement = document.querySelector('#app');

initAdminUsersHandlers();
initFirstAdminHandlers();
initAuthGuards();
initAuthHandlers();
initAuthNav();
initProjectsHandlers();
initStagesHandlers();
initRouter(appElement);