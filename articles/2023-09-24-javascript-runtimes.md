---
title: JavaScript Runtime (Node.js, Deno, Bun)
emoji: "✨"
type: "tech"
topics: ["JavaScript", "Node.js", "Deno", "Bun"]
published: true
canonical: https://zenn.dev/mryhryki/articles/2023-09-24-javascript-runtimes
---
<!-- https://www.notion.so/mryhryki/fc2886cb306c46e4a6478ab48b03dacd -->

# はじめに

[Bun 1.0](https://bun.sh/blog/bun-v1.0) がリリースされたので、主要な3つの JavaScript Runtime のそれぞれの特徴をまとめる目的で書きました。

情報は 2023年09月時点のものです。また筆者はそれぞれの JavaScript Runtime に精通しているわけではないので、不足や間違った情報があるかもしれませんので、その点ご了承ください。不足や間違いがありましたら、コメントいただけると嬉しいです。

# JavaScript Runtime とは

JavaScript を実行する環境全般を指します。
この記事では、ブラウザを除く以下の3つの JavaScript Runtime を対象にしています。

- [Node.js](https://nodejs.org/)
- [Deno](https://deno.com/)
- [Bun](https://bun.sh/)

## JavaScript Runtime のシェア

State of JavaScript 2022 の調査結果によると、Node.js が圧倒的なシェアを持っているようです。

Node.js と比較すると Deno や Bun のシェアはまだ小さいですね。

![State of JavaScript 2022](https://mryhryki.com/file/202309060752-8e41XsWHzk-fucSWUqkUyyPGp7ooMOKk85TE5a85TJg.webp)

[State of JavaScript 2022: Other Tools](https://2022.stateofjs.com/en-US/other-tools/)

## JavaScript/TypeScript のシェア

ついでに言語そのもののシェアも気になったので調べてみました。

GitHub の調査によると、JavaScript は1位を直近8年間キープしており、TypeScript は2020年から4位を維持しています。

![The top programming languages](https://mryhryki.com/file/202309100733-ppLeboYuLmt5sGILPZAYZTBFM3mzgVRaeqQ_jSbLolM.webp)

[The top programming languages | The State of the Octoverse](https://octoverse.github.com/2022/top-programming-languages)



# Node.js

## Node.js とは

サーバーサイドや開発環境で最も使われている JavaScript の実行環境です。

一般にブラウザ以外で JavaScript を使うといえば、ほとんどの方は Node.js を思い浮かべるのではないでしょうか。以降で紹介する Deno, Bun の特徴は、基本的に「Node.js と比較した」差分というイメージになります。そのぐらい、Node.js は最もスタンダートな JavaScript Runtime と言えるでしょう。

> Node.js はクロスプラットフォームに対応したオープンソースのJavaScript実行環境です。
> 
> https://nodejs.org/ja

どこを最初のリリースとするかは難しい（後述の「Node.js v4 までの歴史」も参照してください）ですが、 [v0.1.0](https://github.com/nodejs/node/tree/v0.1.0) のコミットは 2009-06-30、[v4.0.0](https://github.com/nodejs/node/tree/v4.0.0) のコミットは 2015-10-08 でした。

## Node.js が生まれた背景

ざっくり言うと、2007年頃の [C10K問題](https://atmarkit.itmedia.co.jp/news/analysis/200701/09/c10k.html) に対する解決策として [イベントループ](https://developer.mozilla.org/ja/docs/Web/JavaScript/Event_loop) を採用した Node.js が誕生したようです。

[こちらのスライド](https://speakerdeck.com/yosuke_furukawa/dousitekounatuta-node-dot-jstoio-dot-jsfalsefen-lie-totong-he-falsexing-fang-korekaradoujin-hua-siteikufalseka?slide=27) によれば、EventLoop を実現するためのライブラリのもととなった [libebb](https://github.com/taf2/libebb) は（C10K という直接の記載こそないですが）その辺りを意識されて作られていたように見えます。EventLoop については [JavaScriptランタイム事情 2022冬 - Techtouch Developers Blog](https://tech.techtouch.jp/entry/state-of-js-runtime-2022-winter) という記事の解説がわかりやすかったです。

当然Webサーバーの用途として使えますが、それ以外でもトランスパイルやバンドル、テストランナーなど、様々な用途で使われています。

## Node.js v4 までの歴史

Node.js は当初 v0 系としてリリースされていましたが、色々とあって io.js として v1〜v3 がリリースされたようです。その後、io.js と Node.js が合流して Node.js v4 以降がリリースされた、という流れのようです。

詳しくは「[どうしてこうなった？ Node.jsとio.jsの分裂と統合の行方。これからどう進化していくのか？ - Speaker Deck](https://speakerdeck.com/yosuke_furukawa/dousitekounatuta-node-dot-jstoio-dot-jsfalsefen-lie-totong-he-falsexing-fang-korekaradoujin-hua-siteikufalseka)」<!-- Backup: https://mryhryki.com/file/202309101700-dTrZ7l8iYQtqmgVtXT-JT7fiRIMpIhlWtOkiEreRQ9A.pdf --> というスライドがわかりやすかったので、こちらも参照してみてください。

## Node.js のリリース

[nodejs/Release というリポジトリの README](https://github.com/nodejs/Release/blob/main/README.md) を見ると、リリーススケジュールや方法に関して詳細が書かれています。
簡単に概要をまとめると、以下のような感じのようです。

- 以下の３つのフェーズがある
  - Current: `main` ブランチから破壊的変更ではない変更を積極的に取りいれる
  - Active LTS: LTS チームによって、適切かつ安定していると判断された変更を取り入れる
  - Maintenance: 基本的に重要なバグ修正とセキュリティ更新のみを取り入れる
- メジャーバージョンが偶数のもののみ LTS に昇格する（奇数のものはならない）
- メジャーバージョンが偶数のバージョンは4月に、奇数のバージョンは10月にリリースされる

しっかりとしたリリーススケジュールや、役割に応じてチームが複数組まれているなど、かなりしっかりした体制が取られているな、と私は感じました。

余談ですが、[Node.js 16 の LTS サポートが 2024-04 から 2023-09-11 に変更される](https://nodejs.org/en/blog/announcements/nodejs16-eol) ということがありました。
理由として、Node.js 16 は（本当は OpenSSL3 にしたかったがリリース日の関係で）OpenSSL1.1.1 に依存しており、そのサポートが 2023-09-11 までであるためでした。他の選択肢も検討されたようですが、LTS 終了日の変更（短縮）が最もリスクが低いと判断されたようです。

こういう事態にも適切に議論をして対応を決めているんだなぁ、と感心しました。



# Deno

Deno は Node.js の作者でもある Ryan Dahl 氏が作られた JavaScript Runtime です。

> Deno (/ˈdiːnoʊ/, pronounced dee-no) is a JavaScript, TypeScript, and WebAssembly runtime with secure defaults and a great developer experience. It's built on V8, Rust, and Tokio.
>
> [Deno Runtime Quick Start | Deno Docs](https://docs.deno.com/runtime/manual)

> Deno は JavaScript、TypeScript、WebAssembly ランタイムであり、セキュアなデフォルト設定と優れた開発者エクスペリエンスを備えている。V8、Rust、Tokioをベースに構築されている。
>
> [DeepL による翻訳]

特徴としては、セキュアであることと、開発者体験を重視していることだと思います。

2018年に発表され、[v1.0.0 は 2020-05-14](https://github.com/denoland/deno/releases/tag/v1.0.0) にリリースされました。[v1.0 公開時のブログ](https://deno.com/blog/v1)もありました。

## Node.js に関する10の反省

Node.js の作者である Ryan Dahl 氏が、[「Design Mistake in Node」という発表を JS Conf EU (2018年)](https://youtu.be/M3BM9TB-8yA) で行いました。その中で Node.js に関する10の反省と、それを改善した新しい JavaScript Runtime "Deno" が発表されました。

> ...。具体的には、以下の点が指摘されました。
>
> - APIの設計において非同期処理に使うpromiseを使用しなかったこと
> - 古いGYPビルドシステムを採用したこと
> - パッケージ管理において設定ファイルのpackage.jsonとnode_modulesを採用したこと
> - モジュールのインポートで拡張子を除外したこと
> - index.jsによりモジュール依存関係の解決を採用したこと
> - JavaScriptのコアエンジンV8によるサンドボックス環境を破壊するような実装をしたこと
> 
> [世界のプログラミング言語(34) Node.jsに関する10の反省点から生まれたJS実行エンジンDeno | TECH+（テックプラス）](https://news.mynavi.jp/techplus/article/programinglanguageoftheworld-34/)

## セキュリティ

Deno はデフォルトで様々なアクセスを禁止しており、[実行時に以下のようなフラグを付ける](https://docs.deno.com/runtime/manual/basics/permissions#permissions-list) ことで許可することができるようになっています。

- `--allow-read`: ファイルシステム（読み込み）
- `--allow-write`: ファイルシステム（書き込み）
- `--allow-net`: ネットワークアクセス
- `--allow-env`: 環境変数
- `--allow-sys`: ユーザーのOSに関する情報
- `--allow-run`: サブプロセスの実行
- `--allow-ffi`: ダイナミック・ライブラリのロード
- `--allow-hrtime`: 高解像度の時刻

一部分のみ許可することも可能です。（例: `./sample.file` というファイルのみ読み取りアクセスを許可する場合）

```bash
$ deno run --allow-read="./sample.file" index.ts 
```

また開発時など安全なコンテキストで実行できる場合は、`--allow-all` または `-A` というフラグを付けることで、すべての権限を許可することもできます。

```bash
$ deno run --allow-all index.ts 
# ot
$ deno run -A index.ts 
```

一時期 Vue.js などで使われている node-ipc というライブラリが話題になったりもしました。

> 『このコードはロシアあるいはベラルーシのIPを持つユーザーを対象として、ファイルの内容を消去してハートの絵文字に上書きしてしまうというものでした。』
>
> [オープンソースのnpmパッケージ「node-ipc」にロシア在住の開発者を標的にした悪意のあるコードがメンテナーによって追加される - GIGAZINE](https://gigazine.net/news/20220322-sabotage-code-to-node-ipc/)

適切に権限を設定しておけば、こういった事象を防ぐことができます。

## TypeScript, JSX サポート

Deno は TypeScript, JSX を外部ライブラリ（`tsc`, `ts-node` など）の依存なく使用することができます。

## ツール内蔵

Deno は [フォーマッターやテストランナーなどのツールが含まれており](https://fig.io/manual/deno)、コマンドで簡単に実行できるようになっています。

```bash
$ deno fmt  # フォーマッター (例: prettier)
$ deno lint # リントツール (例: ESLint)
$ deno test # テストランナー (例: jest)
$ deno check # 型チェック (例: `tsx --noEmit`)
```

> Denoとは開発者体験(DX)にフォーカスしたJavaScript runtimeです。
>
> https://techfeed.io/entries/638d553d9317356b43b0c428

## ECMAScript & Web互換API

Deno は、ECMAScript にのみ準拠しています。Node.js などで使われている CommonJS のモジュールシステムは使用できません。

Web互換API もサポートしており `fetch` `crypto` `localStorage` などの API を使用できます。 [こちらのページ](https://deno.com/blog/every-web-api-in-deno) でサポートしている API を見ることができるようです。

## 独自のモジュールシステム

Deno は npm ではない独自のモジュールシステムを採用しています。独自の、というよりは ESModules に準拠した方法で、URL を用いてインポートが行えるといったほうが良いかもしれません。ソースコード内で直接URLを指定することもできますし、 `deno.jsonc` ファイルなどで指定することもできます。

ただし2022年8月に [大きな方針転換](https://deno.com/blog/changes) があり（[2019年](https://github.com/denoland/deno/pull/3319)頃から議論は始まっていたようです）、 [Node.js API](https://docs.deno.com/runtime/manual/node/compatibility) や [npm](https://docs.deno.com/runtime/manual/node/)、更に [package.json](https://docs.deno.com/runtime/manual/node/package_json) もサポートし、これまでの方法でも使うことができるようになってきています。（ただし前述の通り CommonJS は使えないというデメリットがあり、その場合は [esm.sh](http://esm.sh) などを経由するなどの工夫が必要になります）

### 補足: CommonJS について

最近では ECMAScript Modules (ESModules) が主流で、CommonJS が積極的に使われるケースは少ないと筆者は感じています。
それでも CommonJS で作られた過去の資産は多く、それらが使えないというのはデメリットにもなりえます。

Deno は、[CommonJS is hurting JavaScript](https://deno.com/blog/commonjs-is-hurting-javascript) というブログの投稿があり、2009年当時は CommonJS の必要性があり使われてきたが、今日では CommonJS には核心的な課題や ESModules との相互運用に課題があり、ESModules を使うことを推進しているようです。

ちなみに、私が実際に使っている Node.js のプロジェクトで deno で起動できるか試してみましたが、以下のように CommonJS に起因するエラーが発生しました。

```shell
$ deno --version
deno 1.37.0 (release, aarch64-apple-darwin)
v8 11.8.172.3
typescript 5.2.2

$ deno task "<TASK_NAME>"
...
error: Uncaught (in promise) ReferenceError: require is not defined
```

## npm サポート

Deno は npm をサポートしており、npm ライブラリを使用することができます。
以下のように記述するだけで、npm ライブラリを import できます。

```tsx
import express from "npm:express@4";
```

### 補足: npm のインポート方法

Issue を見て、Deno の npm サポートは考えられているなぁ、と思ったのでメモ。

> …
> The `npm:` specifiers are simply another URL. This does not violate any standard.
> …
> https://github.com/denoland/deno/issues/13703#issuecomment-1044717403

この `npm:{package}` は URL としてパース可能で `npm:` というスキーマをもつURLとして扱えます。

```tsx
const url = new URL('npm:express@4');
console.log(url.protocol); // => npm:
```

なので npm を特別扱いするのではなく、これまで通り URL によるインポートに `npm:` というスキーマを追加した、という位置づけになっているようです。

## Deno KV

Deno KV は Deno に組み込まれた Key-Value Database です。
現時点ではベータ版なので `--unstable` フラグが必要です。

[Deno KV Quick Start | Deno Docs](https://docs.deno.com/kv/manual) を参考に簡単なコードを作ってみました。

```typescript
const kv = await Deno.openKv();

await kv.set(["key", 1], { data: "2618a3e8-bb5a-41d9-b4d9-40adaf8cc397" });
await kv.set(["key", 2], { value: "48e1e1f2-b748-4f52-8d09-d1a11f5674b7" });

console.log('key-1:', await kv.get(["key", 1]));
console.log('key-2:', await kv.get(["key", 2]));
```

```shell
$ deno run --unstable index.ts 
key-1: {
  key: [ "key", 1 ],
  value: { data: "2618a3e8-bb5a-41d9-b4d9-40adaf8cc397" },
  versionstamp: "000000000000000b0000"
}
key-2: {
  key: [ "key", 2 ],
  value: { value: "48e1e1f2-b748-4f52-8d09-d1a11f5674b7" },
  versionstamp: "000000000000000c0000"
}
```

[set()](https://deno.land/api@v1.37.0?s=Deno.Kv&unstable=&p=prototype.set) 時に有効期限を設定することも可能なようです。
性能次第ですが、キャッシュやセッションなどでも使いやすいかもしれませんね。

次で説明する Deno Deploy でも（まだベータ版ですが）同じコードで実行できるらしく、非常に魅力的だなと感じました。

## Deno Deploy

Deno Deploy は、グローバルに展開するサーバーレスな JavaScript の実行サービスです。GitHub リポジトリと連携も可能で、容易に Web サービスがリリースができます。グローバルに配信され、ユーザーに一番近いエッジロケーションで実行される様になっています。配信されているリージョンは [こちらのドキュメント](https://docs.deno.com/deploy/manual/regions) にあります。

有料プランもありますが、個人開発レベルであれば[無料で使うことができます](https://deno.com/deploy/pricing)。

[npm サポートも（まだベータ版ですが）追加されました](https://deno.com/blog/npm-on-deno-deploy)ので、npm パッケージを使ってサービスを提供することもできるようになります。
ただし `package.json` はおそらく対応していないようなので、Node.js などのプロジェクトをちょっと手直しして動かす、などというのは現時点では難しそうです。


## Deno Land Inc.

[Deno Land Inc.](https://deno.com/company) という会社が設立され、Deno の開発が進められています。

> 開発体制の充実だけであれば基金や財団といった形でも実現できたはずです。おそらく、ビジネスを実現することこそ「Deno Company」設立の大きな目的なのでしょう。
>
> [Denoの作者ライアン・ダール氏らが「Deno Company」を立ち上げ。Denoの開発推進と商用サービスの実現へ － Publickey](https://www.publickey1.jp/blog/21/denodeno_companydeno.html)

Deno Deploy のようなサービスを提供できるのも会社化されているためとも言えるかもしれませんね。

## 他ツールとの連携

最近では、Jupyter notebook とのインテグレーションが v1.37 で入るようです。
他のエコシステムとの連携による差別化も重視しているのかもしれないな、と私は思いました。

Jupyter notebook がインストールされていれば、以下のコマンドを実行するだけでインストールされます。

```shell
$ deno jupyter --unstable # 現時点では `--unstable` が必要
```

Deno が Jupyter notebook でも使えるようになります。

![Jupyter notebook](https://mryhryki.com/file/202309222325-Uur2VRqNOU_ZQciogf4iW5MWwEDbpuG_SB6DQW3AYfk.webp)

- [Deno 1.37: Modern JavaScript in Jupyter Notebooks](https://deno.com/blog/v1.37)
- [[denoland/deno/pull/20337] feat: Add "deno jupyter" subcommand by bartlomieju](https://github.com/denoland/deno/pull/20337)
- [[denoland/deno/issues/13016] First class Jupyter notebook integration](https://github.com/denoland/deno/issues/13016)
    - Jupyter notebook で Node.js を動かすものもいくつかあるようですが、Deno は公式でサポートするところが強みになりそうです。



# Bun

> Bun is a fast, all-in-one toolkit for running, building, testing, and debugging JavaScript and TypeScript, from a single file to a full-stack application. Today, Bun is stable and production-ready.
>
> https://bun.sh/blog/bun-v1.0

> Bunは、単一のファイルからフルスタックのアプリケーションまで、JavaScriptとTypeScriptを実行、ビルド、テスト、デバッグするための高速でオールインワンのツールキットです。現在、Bunは安定しており、本番環境にも対応している。
>
> [DeepLでの翻訳]

高速性と実行に必要なすべてが揃っていることを強調している、JavaScript Runtime です。

[2022-07-06 に最初のアナウンスが Twitter (現: X)](https://twitter.com/jarredsumner/status/1544460933753229312) で行われ、[v1.0.0  は 2023-09-08](https://github.com/oven-sh/bun/releases/tag/bun-v1.0.0) にリリースされました。[v1.0 公開時のブログ](https://bun.sh/blog/bun-v1.0)もありました。

## Node.js 互換

Bun は Node.js との互換性を重視しており、多くの Node.js のアプリケーションをそのまま動かすことができます。

package.json もサポートしており、npm ライブラリも使用できます。Node.js との互換性の状況は [こちらのページ](https://bun.sh/docs/runtime/nodejs-apis) にあります。

また CommonJS と ESModules の両方にも対応しています。

## パフォーマンス

Bun は実行速度を強く押し出しており、ホームページのファーストビューにベンチマーク結果を出しています。

![benchmark](https://mryhryki.com/file/202309222352-owMq21Zlk3EqAU0NQeroNuK9emZ7zBByzHLlSWaEvBM.webp)

## TypeScript & JSX Support

Deno 同様に TypeScript, JSX をサポートしています。

## Oven

Deno と同じく、Bun は [Oven](https://oven.sh/) という会社で開発されています。Oven で Bun を焼く、というちょっと洒落た感じになっていますね。

ちなみに [Bun の発表後に Oven 社ができた](https://www.publickey1.jp/blog/22/javascriptbun9ovenci.html) ので、最初は Bun が Oven を作るみたいな構図でした。（個人的にちょっとおもしろいと感じてました）



# 考察

## 比較表

ある程度特徴として比較できるものを表でまとめます。

|                  | Node.js                                                                           | Deno                  | Bun                        |
|------------------|-----------------------------------------------------------------------------------|-----------------------|----------------------------|
| CommonJS         | Support                                                                           | -                     | Support                    |
| ECMAScript       | Support                                                                           | Support               | Support                    |
| Initial Release  | 2015-10-08 ([v4.0](https://nodejs.org/en/blog/release/v4.0.0))                    | 2020-05-14 (v1.0)     | 2023-09-08 (v1.0)          |
| TypeScript & JSX | -                                                                                 | Support               | Support                    |
| Test Runner      | ◯ [v20~](https://nodejs.dev/en/api/v20/test/)                                     | ◯                     | ◯                          |
| Linter           | -                                                                                 | ◯                     | -                          |
| Formatter        | -                                                                                 | ◯                     | -                          |
| Permission       | [Experimental](https://nodejs.org/api/permissions.html#process-based-permissions) | Support               | -                          |
| Managed Service  | -                                                                                 | Deno Deploy           | -                          |
| OS               | macOS, Linux, Windows                                                             | macOS, Linux, Windows | macOS, Linux (Windows `*`) |

`*1` Bun 1.0 リリース時に Windows が近々サポートされるとアナウンスされていました。現在は Experimental です。

## Deno から Node.js への影響

私の調べた中で影響を与えていそうだなと感じるものをピックアップします。

- パーミッションモデルの採用（Experimental）
  - [node/doc/changelogs/CHANGELOG_V20.md at main · nodejs/node](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V20.md#permission-model)
- `fetch` （Web標準）などのサポートなど
  - [node/doc/changelogs/CHANGELOG_V17.md at main · nodejs/node](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V17.md#add-fetch-api)
- テストランナーの追加
  - [Test runner | Node.js v20 API](https://nodejs.dev/en/api/v20/test/)

### 余談

Deno が Node.js の R&D (Deno で実装した機能を Node.js が取り込んで行くようなイメージ）になることを Ryan Dahl は恐れているらしいです。

（[TechFeed Experts Night#8 〜 JavaScriptランタイム戦争最前線 - TechFeed](https://techfeed.io/events/techfeed-experts-night-8) のアフタートークで聞きました）

<!-- Memo: https://www.notion.so/mryhryki/2022-11-16-Daily-Record-2022-11-16-e7cd467fdc364c019ea80ac27f9c40d8?pvs=4#991e85a9d11743ccb139c10174335a90 -->

## Bun から Deno への影響

こちらも、私の調べた中で影響を与えていそうだなと感じるものをピックアップします。

### 実行速度 

Deno は元々意識されていたが、更に高まった感じがします。

[進化するDeno in 2022 - npm互換性、パフォーマンス、開発者体験の向上など - TechFeed](https://techfeed.io/entries/638d553d9317356b43b0c428) でも出ていました。
また [同イベント](https://techfeed.io/events/techfeed-experts-night-8) のアフタートークで裏話として [Unsafe Rust](https://doc.rust-jp.rs/book-ja/ch19-01-unsafe-rust.html) を使って更に高速化をしている部分もあるという話を聞きました。

### npm サポートなど

Bun という Node.js との互換性を重視した JavaScript Runtime が出てきたことで、Deno も npm サポートなどの互換性を強化しているように感じました。
[Big Changes Ahead for Deno](https://deno.com/blog/changes)

## 各 JavaScript Runtime で使われている技術の違い

- Node.js: C++, V8
- Deno: Rust, V8
- Bun: Zig, JavaScriptCore (Webkit)

Node.js と Deno はどちらも内部で V8 (Chrome などで使われている JavaScript エンジン）を使っているので、JavaScript の実行速度はほぼ同じで、ネットワークやファイルシステムへのアクセスなどでは差が出るのでは、と想像できます。

Bun は [JavaScriptCore](https://developer.apple.com/documentation/javascriptcore) という Webkit の JavaScript エンジンを使用しています。これは Safari などで使われています。こちらは、V8 と違うので JavaScript の実行速度自体にも違いが出るかもしれません。

## 実行速度

色々な記事を調べている中で、実行速度に関して概ね以下のようになりそうな認識です。

1. Bun
2. Deno
3. Node.js

ただ、実行速度に関する情報を調べている中で、そもそもベンチマーク自体が不正確なのではないか、という話もありました。

> マイクロベンチマークしたら3倍速かったという話も見かけますが、これはソースコードのある部分の処理が局所的に3倍速いということです。ある処理はNode.jsが最速で、ある処理はDenoが最速で、ある処理はBunが最速という状況らしいので、ソースコード全体で見ると実行速度の劇的な差はそんなにない気がします。
> 
> [Node.js と Deno と Bun のどれを使えばいいのか - Qiita](https://qiita.com/access3151fq/items/2466126b612fad1c084a)

また、それ以前に、JavaScript Runtime を使う人によって用途も様々なので、全てを一括りにしてどれが一番早いかというのは難しいかもしれません。
結局のところ、自分が使っているアプリケーションで計測してみるというのが一番良いかもしれません。（互換性の問題で正確に測れない場合もあるかもしれませんが）

ちなみに、Bun は正規表現が速いらしいです。

> いくつか項目があるのですが、多くの場合RegExpRouterが速く、全てをあわせたものだとかなり差をつけて1番でした。特にBunは正規表現が速いのでBun上だと顕著です。
> 
> [Honoのv3が出ました](https://zenn.dev/yusukebe/articles/53713b41b906de)

### JavaScriptCore は V8 より速い？

大きく見ると、内部的な最適化の違いがあるようです。
ただ、例えにあるように変速ギアが多いほど速いのかは、ちょっと私には分からなかったです。
（この辺りは機会があれば調べてみたい）

> V8は3段変速ギアと表現できます。
> 
> - Ignition（1速）… 単にbytecodeを生成する
> - Sparkplug（2速）… bytecodeから変数解決/脱糖衣構文化などを実施する
> - Turbofan（3速）… 統計情報をもとに型レベルでの最適化を実施する
> 
> 一方でJSCは4段変速ギアと表現できます。
> 
> - LLInt（1速）… 単にbytecodeを生成する
> - Baseline JIT（2速… bytecodeから簡単なJIT生成コードを作る
> - DFG JIT（3速）… データフローに基づく最適化を実施し、主に戻り値の型チェックなどを行って最適化する
> - FTL JIT（4速）… SSAによる最適化（型レベルでの最適化）を実施する（V8のTurbofanと同様）
> 
> [Bunファーストインプレッション - JavaScriptランタイム界に”赤壁の戦い”を! ～TechFeed Experts Night#8講演より | gihyo.jp](https://gihyo.jp/article/2023/01/tfen005-bun)

## API互換性 (WinterCG)

WinterCG (Web-interoperable Runtimes Community Group) は、非Webブラウザを中心とした JavaScript Runtime における相互運用性の改善を目指したコミュニティグループです。
これにより、非Webブラウザ環境でのJavaScriptの実行環境の互換性が向上することが期待されます。

- https://wintercg.org/
- [Announcing the Web-interoperable Runtimes Community Group](https://deno.com/blog/announcing-wintercg)
- [Web相互運用性JavaScriptランタイムコミュニティグループ](https://blog.cloudflare.com/ja-jp/introducing-the-wintercg-ja-jp/)
- [Deno、Node.js、Cloudflare Workersなど、非Webブラウザ系JavaScriptランタイムのコード互換を目指す「Web-interoperable Runtimes Community Group」（WinterCG）が発足 － Publickey](https://www.publickey1.jp/blog/22/denonodejscloudflare_workerswebjavascriptweb-interoperable_runtimes_community_groupwintercg.html)

Node.js API への互換性が高まっているので、Node.js API をベースに互換性を高めていくように鳴なかもしれません。

- [Cloudflare WorkersがNode.js API互換の提供を発表。Bun、Denoなどに続く対応により、Node.js APIはサーバサイドJavaScriptの事実上の標準になるか － Publickey](https://www.publickey1.jp/blog/23/cloudflare_workersnodejs_apibundenonodejs_apijavascript.html)

# それぞれの使い所

あくまで個人的な意見ですので、参考程度にご覧ください。
一言で表すと、以下のような感じになるかと思います。

- `Node.js`: 信頼と実績を重視する。過去の資産を問題なく使いたい。
- `Deno`: セキュリティ・開発体験を重視する。あるいは Deno Deploy を使いたい。
- `Bun`: 実行速度を重視する。`Deno` よりもより `Node.js` との互換性を重視したい。

## Node.js

まだまだ主流の環境であり実績も豊富なので、Production 環境で使う第一選択肢ではないかと思います。

また、Deno, Bun も Node.js との互換性を高めているとはいえ、使えないケースが出てきた時はやはり Node.js を使うことになるのではないかと思います。

現時点では最も普及し実績もある JavaScript Runtime であり、Node.js をベースに考え、使える場合は Deno や Bun を使うという感じになるのではないかと思います。

## Deno

Deno はセキュリティを最初から導入したり、ESModules のみ対応するなど、理想の形から作られているランタイムだな、と感じます。（筆者個人としては好き）

Deno しかできない点としては、パーミッションを使った実行時の高いセキュリティが必要な場合は第一選択肢になるのではないかと思います。また、開発体験を重視しており、例えば開発に使われるツール（テスト、フォーマッターなど）が含まれているので、特に新規に開発する場合には有力な選択肢の一つとなるかもしれません。

デメリットとしては、最近は Node.js や npm との互換性が高まってきてはいますが、過去との互換性で問題が発生する可能性はあると思います。

またランタイムそのものではないですが、Deno Deploy が使えるというのも大きな魅力だと思います。GitHub リポジトリと連携した時のリリース体験はとても良いです。npm サポートや Deno KV を使える（ただし執筆時点でベータ版であることに注意）ので、良い選択肢になるのではないかと思います。

## Bun

Bun は現状の JavaScript (+TypeScript) の環境をまるっとサポートして Node.js からの置き換えを容易にしつつ、特に実行速度を重視しているランタイムだと感じています。

これまでの Node.js プロジェクトを比較的容易に置き換えられるのではないかと思いますが、まだ 1.0 が出たばかりでもあるので、特に Production で使うには不安かなと思います。

個人的には、個人開発や開発環境などでまず使ってみるというのは良いのではないかと思いました。`bun install` のスピード感はとても気持ち良いです。

# おわりに

主要な JavaScript Runtime が３つあると、それぞれが影響を与えて改善されている感じがしますね。JavaScript を使う開発者としては、とても嬉しいです。

Node.js を追う Deno, Bun も Node.js API や npm サポートなど、できることが似通ってきている印象を受けます。今後は、実行スピードやエコシステムが競争のポイントとなってくるのではないかな、と思います。

王者 Node.js に対し、Deno はセキュリティや開発体験、Bun は互換性や実行速度を武器に追いかける形がしばらく続くのではないかと思います。１年後とかにどうなっているのか楽しみですね。

## おまけ

### Workerd

Cloudflare Workers で使用されている JavaScript Runtime が GitHub で公開されています。
JavaScript エンジンは V8 を使用しているようです。

https://github.com/cloudflare/workerd

- [Cloudflare WorkersのJavaScript/WASMランタイム「workerd」がオープンソースで公開。NanoservicesやHomogeneous deploymentなど新技術を実装 － Publickey](https://www.publickey1.jp/blog/22/cloudflare_workersjavascriptwasmworkerdnanoserviceshomogeneous_deployment.html)
- [Cloudflare の JavaScript ランタイム「workerd」を動かしてみる](https://mryhryki.com/blog/article/2022-09-29-workerd.html) (私が書いた記事)

### "JavaScript" は Oracle の商標

Sun を買収した Oracle が "JavaScript" の商標を持っているらしい。
たぶん手放さないと思うけど、手放したら個人的には Oracle にちょっと好感持てそう。

- [Denoのライアン・ダール氏「親愛なるオラクル殿、どうかJavaScriptの商標を手放して」と呼びかけ － Publickey](https://www.publickey1.jp/blog/22/denojavascript.html)
    - 元記事: [Dear Oracle, Please Release the JavaScript Trademark](https://tinyclouds.org/trademark)

