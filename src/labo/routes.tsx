import * as React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';
import { CommonFrame } from './containers/common_frame';
import { HomeContainer } from './containers/home';
import { WebRtcContainer } from './containers/web_rtc';
import { BrowserApiContainer } from './containers/web_rtc/browser_api';
import { SkyWayContainer } from './containers/web_rtc/sky_way';
import { SimpleChatContainer } from './containers/simple_chat';
import { ServiceWorkerContainer } from './containers/service_worker';
import { ServiceWorkerCacheContainer } from './containers/service_worker/cache';
import { ServiceWorkerPushNotificationContainer } from './containers/service_worker/push_notification';
import { ServiceWorkerBackgroundSyncContainer } from './containers/service_worker/background_sync';
import { QrCodeContainer } from './containers/qr_code';

const HomePath = '/';
const ServiceWorkerPath = '/service_worker';
const ServiceWorkerCachePath = '/service_worker/cache';
const ServiceWorkerPushNotificationPath = '/service_worker/push_notification';
const ServiceWorkerBackgroundSyncPath = '/service_worker/background_sync';
const WebRtcPath = '/web_rtc';
const WebRtcBrowserApiPath = '/web_rtc/browser_api';
const WebRtcSkyWayPath = '/web_rtc/sky_way';
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
    component: HomeContainer,
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
  {
    path: WebRtcPath,
    titleJp: 'WebRTC',
    titleEn: 'WebRTC',
    component: WebRtcContainer,
    level: 1,
  },
  {
    path: WebRtcBrowserApiPath,
    titleJp: 'ブラウザ API を使ったサンプル',
    titleEn: 'Browser API',
    component: BrowserApiContainer,
    level: 2,
  },
  {
    path: WebRtcSkyWayPath,
    titleJp: 'SkyWayを使ったサンプル',
    titleEn: 'SkyWay',
    component: SkyWayContainer,
    level: 2,
  },
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
  WebRtcPath,
  WebRtcBrowserApiPath,
  WebRtcSkyWayPath,
};
