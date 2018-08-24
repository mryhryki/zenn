import { render } from 'react-dom';
import { Routes } from './routes';
import './index.scss';

if ('serviceWorker' in navigator) {
  navigator
    .serviceWorker
    .register('/service_worker.js')
    .then((registration: any) => console.log('ServiceWorker scope:', registration.scope))
    .catch((error: any) => console.log('ServiceWorker registration failed: ', error));
}

render(Routes, document.getElementById('app'));
