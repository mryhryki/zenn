import * as React from 'react';
import { Link } from 'react-router-dom';
import { AbstractContainer } from '../abstract_container';
import {
  ServiceWorkerPath,
  WebRtcPath,
} from '../../routes';
import './style.scss';

interface Props {}

interface State {}

class LaboratoryContainer extends AbstractContainer<Props, State> {
  render() {
    return (
      <div id="laboratory-container">
        <h1>実験室</h1>
        <p>新しい技術や気になった技術の実験に使ったものの紹介ページです。</p>
        <h2>実験一覧</h2>
        <ul>
          <li><Link to={ServiceWorkerPath}>Service Worker</Link></li>
          <li><Link to={WebRtcPath}>WebRTC (作成中)</Link></li>
        </ul>
      </div>
    );
  }
}

export { LaboratoryContainer };