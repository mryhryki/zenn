import * as React from 'react';
import { Link } from 'react-router-dom';
import { AbstractContainer } from '../abstract_container';
import { ServiceWorkerPath } from '../../routes';
import { InitialScreen } from './initial_screen';
import { SessionStorage } from '../../common/storage';
import './style.scss';

interface Props {}

interface State {
  showInitialScreen: boolean,
}

const SHOWED_INITIAL_SCREEN_KEY = 'home.showed_initial_screen';

const skill = (name: string, stars: (1 | 2 | 3), comment: string) => (
  <span>
    <strong>{name}</strong>
    {('★').repeat(stars)}
  </span>
);

class HomeContainer extends AbstractContainer<Props, State> {
  state: State = {
    showInitialScreen: (SessionStorage.get(SHOWED_INITIAL_SCREEN_KEY) !== 'true'),
  };

  hideInitialScreen = (): void => {
    SessionStorage.set(SHOWED_INITIAL_SCREEN_KEY, 'true');
    this.setState({ showInitialScreen: false });
  };

  render() {
    const { showInitialScreen } = this.state;

    return (
      <div id="home-container">
        {showInitialScreen && (
          <InitialScreen onAnimationFinish={this.hideInitialScreen} />
        )}

        <div id="header">
          <span id="title">Portfolio</span>
          <br />
          <span id="by-name">by hyiromori</span>
        </div>

        <h2>自己紹介</h2>
        <p><strong>hyiromori</strong>という名前で活動している、フルスタックエンジニアです。</p>
        <p>
          <a
            href="https://qiita.com/hyiromori"
            target="_blank"
          >
            Qiita
          </a> にも少しだけ記事を投稿しています。
        </p>

        <h2>スキル</h2>
        <p>主だったものだけ。勉強でちょっと触ったようなものは、見づらくなるので除外しています。</p>
        <p>フロントエンドが得意＆好きな分野です。</p>

        <div id="skill-example">
          <h3>記載例</h3>
          <ul>
            <li>{skill('バッチリ使える! :', 3, '')}</li>
            <li>{skill('まあまあ使える :', 2, '')}</li>
            <li>{skill('とりあえず使える :', 1, '')}</li>
          </ul>
        </div>

        <h3>プログラミング言語</h3>
        <ul>
          <li>{skill('JavaScript(ES2015)', 3, '')}</li>
          <li>{skill('Ruby', 3, '')}</li>
          <li>{skill('TypeScript', 2, '')}</li>
          <li>{skill('Java', 1, '最近あまり使ってない')}</li>
        </ul>

        <h3>フロントエンド</h3>
        <ul>
          <li>{skill('React', 3, '')}</li>
          <li>{skill('React+Redux', 3, '')}</li>
          <li>{skill('Webpack', 3, '')}</li>
          <li>{skill('CSS (SCSS)', 3, '')}</li>
        </ul>

        <h3>バックエンド</h3>
        <ul>
          <li>{skill('Ruby on Rails', 3, '')}</li>
          <li>{skill('Rspec', 2, '')}</li>
          <li>{skill('Express', 3, '')}</li>
        </ul>

        <h3>インフラ関係</h3>
        <ul>
          <li>{skill('AWS (Lambda)', 3, '')}</li>
          <li>{skill('AWS (EC2)', 2, '')}</li>
          <li>{skill('AWS (Route53)', 2, '')}</li>
          <li>{skill('AWS (S3)', 2, '')}</li>
          <li>{skill('AWS (IAM)', 2, '')}</li>
          <li>{skill('AWS (DynamoDB)', 1, '')}</li>
          <li>{skill('Docker', 2, '')}</li>
        </ul>

        <h3>データベース</h3>
        <ul>
          <li>{skill('PosgreSQL', 3, '')}</li>
          <li>{skill('MySQL', 2, '')}</li>
          <li>{skill('Oracle 11c', 1, '')}</li>
        </ul>

        <h2>このサイトのソース</h2>
        <p>
          <a
            href="https://github.com/hyiromori/hyiromori.github.io"
            target="_blank"
          >
            GitHub
          </a>
          にあります。以下の技術的な特徴があります。</p>
        <ul>
          <li><strong>SPA</strong>で作られているので、読み込み完了後はページ遷移が早いです。</li>
          <li>
            <Link to={ServiceWorkerPath}>Service Worker</Link>
            を使用しており、必要なリソースをキャッシュしているので、対応しているブラウザの場合はオフラインでも閲覧できます。
          </li>
          <li>
            技術力向上のために、ライブラリはほぼ使用していません。
          </li>
          <li>
            同じく、技術力向上のために、CSS フレームワークも使用していません。
            このサイトは自力でレスポンシブ対応しています。
          </li>
        </ul>

        <h3>動作確認について</h3>
        <p>以下の環境で動作確認を行っています。</p>
        <ul>
          <li>Mac OS X + Chrome 最新版</li>
          <li>iPhone SE + Safari 最新版</li>
        </ul>
      </div>
    );
  }
}

export { HomeContainer };