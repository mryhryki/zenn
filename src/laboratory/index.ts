import { render } from 'react-dom';
import { Routes } from './routes';

// if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
if ('serviceWorker' in navigator) {
  navigator
    .serviceWorker
    .register('./service_worker.js')
    .then((registration: any) => console.log('ServiceWorker scope:', registration.scope))
    .catch((error: any) => console.log('ServiceWorker registration failed: ', error));
}

render(Routes, document.getElementById('content-wrapper'));

import './common/web_socket';
