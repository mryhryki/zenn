import * as React from 'react';
import { Link } from 'react-router-dom';
import { AbstractContainer } from '../../abstract_container';
import {
  ServiceWorkerCachePath,
  ServiceWorkerPushPath,
  ServiceWorkerSyncPath,
} from '../../../routes';
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
        <h2>Service Worker の機能</h2>
        <p>以下のAPIが提供されています。</p>
        <ul>
          <li><Link to={ServiceWorkerCachePath}>Cache API</Link></li>
          <li><Link to={ServiceWorkerPushPath}>Push API</Link></li>
          <li><Link to={ServiceWorkerSyncPath}>Background Sync API</Link></li>
        </ul>
        <h2>もっと詳しく知りたい場合</h2>{' '}
        <p>以下の Qiita の記事をご覧ください。</p>
        <p><a href="https://qiita.com/hyiromori/items/7986a725541c97da878d">Service Worker メモ - Qiita</a></p>
      </div>
    );
  }
}

export { ServiceWorkerContainer };