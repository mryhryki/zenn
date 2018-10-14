import * as React from 'react';
import { AbstractContainer } from '../abstract_container';
import { AccordionPanel } from '../../presenters/accordion_panel';
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

        <h2>このサイトのソース</h2>
        <p>
          <a
            href="https://github.com/hyiromori/hyiromori.github.io"
            target="_blank"
          >
            GitHub
          </a>
          にあります。
        </p>
        <p>
          <a
            href="https://qiita.com/hyiromori/items/ba099c401b281d64d1e1"
            target="_blank"
          >
            エンジニアなりにポートフォリオサイトを作ってみた話
          </a>
          という記事を
          <a
            href="https://qiita.com/hyiromori"
            target="_blank"
          >
            Qiita
          </a>
          に投稿したので、よろしければご覧ください。
        </p>

        <h2>主なスキル</h2>
        <p>勉強でちょっと触ったようなものは、見づらくなるので除外しています。</p>

        <AccordionPanel title="記載例" initialDisplay={true}>
          <ul>
            <li>{skill('バッチリ使える! :', 3, '')}</li>
            <li>{skill('まあまあ使える :', 2, '')}</li>
            <li>{skill('とりあえず使える :', 1, '')}</li>
          </ul>
        </AccordionPanel>

        <AccordionPanel title="プログラミング言語">
          <ul>
            <li>{skill('JavaScript(ES2015)', 3, '')}</li>
            <li>{skill('Ruby', 3, '')}</li>
            <li>{skill('TypeScript', 2, '')}</li>
            <li>{skill('Java', 1, '最近あまり使ってない')}</li>
          </ul>
        </AccordionPanel>

        <AccordionPanel title="フロントエンド">
          <ul>
            <li>{skill('React', 3, '')}</li>
            <li>{skill('Redux', 3, '')}</li>
            <li>{skill('Webpack', 3, '')}</li>
            <li>{skill('CSS (SCSS)', 3, '')}</li>
          </ul>
        </AccordionPanel>

        <AccordionPanel title="バックエンド">
          <ul>
            <li>{skill('Ruby on Rails', 3, '')}</li>
            <li>{skill('Rspec', 2, '')}</li>
            <li>{skill('Express', 3, '')}</li>
          </ul>
        </AccordionPanel>

        <AccordionPanel title="インフラ関係">
          <ul>
            <li>{skill('AWS (Lambda)', 3, '')}</li>
            <li>{skill('AWS (EC2)', 2, '')}</li>
            <li>{skill('AWS (Route53)', 2, '')}</li>
            <li>{skill('AWS (S3)', 2, '')}</li>
            <li>{skill('AWS (IAM)', 2, '')}</li>
            <li>{skill('AWS (DynamoDB)', 1, '')}</li>
            <li>{skill('Docker', 2, '')}</li>
          </ul>
        </AccordionPanel>

        <AccordionPanel title="データベース">
          <ul>
            <li>{skill('PosgreSQL', 3, '')}</li>
            <li>{skill('MySQL', 2, '')}</li>
            <li>{skill('Oracle 11c', 1, '')}</li>
          </ul>
        </AccordionPanel>
      </div>
    );
  }
}

export { HomeContainer };