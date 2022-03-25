class: middle, center 
# コネヒト技術目標マルシェ

### もりやひろゆき

2022-03-28

---

## はじめに

今期は技術目標で Deno について調べたので、その概要を発表します！

---

## Deno って何？

> A modern runtime for JavaScript and TypeScript.
>
> https://deno.land/

JavaScript と **TypeScript** のモダンな実行環境です。

---

## Deno の特徴 (1)

[ライアン・ダール (Ryan Dahl）](https://ja.wikipedia.org/wiki/%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%BB%E3%83%80%E3%83%BC%E3%83%AB) 氏が Node.js の反省を元に作られている。

> DenoはJSConf EU 2018でのライアン・ダールによる講演「Node.jsに関する10の反省点」で発表された。ライアン・ダールはこの講演において、後悔しているNode.jsの初期設計での決定について言及し、以下の点を挙げている。
>
> ・APIの設計でpromiseを使用しないという選択をしたこと<br>
> ・古いGYPビルドシステムを使用するようにしたこと<br>
> ・node_modulesとpackage.jsonの採用<br>
> ・拡張子を除外したこと<br>
> ・index.jsによる魔法のようなモジュールの依存関係の解決<br>
> ・V8のサンドボックス環境の破壊<br>
> https://ja.wikipedia.org/wiki/Deno

---

## Deno の特徴 (2)

開発に便利なツールが最初から揃っている。

### コマンドの例

- フォーマッター: `deno fmt` (Node.js の場合: `prettier` など)
- リントツール: `deno lint` (Node.js の場合: `eslint` など)
- テスト: `deno test` (Node.js の場合: `jest` など)

---

## Deno の特徴 (3)

1. Node.js と同じく [V8](https://ja.wikipedia.org/wiki/V8_(JavaScript%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%B3) エンジンを使っている

    - Chromium ベースのブラウザなどで採用されている JavaScript エンジン

--
2. TypeScript がビルトイン
    - 設定しなくても TypeScript がそのまま使えます

--
3. ブラウザ互換性
    - 例えば `fetch` や `localStorage` とかが標準で使える

--
4. セキュア
    - コマンドライン引数で指定しないと、ファイルやネットワーク、環境変数へのアクセスはできない
    - コマンド例: `deno run --allow-read --allow-env=VAR_NAME index.ts`

--
5. Rust で書かれている

---

## Deno の採用例

> 新しい SDK は TypeScript を使って構築され、Deno ランタイムをターゲットにしています。
>
> https://slack.com/intl/ja-jp/blog/developers/faster-simpler-way-build-apps

<img height="200" alt="" src="https://mryhryki.com/file/VbopYPqxnY2EnOVetGxLxzopW7y.jpeg">

https://deno.com/blog/slack

---

## Deno の課題

まだライブラリとかが充実していない

- Node.js の資産は直接の互換性がない
    - https://www.skypack.dev/ や https://esm.sh/ を経由することで使える場合もある
- 現状はこのスライドとかが参考になりますね。
    - [Deno Node 両刀 - Speaker Deck](https://speakerdeck.com/mizchi/deno-node-liang-dao)
    - 個人的にはスクリプトとか書く時はめっちゃ便利です
        - 例: https://gist.github.com/mryhryki/47d83f9ecd8e75a4f034aab8d649d1b2
        - `npm install` とかビルドとかせず `deno run ...` で実行すれば依存関係とか気にせず TypeScript もすぐ動かせる

---

## 小ネタ: Deno の読み方

- [@mattn_jp: Deno なんて読む？](https://twitter.com/kt3k/status/1460571006473441289)
    - <img height="200" alt="How to pronounce deno?" src="https://mryhryki.com/file/VbpQ1FPO4hxlHi00wn8RQ4oSght.jpeg">
- [Deno - Wikipedia](https://ja.wikipedia.org/wiki/Deno)
    - 『発音はデノが近く一般的だが、ディーノと呼ばれることもある。』
- [Node.jsに関する10の反省点 - Ryan Dahl - JSConf EU - YouTube](https://youtu.be/M3BM9TB-8yA?t=1001)
    - 作者は「デノ」って言っているように聞こえるので、私は「デノ」と発音していきます。

---

## 小ネタ2: Deno の名前の由来?

<img height="400" alt="Tweet" src="https://mryhryki.com/file/Vbp4EKLsJBeE5zOiz5DtINErPUq.jpeg">

https://twitter.com/deno_land/status/1262517004159913985

---

## Deno Deploy (1)

[Deno Deploy の話 - toranoana.deno](https://talk-deploy-kt3k.deno.dev/) がわかりやすいので、そこから抜粋します。

- 2021年5月に Deno の会社 Deno Land Inc. よりベータリリースされた Web サービス
- サーバーレス関数を提供するプラットフォーム
    - AWS Lambda、Google Cloud Functions、Cloudflare Workers などと競合するサービス
- Deno Deploy と紐付けた github レポジトリに push すると自動的にそのブランチがデプロイされる
- ベータ期間中は無料。正式リリース後もある程度の無料枠がある予定。

--

### →GitHub 連携を使うとめちゃくちゃ便利！

---

## Deno Deploy (2)

- **ブログを書きました**
  - [Deno で HTTP サーバーを手軽にインターネットへ公開する](https://zenn.dev/mryhryki/articles/2022-01-03-http-server-on-deno)
- GitHub Repository
    - https://github.com/mryhryki/example-deno-http-server
- Deno Deploy Dashboard (Demo)
    - https://dash.deno.com/projects/example-deno-http-server

---

## フロントエンド開発はどこまで使える？

- **ブログを書きました**
  - [DenoでReactをビルドする](https://zenn.dev/mryhryki/articles/2022-03-24-frontend-development-on-deno)
- まだ「Deno だとこれ！」というようなものはなさそうな雰囲気です。
- これからに期待。

---
class: middle, center

# おわり

ありがとうございました！

