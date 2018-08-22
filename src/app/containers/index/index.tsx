import * as React from 'react';
import { AbstractContainer } from '../abstract_container';
import './style.scss';

interface Props {}

interface State {}

class IndexContainer extends AbstractContainer<Props, State> {
  render() {
    return (
      <div>
        <h1>はじめに</h1>
        <h2>運用者</h2>
        <p>このWebページは hyiromori によって運営されています</p>
        <h2>目的</h2>
        <p>このWebページは、以下の目的で公開しています。</p>
        <ol>
          <li>新しい技術のテスト</li>
          <li>スキルセットの公開</li>
        </ol>
      </div>
    );
  }
}

export { IndexContainer };