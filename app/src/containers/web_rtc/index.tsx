import * as React from 'react';
import { AbstractContainer } from '../abstract_container';
import './style.scss';

interface Props {}

interface State {}

class WebRtcContainer extends AbstractContainer<Props, State> {
  render() {
    return (
      <div id="web-rtc-container">
        <h1>WebRTC</h1>
        <h2>WebRTCとは？</h2>
        <p><strong>作成中</strong></p>
      </div>
    );
  }
}

export { WebRtcContainer };