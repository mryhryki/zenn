import * as React from 'react';
import { Link } from 'react-router-dom';
import { AbstractContainer } from '../abstract_container';
import './style.scss';

interface Props {}

interface State {}

class ServiceWorkerContainer extends AbstractContainer<Props, State> {
  render() {
    return (
      <div id="service-worker-container">
        <h1>Service Worker</h1>
        <h2>Service Worker とは？</h2>
        <p>
          ブラウザのバックグランドで実行される JavaScript の実行環境です。
          ページのライフサイクルとは「別」のライフサイクルを持ちます。
        </p>
        <h2>Service Worker にはどんな機能があるの？</h2>
        <p>以下のAPIが提供されています。</p>
        <ul>
          <li><Link to="/service_worker/cache">Cache API</Link></li>
          <li><Link to="/service_worker/push">Push API</Link></li>
          <li><Link to="/service_worker/background_sync">Background Sync API</Link></li>
        </ul>
        <h2>もっと詳しく知りたい場合</h2>
        <p>以下の Qiita の記事をご覧ください。</p>
      </div>
    );
  }
}

export { ServiceWorkerContainer };