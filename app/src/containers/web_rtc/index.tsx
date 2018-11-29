import * as React from 'react';
import { Link } from 'react-router-dom';
import { AbstractContainer } from '../abstract_container';
import {
  WebRtcBrowserApiPath,
  WebRtcSkyWayPath,
} from '../../routes';
import './style.scss';

interface Props {}

interface State {}

class WebRtcContainer extends AbstractContainer<Props, State> {
  render() {
    return (
      <div id="web-rtc-container">
        <h1>WebRTC</h1>
        <ul>
          <li><Link to={WebRtcBrowserApiPath}>ブラウザの API を使ったサンプル</Link></li>
          <li><Link to={WebRtcSkyWayPath}>SkyWay を使ったサンプル</Link></li>
        </ul>
      </div>
    );
  }
}

export { WebRtcContainer };