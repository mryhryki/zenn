import * as React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import {
  ServiceWorkerPath,
  Views,
  ServiceWorkerCachePath,
  ServiceWorkerPushNotificationPath,
  ServiceWorkerBackgroundSyncPath,
  WebRtcSkyWayPath,
  QrCodePath,
  WebRtcBrowserApiPath,
} from '../../routes';

interface Props {}

interface State {}

class HomeContainer extends React.Component<Props, State> {
  render() {
    // 暫定対応
    const views = Views.filter((view) => {
      switch (view.path) {
        case ServiceWorkerPath:
        case ServiceWorkerCachePath:
        case ServiceWorkerPushNotificationPath:
        case ServiceWorkerBackgroundSyncPath:
        case WebRtcBrowserApiPath:
        case WebRtcSkyWayPath:
        case QrCodePath:
          return true;
        default:
          return false;
      }
    });

    return (
      <div>
        <h2>実験プロダクト一覧（整備中...）</h2>
        <ul>
          {views.map((view) => (
            <li key={view.path}>
              <Link to={view.path}>
                {view.titleJp}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export { HomeContainer };
