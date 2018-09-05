import * as React from 'react';
import { Link } from 'react-router-dom';
import { AbstractContainer } from '../abstract_container';
import { ServiceWorkerPath } from '../../routes';
import './style.scss';

interface Props {}

interface State {}

const skill = (name: string, stars: (1 | 2 | 3), comment: string) => (
  <span>
    <strong>{name}</strong>
    {('★').repeat(stars)}
  </span>
);

class HomeContainer extends AbstractContainer<Props, State> {

  render() {
    return (
      <div>
        <h1>Portfolio</h1>

        <h2>自己紹介</h2>
        <p><strong>hyiromori</strong> という名前で活動している、フルスタックエンジニアです。</p>

        <h2>スキル</h2>
        <p>主だったものだけ。勉強がてらちょこっと触ったようなものは、見づらくなるので除外しています。</p>
        <p>フロントエンド周りが強い＆好きな分野です。</p>

        <h4>判例</h4>
        <ul>
          <li>{skill('バッチリ使える！：', 3, '')}</li>
          <li>{skill('まあまあ使える　：', 2, '')}</li>
          <li>{skill('とりあえず使える：', 1, '')}</li>
        </ul>

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
          <li>iPhone SE + Safari 最新版</li>
        </ul>
        <p>もし不具合などありましたら、左下のメール、または Twitter でご報告いただけるとありがたいです。</p>

        <h2>ブログとかSNSとか</h2>
        <p>フッターの左にもリンクがあります。</p>
        <ul>
          <li><a href="https://qiita.com/hyiromori">Qiita</a></li>
          <li><a href="https://twitter.com/hyiromori">Twitter</a></li>
          <li><a href="https://github.com/hyiromori">GitHub</a></li>
        </ul>
      </div>
    );
  }
}

export { HomeContainer };