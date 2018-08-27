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
        <p><strong>hyiromori</strong> という名前で活動している、一応フルスタックエンジニアです。</p>

        <h2>スキル</h2>
        <p>Frontend 好きですが、一人でサービスを立ち上げるぐらいのことはできる感じです。</p>

        <h3>Frontend関係</h3>
        <ul>
          <li>
            <strong>ES2015</strong><br />
            モダンなFrontend開発では当たり前のように使ってます。
          </li>
          <li>
            <strong>TypeScript</strong><br />
            最近は UI が複雑になってきているので、型付け言語だとかなり開発が楽になります。
            なかなか既存のソースには入れられないですが、個人的には必ず使うようにしています。
            このサイトのソースも TypeScript で書いてます。
          </li>
          <li>
            <strong>React</strong><br />
            業務でも、個人的にも、このサイトでも使用している、一番良く使うフロントエンドフレームワークです。
            <ul>
              <li>
                <strong>+ Redux</strong><br />
                定番の組み合わせで、よく使ってきました。
                が、最近は何でも入れれば良いとは思っていません。
                使い所が大事だな〜、と感じています。
              </li>
            </ul>
          </li>
          <li><strong>Webpack</strong></li>
          <li><strong>CSS (SCSS)</strong></li>
        </ul>
        <h3>Backend関係</h3>
        <ul>
          <li>
            <strong>Ruby on Rails</strong><br />
            仕事で２年ぐらい使用しています。
            <ul>
              <li>
                <strong>Rspec</strong><br />
                Ruby のテストフレームワークの定番ですね。
                だいぶキレイに書けるようになってきましたが、<a href="https://qiita.com/jnchito/items/a90b3b09d008227d3d60">このQiitaの記事</a>も共感できます。
              </li>
            </ul>
          </li>
          <li>
            <strong>Express</strong><br />
            個人的に作る際にはミニマルで勉強になるので、よく使っています。
          </li>
          <li>
            <strong>自作Webサーバ</strong><br />
            なんちゃって Web サーバを Java で作ったこともありました。
            実運用に耐えられるレベルではないですが、HTTP の主な仕様とかを学ぶのに良かったので紹介しておきます。
          </li>
        </ul>
        <h3>Infra関係</h3>
        <ul>
          <li><strong>AWS</strong></li>
          <li><strong>Docker</strong></li>
        </ul>

        <h2>ブログとかSNSとか</h2>
        <ul>
          <li><a href="https://qiita.com/hyiromori">Qiita</a></li>
          <li><a href="https://twitter.com/hyiromori">Twitter</a></li>
          <li><a href="https://github.com/hyiromori">GitHub</a></li>
        </ul>
      </div>
    );
  }
}

export { AboutAuthorContainer };