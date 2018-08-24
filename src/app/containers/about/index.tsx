import * as React from 'react';
import { Link } from 'react-router-dom';
import { AbstractContainer } from '../abstract_container';
import { ServiceWorkerPath } from '../../routes';
import './style.scss';

interface Props {}

interface State {}

class AboutContainer extends AbstractContainer<Props, State> {
  render() {
    return (
      <div>
        <h1>このサイトについて</h1>
        <h2>目的</h2>
        <p>このサイトは以下の目的で公開しています。</p>
        <ul>
          <li>新しい技術のテスト</li>
          <li>スキルセットの公開</li>
        </ul>

        <h2>運営者について</h2>
        <p><strong>hyiromori</strong> という名前で活動している、(Frontend が好きな)フルスタックエンジニアです。</p>
        <p><a href="https://qiita.com/hyiromori">Qiita</a> もちょこっとだけ書いてます。</p>

        <h2>このサイトのソース</h2>
        <p><a href="https://github.com/hyiromori/hyiromori.github.io">GitHub</a> にあります。</p>
        <p>技術的な特徴としては、以下のとおりです。</p>
        <ul>
          <li><strong>SPA</strong>で作られているので、読み込み完了後はページ遷移が早いです。</li>
          <li>
            <Link to={ServiceWorkerPath}>Service Worker</Link> を使用しており、
            必要なリソースをキャッシュしているので、対応しているブラウザの場合はオフラインでも閲覧できます。
          </li>
        </ul>
      </div>
    );
  }
}

export { AboutContainer };