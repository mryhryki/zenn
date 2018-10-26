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
            {skill('バッチリ使える！', 3, '３つ星は、経験が多い、理解が深い、大抵のことはできる、という感じです。')}
            {skill('まあまあ使える', 2, '２つ星は、そこそこ経験がある、ある程度理解していると言える、基本的なことはできる、という感じです。')}
            {skill('とりあえず使える', 1, '１つ星は、経験が浅い、なんとなく理解している程度、調べながらなら使える、という感じです。')}
          </ul>
        </AccordionPanel>

        <AccordionPanel title="プログラミング言語">
          <ul>
            {skill('JavaScript(ES2015)', 3, '公私共に使っています。特に個人ではほとんどこれか TypeScript しか使っていません。')}
            {skill('TypeScript', 2, '個人的に最近使いたい言語 No.1。UI は複雑になりがちなので、型があると本当に助かります。ただ、まだ型を使いこなせるレベルには達していないです。')}
            {skill('CSS (SCSS)', 3, 'フロントエンド開発するならもはや必須です。SASS 記法は好きではないです。')}
            {skill('Ruby', 3, '主に使うスクリプト言語はこれです。Python もやってみたいけど、まだやるモチベーションがないです。')}
            {skill(
              'Java',
              3,
              'Reflection や Unsafe を使いこなすぐらいにやっていました。ただ、最近あまり使ってないです。たぶんやれば思い出せるはず。',
            )}
          </ul>
        </AccordionPanel>

        <AccordionPanel title="フロントエンド">
          <ul>
            {skill(
              'React',
              3,
              '最も慣れているフロントエンドフレームワークです。Angular や Vue は今のところやるモチベーションが無いので、ちょこっとチュートリアルを触ったことがある程度です。',
            )}
            {skill('Redux', 3, '大規模なアプリでは役立つと思いつつ、何でもかんでも入れるべきものではないと思っています。このサイトでは使っていません。要は使い所が大事です。')}
            {skill('Webpack', 3, '最近はこれがないとフロントエンド開発が無理っていう気がしています。webpack-dev-server もよく使ってます。')}
          </ul>
        </AccordionPanel>

        <AccordionPanel title="バックエンド">
          <ul>
            {skill('Ruby on Rails', 3, 'ちゃんとレールに乗った使い方をするなら、とても使いやすいです。')}
            {skill('Rspec', 2, 'Rails のテストに使ってます。最近は Rspec っぽい書き方ができるようになってきたと自負しています。')}
            {skill('Express', 3, '個人的に使っていて、軽量で色々自由が効くので好きなフレームワークです。')}
          </ul>
        </AccordionPanel>

        <AccordionPanel title="インフラ関係">
          <ul>
            {skill('AWS', 2, 'EC2、Lambda、S3、DynamoDB、Route53、SES あたりを使っています。そこまで深くはやっていません。')}
            {skill('Docker', 2, 'Dockerfile 書いてイメージ作成したり、開発環境を docker-compose で作ったりするぐらいはできます。')}
          </ul>
        </AccordionPanel>

        <AccordionPanel title="データベース">
          <ul>
            {skill('PosgreSQL', 2, '個人的になんとなく好きで、なんとなくずっと使っています。MySQL よりキッチリしている印象があるためですが、そこまで違いに詳しくもないです。')}
            {skill('MySQL (MariaDB)', 2, 'LAMP が流行っていた時代に使っていて、今は仕事で使っています。')}
            {skill('Oracle 11c', 1, '2015年に Oracle Master Silver 11c を取得しましたが、実戦経験はほとんど無いです。')}
          </ul>
        </AccordionPanel>
      </div>
    );
  }
}

export { HomeContainer };