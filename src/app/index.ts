import { render } from 'react-dom';
import { Routes } from './routes';
import './index.scss';

const { serviceWorker } = navigator;
if (serviceWorker != null && process.env.NODE_ENV === 'production') {
  serviceWorker
    .register('/service_worker.js')
    .then((registration: any) => console.log('ServiceWorker scope:', registration.scope))
    .catch((error: any) => console.log('ServiceWorker registration failed: ', error));
}

render(Routes, document.getElementById('app'));
