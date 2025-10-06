---
title: "\"Console についてまとめる\""
emoji: "🚚"
type: "tech"
topics:
  - "JavaScript"
  - "Node.js"
published: true
canonical: "https://zenn.dev/mryhryki/articles/2020-10-19-hatena-javascript-console"
---

※この記事は[はてなブログ](https://hyiromori.hateblo.jp/entry/2020/10/19/054629)、[別アカウント(hyiromori)](https://zenn.dev/hyiromori/articles/hatena-20201019-054629)から引っ越しました

## はじめに

JavaScript を使って開発していると、`console` を使ってログ出力やデバッグしたりすることもありますが、意外とたくさん種類があることが分かったので一通りまとめてみました。

[console - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/console)

上記のMDNのドキュメントをもとに調べました。
より詳しい使い方なども書いてあるので、一度読むことをオススメします。

動作は Google Chrome で確認しています。

![image.png](https://i.gyazo.com/a224de296110c3e3c43b11e06c56ded3.png)

## [console.log()](https://developer.mozilla.org/ja/docs/Web/API/Console/log)

一番良く使うやつ。

![image.png](https://i.gyazo.com/eb7b0f75bb40d377f24123ba175a30f6.png)

これは知らなかった・・・。ドキュメントはちゃんと読んでみるものですね。

> オブジェクトのログ出力
>
> console.log(obj) を使わず、 console.log(JSON.parse(JSON.stringify(obj))) を使用してください。
>
> これにより、ログを記録した瞬間の obj の値を確実に見ることができます。こうしないと、多くのブラウザーでは値が変化したときに常に更新されるライブビューになります。これは望むことではないかもしれません。

[console.log() - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Console/log)

## [console.error()](https://developer.mozilla.org/ja/docs/Web/API/Console/error)

ERRORレベルのログを出力する

![image.png](https://i.gyazo.com/0561323bdabb97e30151e2f5d84b8dbe.png)



## [console.warn()](https://developer.mozilla.org/ja/docs/Web/API/Console/warn)

WARNレベルのログを出力する

![image.png](https://i.gyazo.com/7b3795f64dd2f6dbef3674e936e002d9.png)



## [console.info()](https://developer.mozilla.org/ja/docs/Web/API/Console/info)

INFOレベルのログを出力する。

![image.png](https://i.gyazo.com/5e62df434ebf189c2e9a7a405ecb8a5b.png)



## [console.debug()](https://developer.mozilla.org/ja/docs/Web/API/Console/debug)

DEBUGレベルのログを出力する

![capture.png](https://i.gyazo.com/7153e4cd6811546858a1537752ff1b99.png)



## [console.dir()](https://developer.mozilla.org/ja/docs/Web/API/Console/dir)

JavaScript オブジェクトのプロパティの対話的なリストを表示する。

![capture.gif](https://i.gyazo.com/6ee1974bdd65a1bcfbf0c3b29762b660.gif)

Google Chrome の場合、HTMLElement を入れると属性値が確認できるので、場合によっては便利。



## [console.time()](https://developer.mozilla.org/ja/docs/Web/API/Console/time), [console.timeLog](https://developer.mozilla.org/ja/docs/Web/API/Console/timeLog) [console.timeEnd()](https://developer.mozilla.org/ja/docs/Web/API/Console/timeEnd)

時間を計測する。
`timeLog` は途中で呼び出して、`timeEnd` は計測終了時に呼び出すような使い方。

![image.png](https://i.gyazo.com/69f23de85ea75e936a5c6185c868fffc.png)



## [console.trace()](https://developer.mozilla.org/ja/docs/Web/API/Console/trace)

スタックトレースを出力する。

![image.png](https://i.gyazo.com/d50f4e3fc954bc27522b09a12c2e47d7.png)



## 非標準

標準化されていないメソッドなので、使用する環境によっては使えない可能性があるらしい。

### [console.assert()](https://developer.mozilla.org/ja/docs/Web/API/Console/assert)

第1引数の結果が `false` ならメッセージを表示する。

![capture.png](https://i.gyazo.com/c182790136965322f7c7f6ae09072853.png)

### [console.clear()](https://developer.mozilla.org/ja/docs/Web/API/Console/clear)

コンソールの内容を消去する。

![capture.gif](https://i.gyazo.com/6cc947131c548859857d87b067e578ca.gif)

### [console.count([label])](https://developer.mozilla.org/ja/docs/Web/API/Console/count)

ラベルに応じて、呼び出された回数を出力する

![capture.png](https://i.gyazo.com/5bc0e7ab263a6fb621c78a43d27506af.png)

[console.countReset()](https://developer.mozilla.org/ja/docs/Web/API/Console/countReset) でリセットもできる。

### [console.dirxml()](https://developer.mozilla.org/ja/docs/Web/API/Console/dirxml)

XML/HTML 要素の子孫要素の対話式ツリーを表示する。

![image.png](https://i.gyazo.com/c3b248dbd59c48f6e771be4c75d4d88e.png)

### [console.group()](https://developer.mozilla.org/ja/docs/Web/API/Console/group), [console.groupCollapsed()](https://developer.mozilla.org/ja/docs/Web/API/Console/groupCollapsed), [console.groupEnd()](https://developer.mozilla.org/ja/docs/Web/API/Console/groupEnd)

ログ出力をインデントする。

![image.png](https://i.gyazo.com/959ab8b878c96b35f91b0ac9fb3a2eb2.png)

groupCollapsed() はデフォルトで展開されない状態になる（自分で開く必要がある）

### [console.profile()](https://developer.mozilla.org/ja/docs/Web/API/Console/profile), [console.profileEnd()](https://developer.mozilla.org/ja/docs/Web/API/Console/profileEnd)

ブラウザー内蔵のプロファイラー を実行する。
Google Chrome で試してみたところエラーにはならないけど結果を見れるところが見つけられなかった・・・。

### [console.table()](https://developer.mozilla.org/ja/docs/Web/API/Console/table)

データを表形式で出力する。

![image.png](https://i.gyazo.com/587a8480a6502e47702f4c7c634f9c95.png)


### [console.timeStamp()](https://developer.mozilla.org/ja/docs/Web/API/Console/timeStamp)

ブラウザの Timeline やタイムラインツールにマーカーを 1 個追加します。
Google Chrome にタイムラインツールはなくなったのかな・・・？

