import * as React from 'react';
import { Link } from 'react-router-dom';
import { AbstractContainer } from '../abstract_container';
import { ServiceWorkerPath } from '../../routes';
import './style.scss';

interface Props {}

interface State {}

class AboutThisContainer extends AbstractContainer<Props, State> {
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

        <h2>このサイトのソース</h2>
        <p><a href="https://github.com/hyiromori/hyiromori.github.io">GitHub</a> にあります。</p>
        <p>技術的な特徴としては、以下のとおりです。</p>
        <ul>
          <li><strong>SPA</strong>で作られているので、読み込み完了後はページ遷移が早いです。</li>
          <li>
            <Link to={ServiceWorkerPath}>Service Worker</Link>
            を使用しており、必要なリソースをキャッシュしているので、対応しているブラウザの場合はオフラインでも閲覧できます。
          </li>
          <li>
            自分の技術力向上のために
            <strong>TypeScript</strong>
            <strong>React</strong>
            <strong>Webpack</strong>
            などのベースとなるもの以外は、ライブラリやフレームワークなどほぼ使用していません。
          </li>
        </ul>

        <h2>動作確認について</h2>
        <p>以下の環境で動作確認を行っています。</p>
        <ul>
          <li>Mac OS X + Chrome 最新版</li>
          <li>Mac OS X + Safari 最新版</li>
          <li>iPhone SE + Safari 最新版</li>
        </ul>
        <p>もし不具合などありましたら、左下のメール、または Twitter でご報告いただけるとありがたいです。</p>
      </div>
    );
  }
}

export { AboutThisContainer };