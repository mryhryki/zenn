import * as React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';
import { CommonFrame } from './containers/common_frame';
import { HomeContainer } from './containers/home';
import { LaboratoryContainer } from './containers/laboratory';
import { WebRtcContainer } from './containers/laboratory/web_rtc';
// import {SkyWayContainer} from './containers/laboratory/web_rtc/skyway';
import { ServiceWorkerContainer } from './containers/laboratory/service_worker';
import { ServiceWorkerCacheContainer } from './containers/laboratory/service_worker/cache';
import { ServiceWorkerPushNotificationContainer } from './containers/laboratory/service_worker/push_notification';
import { ServiceWorkerBackgroundSyncContainer } from './containers/laboratory/service_worker/background_sync';
import { UtilityContainer } from './containers/utility';
import { QrCodeContainer } from './containers/utility/qr_code';

const HomePath = '/';
const LaboratoryPath = '/laboratory';
const ServiceWorkerPath = '/laboratory/service_worker';
const ServiceWorkerCachePath = '/laboratory/service_worker/cache';
const ServiceWorkerPushNotificationPath = '/laboratory/service_worker/push_notification';
const ServiceWorkerBackgroundSyncPath = '/laboratory/service_worker/background_sync';
const WebRtcPath = '/laboratory/web_rtc';
const UtilityPath = '/utility';
const QrCodePath = '/utility/qr_code';

const Views: Array<{
  key: string,
  path: string,
  titleJp: string,
  titleEn: string,
  component: React.ComponentType<any>,
  level: number
}> = [
  {
    key: 'home',
    path: HomePath,
    titleJp: 'ホーム',
    titleEn: 'Home',
    component: HomeContainer,
    level: 1,
  },
  {
    key: 'laboratory',
    path: LaboratoryPath,
    titleJp: '実験室',
    titleEn: 'Laboratory',
    component: LaboratoryContainer,
    level: 1,
  },
  {
    key: 'service_worker',
    path: ServiceWorkerPath,
    titleJp: 'サービスワーカー',
    titleEn: 'Service Worker',
    component: ServiceWorkerContainer,
    level: 2,
  },
  {
    key: 'service_worker_cache',
    path: ServiceWorkerCachePath,
    titleJp: 'キャッシュAPI',
    titleEn: 'Cache API',
    component: ServiceWorkerCacheContainer,
    level: 3,
  },
  {
    key: 'service_worker_push_notification',
    path: ServiceWorkerPushNotificationPath,
    titleJp: 'プッシュ通知API',
    titleEn: 'Push Notification API',
    component: ServiceWorkerPushNotificationContainer,
    level: 3,
  },
  {
    key: 'service_worker_background_sync',
    path: ServiceWorkerBackgroundSyncPath,
    titleJp: 'バックグラウンド同期API',
    titleEn: 'Background Sync API',
    component: ServiceWorkerBackgroundSyncContainer,
    level: 3,
  },
  {
    key: 'web_rtc',
    path: WebRtcPath,
    titleJp: 'WebRTC',
    titleEn: 'WebRTC',
    component: WebRtcContainer,
    level: 2,
  },
  // {
  //   key: 'skyway',
  //   path: '/laboratory/skyway',
  //   titleJp: 'SkyWayを使ったサンプル',
  //   titleEn: 'SkyWay',
  //   component: SkyWayContainer,
  //   level: 3,
  // },
  {
    key: 'utility',
    path: UtilityPath,
    titleJp: 'ユーティリティ',
    titleEn: 'Utility',
    component: UtilityContainer,
    level: 1,
  },
  {
    key: 'qr_code',
    path: QrCodePath,
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

export {
  Routes,
  HomePath,
  ServiceWorkerCachePath,
  ServiceWorkerPath,
  ServiceWorkerPushNotificationPath,
  ServiceWorkerBackgroundSyncPath,
  WebRtcPath,
  QrCodePath,
};
