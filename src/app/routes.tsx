import * as React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';
import { CommonFrame } from './containers/common_frame/common_frame';
import { AboutThisContainer } from './containers/about_this';
import { AboutAuthorContainer } from './containers/about_author';
import { LaboratoryContainer } from './containers/laboratory';
import { QrCodeContainer } from './containers/laboratory/qr_code';
import { ServiceWorkerContainer } from './containers/laboratory/service_worker';
import { ServiceWorkerCacheContainer } from './containers/laboratory/service_worker/cache';
import { ServiceWorkerPushContainer } from './containers/laboratory/service_worker/push';
import { ServiceWorkerBackgroundSyncContainer } from './containers/laboratory/service_worker/background_sync';

const Views: Array<{
  key: string,
  path: string,
  titleJp: string,
  titleEn: string,
  component: React.ComponentType<any>,
  level: number
}> = [
  {
    key: 'about_this',
    path: '/',
    titleJp: 'このサイトについて',
    titleEn: 'About this',
    component: AboutThisContainer,
    level: 1,
  },
  {
    key: 'about_author',
    path: '/author',
    titleJp: '運営者について',
    titleEn: 'About author',
    component: AboutAuthorContainer,
    level: 1,
  },
  {
    key: 'laboratory',
    path: '/laboratory',
    titleJp: '実験室',
    titleEn: 'Laboratory',
    component: LaboratoryContainer,
    level: 1,
  },
  {
    key: 'service_worker',
    path: '/laboratory/service_worker',
    titleJp: 'サービスワーカー',
    titleEn: 'Service Worker',
    component: ServiceWorkerContainer,
    level: 2,
  },
  {
    key: 'service_worker_cache',
    path: '/laboratory/service_worker/cache',
    titleJp: 'キャッシュ',
    titleEn: 'Cache API',
    component: ServiceWorkerCacheContainer,
    level: 3,
  },
  {
    key: 'service_worker_push',
    path: '/laboratory/service_worker/push',
    titleJp: 'プッシュ通知',
    titleEn: 'Push API',
    component: ServiceWorkerPushContainer,
    level: 3,
  },
  {
    key: 'service_worker_sync',
    path: '/laboratory/service_worker/background_sync',
    titleJp: 'バックグラウンド同期',
    titleEn: 'Background Sync API',
    component: ServiceWorkerBackgroundSyncContainer,
    level: 3,
  },
  {
    key: 'qr_code',
    path: '/laboratory/qr_code',
    titleJp: 'QRコード',
    titleEn: 'QR Code',
    component: QrCodeContainer,
    level: 2,
  },
];

const menuList = Views.map((view) => ({
  path: view.path,
  titleJp: view.titleJp,
  titleEn: view.titleEn,
  level: view.level,
}));

const Routes = (
  <Router>
    <CommonFrame menuList={menuList}>
      {Views.map((view) => (
        <Route
          component={view.component}
          exact
          key={view.path}
          path={view.path}
          strict
        />
      ))}
    </CommonFrame>
  </Router>
);

const extractPath = (key: string): string => {
  const view = Views.find((view) => view.key === key);
  if (view == null) {
    throw new Error(`Not found: ${key}`);
  }
  return `${view.path}`;
};
const ServiceWorkerPath: string = extractPath('service_worker');
const ServiceWorkerCachePath: string = extractPath('service_worker_cache');
const ServiceWorkerPushPath: string = extractPath('service_worker_push');
const ServiceWorkerSyncPath: string = extractPath('service_worker_sync');
const QrCodePath: string = extractPath('qr_code');

export {
  Routes,
  QrCodePath,
  ServiceWorkerCachePath,
  ServiceWorkerPath,
  ServiceWorkerPushPath,
  ServiceWorkerSyncPath,
};
