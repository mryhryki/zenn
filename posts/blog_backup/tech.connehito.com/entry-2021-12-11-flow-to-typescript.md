# ママリの WebView を JavaScript + Flow から TypeScript に移行しました

これは [コネヒト Advent Calendar 2021](https://qiita.com/advent-calendar/2021/connehito) 11日目の記事です。

こんにちは！ フロントエンドエンジニアの[もりや](https://mryhryki.com/)です。
今回はママリのアプリ内で使われている WebView を JavaScript + [Flow](https://flow.org/) から [TypeScript](https://www.typescriptlang.org/) に移行した事例を紹介します。



## WebView の課題

今までママリ内で使われている WebView は JavaScript + Flow で実装されていました。

しかし [State of JS 2020](https://2020.stateofjs.com/en-US/technologies/javascript-flavors/) の結果からも分かるように現在は TypeScript の人気が高く、実際コネヒトでも新規プロジェクトでは TypeScript が使われています。
開発体験としても TypeScript の方がよく、ツールチェインやライブラリの型定義の充実度も圧倒的です。現在、新規で何かを作るなら Flow を選ぶ積極的な理由はないと私は思います。

また Flow の問題ではないですが、以前から `// @flow` の漏れなどで Flow のチェックが上手く機能してなさそうという課題もありました。
ここだけ直すこともできますが、全体を直すなら合わせて TypeScript にしたいとなりました。

これらの理由により、WebView を JavaScript + Flow から TypeScript 化する流れになりました。



## TypeScript 化の概要

2021年4月〜12月にかけて実施したプロジェクトです。
ただし `@ts-ignore` や `any` などでエラーを抑制している部分もあり、完全に移行が終わったわけではありません。
まだ Storybook など一部 JavaScript ファイルが残っている状況です。

TypeScript 移行中でも、開発は並行して行っていました。
対応する開発者も、メインとなる開発業務とは別に、業務時間の 10% 程度の時間をとって進めていました。

全部で４名の開発者が関わっています。
私はその中でも中心的な役割で、作戦を立てたり初期設定を主導して進め、TypeScript 化の作業も半分以上をやっていました。

### TypeScript 化の規模

[tokei](https://github.com/XAMPPRocky/tokei) で計測してます。

#### TypeScript 化前

| 言語 | ファイル数 | 行数 |
| --- | ---: | ---: |
| JavaScript | 387ファイル | 20,546行 |
| TypeScript | 0ファイル | 0行 |

#### TypeScript 化後

| 言語 | ファイル数 | 行数 |
| --- | ---: | ---: |
| TypeScript | 448ファイル | 30,140行 |
| JavaScript | 31ファイル | 1,175行 |

- ファイル数が増えているのは、TypeScript 化の途中でも機能開発していたためです。



## TypeScript 化の作戦

### 一括置換（失敗）

まず最初に、拡張子と変換が必要な特定の型定義パターン（例： `?string` を `string | null | undefined` に変更するなど）を機械的に変換する方法を試しました。

結論から言うと、これは失敗に終わりました。
原因としては、Flow がきちんと機能していない、という課題に起因しています。

一見定義されて動きそうに見えても `@flow` の定義漏れなどで `any` のように扱われてしまっている箇所がいくつもありました。
そのため TypeScript 化し、きちんとチェックが走ることによってエラーが多発してしまうという状況でした。
ある程度機械的に置き換えられるものを置き換えた後でも数百件のエラーがありました。

また型を外すということも考えましたが、Flow の定義が役に立つ場面もあり、これまでの資産がなくなってしまうのもやめたい、という事情もありました。
（Flow を導入していない、純粋な JavaScript であればもっと簡単だったと思います）

そういった事情から、一度に全部を変換することもそれをレビューすることも難しいですし、リリースしても何かが起きれば一気にふりだしに戻ってしまうので、この作戦は諦めました。

### 一つずつ手動変換（採用）

最終的に開発者が一つずつ JavaScript を TypeScript に変換していく作戦にしました。
数も多いので大変なことは予想していましたが、これが現状取れる手の中で最善と判断しました。



## TypeScript 化の対応

ファイルを一つずつ TypeScript 化していく方針を立てたので、次は TypeScript と JavaScript + Flow を共存していくための対応をしました。

WebView はアプリ内で変更が多い画面などによく使われており、長期間開発を止めるのは難しいので、混在した状態でもビルドができるようにしなければならないためです。

### Webpack の設定

まずビルドで使っている Webpack の設定を更新します。

依存パッケージに [typescript](https://www.npmjs.com/package/typescript) と [ts-loader](https://www.npmjs.com/package/ts-loader) を追加し、`webpack.config.js` に以下の設定を追加します。

```diff
+ {
+   test: /\\.tsx?$/,
+   include: path.resolve(__dirname, 'assets'),
+   use: ['babel-loader', 'ts-loader']
+ },
```

これで `.ts` `.tsx` ファイルをビルドできるようになりました。

### import 文の対応

JavaScript + Flow ↔ TypeScript 間でファイルを `import` しようとするとそれぞれ型エラーが出ます。
それぞれ以下の方法でエラーを抑制しました。
（抑制しただけで、それぞれの間で型情報を引き継げるわけではありません）

#### JavaScript から TypeScript のファイルを参照する場合

この場合は Flow がエラーを出します。

対応としては、まず `TSFlowStub.js.flow`  というスタブ用のファイルを配置して、中身を以下のようにします。

```javascript
export default {};
```

そして `.flowconfig` に以下の指定を追加します。

```diff
+ module.name_mapper.extension='ts' -> '<PROJECT_ROOT>/TSFlowStub.js.flow'
+ module.name_mapper.extension='tsx' -> '<PROJECT_ROOT>/TSFlowStub.js.flow'
```

最後に JavaScript ファイルを読み込む時に、拡張子 `.ts`  または `.tsx` を参照します。
すると Flow は自動的に `TSFlowStub.js.flow` の型を参照してくれるので、エラーが出なくなります。

```javascript
import foo from './foo.ts'
```

#### TypeScript から JavaScript のファイルを参照する場合

このパターンは `@ts-ignore` で抑制しました。
（これで Webpack はエラー無くビルドしてくれました）

```typescript
// @ts-ignore
import foo from './foo'
```

### 自動テストの対応

一旦テスト自体を止める、という判断をしました。

共存する設定も試してみたのですが、大掛かりになって時間がかなり掛かりそうでした。

もともと10ファイル程度しかなく、あまり変更が入らないものが多かったので、共存する設定をするよりも止めておくほうがよいと判断しました。

### スクリーンショット比較テストの導入

先に書いたとおり、ママリの WebView のフロントエンドのテストはほとんど無く、開発者による手動テストに頼っていました。
なので、TypeScript 化による意図しない変更に気付けるようなテストを入れておきたいと考えました。

ただテストの導入にコストをかけすぎると TypeScript 化が進まないので、なるべくコスパ的に良いテストを探していました。
検討した結果、主要な画面のスクリーンショットをとって、変更がないかをチェックするものであれば導入のコストが低く、効果も高いと考えました。

具体的には [cypress](https://www.cypress.io/) と [cypress-image-diff-js](https://www.npmjs.com/package/cypress-image-diff-js) というライブラリを使って、Chrome で主要な画面をスクリーンショットでの比較をするテストを、Pull Request ごとに GitHub Actions 上で実行するようにしました。
（キャンペーン用ページなど一時的に使って、今は使わない画面などはチェックの時間が増えるだけなので除外しました）

これにより、主要な画面が表示できて変更がないことを自動でチェックできるようになり、一定の安心感ができました。
また、テストが失敗した場合でもスクショと差分をアーティファクトとしてアップロードするようにしたので、どこが失敗したのかも見れるようにしています。

ちなみに WebView なので、当初は TestCafe を使って iOS の環境に近い Safari 上でのテストもしたかったのですが、時々テストが止まってしまうという不具合が起きていたので、一旦諦めました。
毎回ではなく時々止まる、という症状で原因の特定が難しく、あまり時間もかけたくなかったので、詳しい原因までは探れていないです。

### ESLint のアップデート

弊社では [@connehito/eslint-config](https://www.npmjs.com/package/@connehito/eslint-config) という ESLint の設定を OSS として公開していて、Flow 用の v1 系から、TypeScript に対応した v2 系にアップデートしました。

Flow と TypeScript が共存していて書き方が違うものなので、そのあたりを考えてやりました。
１つの Pull Request でやってしまい、かなり Diff が大きくなってしまったのは反省ポイントです・・・。（ほんとすみません。レビューありがとうございました）

![https://mryhryki.com/file/bWB6Ftu3-y5cGc2BBpwbLxRvAnhEl-7.png](https://mryhryki.com/file/bWB6Ftu3-y5cGc2BBpwbLxRvAnhEl-7.png)

↓ Pull Request に大まかな変更のポイントを書いていましたので、ついでに載せておきます。

![https://mryhryki.com/file/bWB6G3hu0ChMHuS5xdkMMeDTBvhpmf7.png](https://mryhryki.com/file/bWB6G3hu0ChMHuS5xdkMMeDTBvhpmf7.png)

ちなみに、今までは CI で ESLint によるチェックが行われていなかったので、CI でチェックする対応もしました。



## TypeScript 化の作業方針

最初の設定が終わってしまえば、あとは JavaScript + Flow のファイルを TypeScript に変更していくだけです。
ここでは実際に作業する中でできた方針について書いていきます。

### 依存関係が少ないものから順にやる

他のファイルへの依存がない・少ないファイルの方がやりやすいので、分担してそういったファイルから進めてていきました。

具体例としては、API リクエストやユーティリティ関数などを最初に進めました。

### 型定義をしながら進める

当初は `any` や `object` などで曖昧になっていた部分を、なるべく型定義を追加しつつ TypeScript 化していきました。

特に API レスポンスは、今まで Markdown でドキュメント化はしていたものの、コード上では何の型定義もできていませんでした。

ここの定義を追加することで、アプリ内で使われるデータのチェックや IDE による補完も効くようになり、かなり開発体験が向上しました。

### 方針転換：とにかく進める

最初は型定義を拡充していましたが、本丸である UI 系のコードに入ってくると型定義的に不整合が起きる場面が増えてきました。Flow がきちんとチェックされていない影響は、特にこの辺りで大きかったです。

具体例として、例えば配列が渡ってくる場合 JavaScript のプリミティブな配列なのか Immutable.js のリストなのかが合致していない、などがありました。
極端な場合、どちらが来ても動くようになってて、動かしてログに出さないとどちらを期待しているのかがわからないという状況などもありました。

UI のコードは一番ファイル数的に大きいので、あまりコストを掛けてやると終わらない見通しになってきました。
また影響範囲もその画面、その部分でとどまる場合が多いので、一旦は動いているものを正として、 `eslint-disable` や `@ts-ignore` でのチェック抑制をして進めました。

きちんとした対応をしようとすると、おそらく今年度中には終わっていなかったと思います。

### おまけ：ネイティブとの連携箇所でのエラー

WebView から FireBase の機能を呼び出す際は、ネイティブ側と連携して動作しています。
その呼び出し関数を、一度変数への代入を使うとエラーが発生するという不具合がありました。

```typescript
// iOS の例
const { postMessage } = window.webkit?.messageHandlers?.firebase ?? {}
if (postMessage != null) {
  postMessage(...)
}
```

推測ですが `window.webkit.messageHandlers.firebase.postMessage` という関数が呼ばれた時にネイティブ側がハンドリングしているものと思われます。

しかし `?.` を使うと、一度変数に入れるようなコードに変換されてしまいます。

![https://mryhryki.com/file/bWB6GRucQB0EEZasOO9yMXnP3aCtbYR.png](https://mryhryki.com/file/bWB6GRucQB0EEZasOO9yMXnP3aCtbYR.png)

そのため `window.webkit.messageHandlers.firebase.postMessage` が呼ばれたとネイティブ側で判断できず、エラーになってしまうのだと考えられます。

解決策としては、以下のように順にチェックをしておくと特にエラーにならず正常に動作するようになりました。

```typescript
if (
  window.webkit &&
  window.webkit.messageHandlers &&
  window.webkit.messageHandlers.firebase &&
  window.webkit.messageHandlers.firebase.postMessage
) {
  window.webkit.messageHandlers.firebase.postMessage(/* ... */)
}
```

アプリ内で使う WebView ならではの不具合でした・・・。

ちなみに以下のようにすれば大丈夫そうな気もするんですが、試してはいません。

```typescript
if (window.?webkit.?messageHandlers.?firebase.?postMessage) {
  window.webkit.messageHandlers.firebase.postMessage(/* ... */)
}
```



## 後始末

### Flow の除去

Flow 関連のパッケージの除去や設定ファイル、スタブ用ファイル ( `TSFlowStub.js.flow` ) を削除しました。

これで完全に Flow への依存がなくなりました。

### 不要な抑制コメントの除去

TypeScript 化が終わったことで不要になった `eslint-disable` や `@ts-ignore` を除去していきました。

やった人はすぐ分かりますが、あとから見る人は何のためのものなのか判断に困るので、こういうお掃除はなるべく早く対応しておきたいですね。

### テストコードの TypeScript 化

一時的に止めていたテストを TypeScript 化し、動かせるようにしました。

また WebView ではテストフレームワークとして `ava` を使っていたのですが、コネヒトでは基本的に `jest` を使っていたので、統一して `jest` に移行しました。

（[State of JS 2020](https://2020.stateofjs.com/en-US/technologies/#arrows_overview) でみても Jest の人気が高いというのもあります）

![https://mryhryki.com/file/bWB6GgZmC8t7mer1yGoRu5A42Xk9vDJ.png](https://mryhryki.com/file/bWB6GgZmC8t7mer1yGoRu5A42Xk9vDJ.png)



## 感想など

長い戦いでした（まだ終わってないけど）が、ようやく終わりが見えてホッとしています。
ちゃんとやりたい部分もありつつ、時間との兼ね合いがあるので、どこまでやってどこはやらないかを判断するのが大変でした。

TypeScript に統一できたことによって、開発体験としてはかなり良くなりました。Flow でも一定サポートはしてくれますが、やはり TypeScript のツールチェインは充実しています。

まだ型定義がちゃんとできていない部分なども残っていますが、今後を開発を進めながら地道に健全な状態にしていきたいと思います。

### PR

コネヒトでは、フロントエンド開発のモダン化に挑戦したいエンジニアも募集中です！

[https://hrmos.co/pages/connehito/jobs/00e:embed:cite]
