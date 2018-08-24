import * as React from 'react';
import { Link } from 'react-router-dom';
import { AbstractContainer } from '../abstract_container';
import { ServiceWorkerPath } from '../../routes';
import './style.scss';

interface Props {}

interface State {}

class AboutAuthorContainer extends AbstractContainer<Props, State> {
  render() {
    return (
      <div>
        <h1>運営者について</h1>

        <h2>自己紹介</h2>
        <p><strong>hyiromori</strong> という名前で活動している、(Frontend が好きな)フルスタックエンジニアです。</p>
        <p><a href="https://qiita.com/hyiromori">Qiita</a> もちょこっとだけ書いてます。</p>
      </div>
    );
  }
}

export { AboutAuthorContainer };