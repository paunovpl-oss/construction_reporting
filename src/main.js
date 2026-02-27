import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/global.css';

import { initAuthHandlers } from './features/auth/authHandlers.js';
import { initAuthNav } from './features/auth/authNav.js';
import { initRouter } from './router/index.js';

const appElement = document.querySelector('#app');

initAuthHandlers();
initAuthNav();
initRouter(appElement);