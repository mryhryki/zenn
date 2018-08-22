import * as React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';
import { CommonFrame } from './containers/common_frame/common_frame';
import { IndexContainer } from './containers/index';
import { QrCodeContainer } from './containers/qr_code';
import { ServiceWorkerContainer } from './containers/service_worker';
import { ServiceWorkerCacheContainer } from './containers/service_worker/cache';
import { ServiceWorkerPushContainer } from './containers/service_worker/push';
import { ServiceWorkerBackgroundSyncContainer } from './containers/service_worker/background_sync';

const Views: Array<{
  path: string,
  titleJp: string,
  titleEn: string,
  component: React.ComponentType<any>,
  level: number
}> = [
  {
    path: '/',
    titleJp: 'はじめに',
    titleEn: 'Introduction',
    component: IndexContainer,
    level: 1,
  },
  {
    path: '/qr_code',
    titleJp: 'QRコード',
    titleEn: 'QR Code',
    component: QrCodeContainer,
    level: 1,
  },
  {
    path: '/service_worker',
    titleJp: 'サービスワーカー',
    titleEn: 'Service Worker',
    component: ServiceWorkerContainer,
    level: 1,
  },
  {
    path: '/service_worker/cache',
    titleJp: 'キャッシュ',
    titleEn: 'Cache API',
    component: ServiceWorkerCacheContainer,
    level: 2,
  },
  {
    path: '/service_worker/push',
    titleJp: 'プッシュ通知',
    titleEn: 'Push API',
    component: ServiceWorkerPushContainer,
    level: 2,
  },
  {
    path: '/service_worker/background_sync',
    titleJp: 'バックグラウンド同期',
    titleEn: 'Background Sync API',
    component: ServiceWorkerBackgroundSyncContainer,
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

export { Routes };
