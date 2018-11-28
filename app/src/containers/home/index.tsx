import * as React from 'react';
import { Link } from 'react-router-dom';
import { AbstractContainer } from '../abstract_container';
import {
  ServiceWorkerPath,
  SimpleChatPath,
  QrCodePath,
} from '../../routes';
import './style.scss';

interface Props {}

interface State {}

class HomeContainer extends AbstractContainer<Props, State> {
  render() {
    return (
      <div id="laboratory-container">
        <h1>hyiromori's Labo</h1>
        <p>自分の持っている技術の実験＆公開の場として作成しているページです。</p>
        <h2>一覧</h2>
        <ul>
          <li><Link to={ServiceWorkerPath}>Service Worker</Link></li>
          <li><Link to={SimpleChatPath}>簡易チャット</Link></li>
          <li><Link to={QrCodePath}>QRコード</Link></li>
        </ul>
      </div>
    );
  }
}

export { HomeContainer };