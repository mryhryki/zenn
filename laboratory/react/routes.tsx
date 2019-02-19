import * as React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { HomeContainer } from './containers/home';
import { WebRtcContainer } from './containers/web_rtc';
import { ServiceWorkerCacheContainer } from './containers/service_worker_cache';
import { ServiceWorkerPushNotificationContainer } from './containers/service_worker_push';
import { ServiceWorkerBackgroundSyncContainer } from './containers/service_worker_background_sync';
import { QrCodeContainer } from './containers/qr_code';
import * as HeaderImage from '../../assets/images/header_images/laboratory.jpg';

const HomePath = '/';
const ServiceWorkerCachePath = '/service_worker/cache';
const ServiceWorkerPushNotificationPath = '/service_worker/push_notification';
const ServiceWorkerBackgroundSyncPath = '/service_worker/background_sync';
const WebRtcPath = '/web_rtc';
const QrCodePath = '/qr_code';

const Views: Array<{
  path: string,
  title: string,
  component: React.ComponentType<any>,
}> = [
  {
    path: ServiceWorkerCachePath,
    title: 'Service Worker - Cache API',
    component: ServiceWorkerCacheContainer,
  },
  {
    path: ServiceWorkerPushNotificationPath,
    title: 'Service Worker - Push API',
    component: ServiceWorkerPushNotificationContainer,
  },
  {
    path: ServiceWorkerBackgroundSyncPath,
    title: 'Service Worker - Background Sync API',
    component: ServiceWorkerBackgroundSyncContainer,
  },
  {
    path: WebRtcPath,
    title: 'WebRTC',
    component: WebRtcContainer,
  },
  {
    path: QrCodePath,
    title: 'QRコード',
    component: QrCodeContainer,
  },
];

const Routes = (
  <div>
    <div id="content-header">
      <img
        id="content-header-image"
        alt="Page symbol image"
        src={HeaderImage}
        decoding="async"
      />
      <div id="content-header-title-wrapper">
        <div id="content-header-title">
          hyiromori's Laboratory
        </div>
      </div>
      <div id="content-header-description">
        個人的に作成している実験プロダクト集です。
      </div>
    </div>
    <div id="main-content">
      <Router hashType="noslash">
        <Switch>
          <Route
            component={HomeContainer}
            exact
            path={HomePath}
            strict
          />
          {Views.map((view) => (
            <Route
              component={view.component}
              exact
              key={view.path}
              path={view.path}
              strict
            />
          ))}
        </Switch>
      </Router>
    </div>
  </div>
);

export {
  Views,
  Routes,
  HomePath,
  ServiceWorkerCachePath,
  ServiceWorkerPushNotificationPath,
  ServiceWorkerBackgroundSyncPath,
  QrCodePath,
  WebRtcPath,
};
