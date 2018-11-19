import * as React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';
import { CommonFrame } from './containers/common_frame';
import { HomeContainer } from './containers/home';
import { LaboratoryContainer } from './containers/laboratory';
// import { WebRtcContainer } from './containers/laboratory/web_rtc';
// import { SkyWayContainer } from './containers/laboratory/web_rtc/sky_way';
import { SimpleChatContainer } from './containers/laboratory/simple_chat';
import { ServiceWorkerContainer } from './containers/laboratory/service_worker';
import { ServiceWorkerCacheContainer } from './containers/laboratory/service_worker/cache';
import { ServiceWorkerPushNotificationContainer } from './containers/laboratory/service_worker/push_notification';
import { ServiceWorkerBackgroundSyncContainer } from './containers/laboratory/service_worker/background_sync';
import { QrCodeContainer } from './containers/utility/qr_code';

const HomePath = '/';
const ServiceWorkerPath = '/service_worker';
const ServiceWorkerCachePath = '/service_worker/cache';
const ServiceWorkerPushNotificationPath = '/service_worker/push_notification';
const ServiceWorkerBackgroundSyncPath = '/service_worker/background_sync';
// const WebRtcPath = '/web_rtc';
// const WebRtcSkyWayPath = '/web_rtc/sky_way';
const SimpleChatPath = '/simple_chat';
const QrCodePath = '/qr_code';

const Views: Array<{
  path: string,
  titleJp: string,
  titleEn: string,
  component: React.ComponentType<any>,
  level: number
}> = [
  {
    path: HomePath,
    titleJp: 'ホーム',
    titleEn: 'Home',
    component: LaboratoryContainer,
    level: 1,
  },
  {
    path: ServiceWorkerPath,
    titleJp: 'サービスワーカー',
    titleEn: 'Service Worker',
    component: ServiceWorkerContainer,
    level: 1,
  },
  {
    path: ServiceWorkerCachePath,
    titleJp: 'キャッシュAPI',
    titleEn: 'Cache API',
    component: ServiceWorkerCacheContainer,
    level: 2,
  },
  {
    path: ServiceWorkerPushNotificationPath,
    titleJp: 'プッシュ通知API',
    titleEn: 'Push Notification API',
    component: ServiceWorkerPushNotificationContainer,
    level: 2,
  },
  {
    path: ServiceWorkerBackgroundSyncPath,
    titleJp: 'バックグラウンド同期API',
    titleEn: 'Background Sync API',
    component: ServiceWorkerBackgroundSyncContainer,
    level: 2,
  },
  // {
  //   path: WebRtcPath,
  //   titleJp: 'WebRTC',
  //   titleEn: 'WebRTC',
  //   component: WebRtcContainer,
  //   level: 1,
  // },
  // {
  //   path: WebRtcSkyWayPath,
  //   titleJp: 'SkyWayを使ったサンプル',
  //   titleEn: 'SkyWay',
  //   component: SkyWayContainer,
  //   level: 2,
  // },
  {
    path: SimpleChatPath,
    titleJp: '簡易チャット',
    titleEn: 'Simple Chat',
    component: SimpleChatContainer,
    level: 1,
  },
  {
    path: QrCodePath,
    titleJp: 'QRコード',
    titleEn: 'QR Code',
    component: QrCodeContainer,
    level: 1,
  },
];

const menuList = Views.map((view) => ({
  path: view.path,
  titleJp: view.titleJp,
  titleEn: view.titleEn,
  level: view.level,
}));

const Routes = (
  <Router hashType="noslash">
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
  SimpleChatPath,
  QrCodePath,
};
