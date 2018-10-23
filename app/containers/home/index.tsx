import * as React from 'react';
import { AbstractContainer } from '../abstract_container';
import { AccordionPanel } from '../../presenters/accordion_panel';
import { InitialScreen } from './initial_screen';
import './style.scss';

interface Props {}

interface State {}

const skill = (name: string, stars: (1 | 2 | 3), comment: string) => (
  <li className="skill-item">
    <div>
      <strong>{name}</strong>
      {('★').repeat(stars)}
    </div>
    {comment !== '' && (<div className="comment">{comment}</div>)}
  </li>
);

class HomeContainer extends AbstractContainer<Props, State> {
  render() {
    return (
      <div id="home-container">
        <InitialScreen />

        <h2>自己紹介</h2>
        <p>
          <strong>hyiromori</strong>
          という名前で活動している、フルスタックエンジニアです。
          一通りのことができますが、特に <strong>Frontend</strong> が得意です。
          このサイトを見ての通り、細かいところもキッチリやりますが、センスよくデザインするのはできません。
        </p>

        <h2>このサイトのソース</h2>
        <p>
          <a
            href="https://github.com/hyiromori/hyiromori.github.io"
            target="_blank"
          >
            GitHub
          </a>
          にあります。
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

        <AccordionPanel
          title="記載例"
          initialDisplay={true}
        >
          <ul>
            {skill('バッチリ使える！', 3, 'ここにコメントが入ります。')}
            {skill('まあまあ使える', 2, '')}
            {skill('とりあえず使える', 1, '')}
          </ul>
        </AccordionPanel>

        <AccordionPanel title="プログラミング言語">
          <ul>
            {skill('JavaScript(ES2015)', 3, '公私共に使っています。特に個人ではほとんどこれか TypeScript しか使っていません。')}
            {skill('TypeScript', 2, '個人的に最近使いたい言語 No.1。UI は複雑になりがちなので、型があると本当に助かります。')}
            {skill('Ruby', 3, '主に使うスクリプト言語はこれ。Python もやってみたいけど、まだやるモチベーションがないです。')}
            {skill(
              'Java',
              1,
              'Reflection や Unsafe を使いこなすぐらいにやっていたのですが、最近あまり使ってないです。たぶんやれば思い出せるはず。',
            )}
          </ul>
        </AccordionPanel>

        <AccordionPanel title="フロントエンド">
          <ul>
            {skill('React', 3, '')}
            {skill('Redux', 3, '')}
            {skill('Webpack', 3, '')}
            {skill('CSS (SCSS)', 3, '')}
          </ul>
        </AccordionPanel>

        <AccordionPanel title="バックエンド">
          <ul>
            {skill('Ruby on Rails', 3, '')}
            {skill('Rspec', 2, '')}
            {skill('Express', 3, '')}
          </ul>
        </AccordionPanel>

        <AccordionPanel title="インフラ関係">
          <ul>
            {skill('AWS', 2, 'EC2、Lambda、S3、DynamoDB、Route53、SES あたりを使っています。そこまで深くはやっていません。')}
            {skill('Docker', 2, 'Dockerfile 書いてイメージ作成するぐらいはできます。')}
          </ul>
        </AccordionPanel>

        <AccordionPanel title="データベース">
          <ul>
            {skill('PosgreSQL', 2, '')}
            {skill('MySQL (MariaDB)', 2, '')}
            {skill('Oracle 11c', 1, '2015年に Oracle Master Silver 11c を取得しましたが、実戦経験はほとんど無いです。')}
          </ul>
        </AccordionPanel>
      </div>
    );
  }
}

export { HomeContainer };