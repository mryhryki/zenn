import * as React from 'react';
import { Link } from 'react-router-dom';
import { AbstractContainer } from '../abstract_container';
import { QrCodePath } from '../../routes';
import './style.scss';

interface Props {}

interface State {}

class UtilityContainer extends AbstractContainer<Props, State> {
  render() {
    return (
      <div id="utility-container">
        <h1>ユーティリティ</h1>
        <p>個人的にあると便利なツールを置いたページです。</p>
        <h2>ユーティリティ一覧</h2>
        <ul>
          <li><Link to={QrCodePath}>QR Code</Link></li>
        </ul>
      </div>
    );
  }
}

export { UtilityContainer };