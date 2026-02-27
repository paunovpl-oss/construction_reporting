import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/global.css';

import { initRouter } from './router/index.js';

const appElement = document.querySelector('#app');

initRouter(appElement);