---
title: "Google のターゲティング広告関連の新しい提案「The Topics API」について調べた"
emoji: "🔒"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["privacy","google","web"]
published: true
---


# はじめに

「The Topics API」は Google が提唱する「プライバシーサンドボックス」の一連の提案の１つで、ユーザーを追跡せず、ユーザーの関心に合わせた広告を配信するために使用する API です。
もともと提案され、実験的に実装されていた FLoC へのフィードバックを受けて、新たに提案されたものです。
The Topics API はまだ提案段階で変わる可能性が十分ある点をご留意ください。

正確な情報は [提案のリポジトリ](https://github.com/jkarlin/topics) や [Chrome Developers](https://developer.chrome.com/docs/privacy-sandbox/topics/) を参照してください。
本記事では The Topics API の理解を助けるために、機能の概要や参考情報を提供することを目的に書いています。


# プライバシーサンドボックスとは

> Privacy Sandbox とは、サードパーティ Cookie やその他の追跡メカニズムを使用せずにクロスサイトのユースケースに対応するための一連の提案のことを指しています。

https://developer.chrome.com/ja/docs/privacy-sandbox/overview/

このプライバシーサンドボックスの一連の提案の一つとして、The Topics API が提案され、また FLoC がありました。

私も一度まとめて記事にしたことがあるので、一連の提案の概要が知りたい場合は参照していただけると幸いです。
https://zenn.dev/mryhryki/articles/2021-10-10-privacy-sandbox


# FLoC の概要と課題

FLoC は、ユーザーを追跡せず、ユーザーの関心に合わせた広告を配信するための提案でした。
ざっくりいうと、興味が似たユーザーを数千人単位単位のグループ（コホート）にすることで、個人を特定せず、広告効果も維持していくものでした。

しかしながら、これはいくつか問題がありました。

1. 他のAPIなどの情報と組み合わせることで、従来よりも容易に個人を特定しやすくなる
2. コホートから、どういった人物か（例：年代、性別、人種など）を特定しやすくなる
3. 別の手段でユーザーを一意に識別することができる場合、ユーザーの関心の変化を知ることができる

※詳しくは [Googleに騙されてはいけない：FLoCは邪悪なアイデアである](https://p2ptk.org/privacy/3290) などが参考になります。
（電子フロンティア財団の [Google’s FLoC Is a Terrible Idea](https://www.eff.org/deeplinks/2021/03/googles-floc-terrible-idea) という記事の翻訳記事です）

こういった課題があり、批判やベンダーなどの不参加表明が相次いだことから FLoC に代わる The Topics API を出したものと思われます。

ちなみに Chrome は2022年中に Topics API の実験をする予定で、FLoC の開発は停止しているとのことです。

> Chrome intends to experiment with the Topics API in 2022 and is no longer developing FLoC.
https://www.privacysandbox.com/proposals/topics/


# The Topics API の概要

The Topic API は FLoC と同じく、ユーザーを追跡せず、ユーザーの関心に合わせた広告を配信するための提案です。

大まかには、以下のような流れになるようです。

1. 閲覧したウェブサイトをブラウザが記録する
2. ブラウザ上で、エポック(epoch)と呼ばれる期間の単位（現在の提案では１週間）で、ウェブサイトの閲覧履歴をベースに上位５つのトピックを選出し、その中からランダムに１つトピックを決定する
3. Topics API の呼び出すことで直近3エポックのトピックを取得できる

こちらの図もわかりやすいです。

![The Topic API flow](https://mryhryki.com/file/Wc1U8kERkLr6xp2isdPg8kuCl_xQC.png)
[https://developer.chrome.com/docs/privacy-sandbox/topics/](https://developer.chrome.com/docs/privacy-sandbox/topics/)

また [サンプルコード](https://github.com/jkarlin/topics/blob/d1a426640f7f9ec100e6bdfd6a37eb6179891f89/README.md#the-api-and-how-it-works) も用意されています。
（※当然ですが、また提案段階でブラウザには実装されていないので動きません。現時点でこういう風に実装するとできそう、というイメージです）

```javascript
// document.browsingTopics() returns an array of up to three topic objects in random order.
const topics = await document.browsingTopics();

// The returned array looks like: [{'value': Number, 'taxonomyVersion': String, 'modelVersion': String}]

// Get data for an ad creative.
const response = await fetch('https://ads.example/get-creative', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(topics)
});
// Get the JSON from the response.
const creative = await response.json();

// Display ad.
```

## ウェブサイトとトピックの紐付けについて

ウェブサイトとトピックは、機械学習でホスト名とトピックを紐付けるモデルを作ることが提案されているようです。
モデルはブラウザとともに配布され、オープンに開発され、自由に使用することができるとのことでした。

> The Topics API proposes using machine learning to infer topics from hostnames.
> The classifier model for this would initially be trained by the browser vendor, or a trusted third party, using human-curated hostnames and topics.
> The model would be distributed with the browser, so it would be openly developed and freely available.
> https://developer.chrome.com/docs/privacy-sandbox/topics/

## トピック一覧の選定

ウェブサイトやユーザーに紐付けるトピックは、センシティブなトピックを除外するため、トピックの一覧は人力で管理してくようです。
最初はテスト用に Chrome によって分類するが、信頼できる貢献者によってトピックを維持することを目標としているようです。

現状は [350 のトピック](https://github.com/jkarlin/topics/blob/main/taxonomy_v1.md) が提案されていて、将来的には数百から数千になる予定のようです。

> These topics would initially be curated by Chrome for testing, but with the goal that the topic taxonomy becomes a resource maintained by trusted ecosystem contributors.
> The taxonomy needs to provide a set of topics that is small enough in number (currently proposed to be around 350, though we expect the final number of topics to be between a few hundred and a few thousand) so that many browsers will be associated with each topic.
> To avoid sensitive categories, these topics must be public, human-curated, and kept updated.
> The initial taxonomy proposed for testing by Chrome has been human-curated to exclude categories generally considered sensitive, such as ethnicity or sexual orientation.
> https://developer.chrome.com/docs/privacy-sandbox/topics/


# The Topics API は何を解決するのか？

もともとの目的である Third-Party Cookie の廃止が実現されることで、よりユーザーのプライバシーが尊重されるようになります。
また同様の提案であった FLoC と比較すると、大きく以下のような点が解決されるようになると思われます。

- トピックのみを渡す（情報量を減らす）ことで、よりユーザーを特定しづらくなる
- トピックを人が管理することで、ユーザーのセンシティブな情報を渡しにくくなる


# おわりに

まだ提案の初期段階で、色々な課題も出てくるとは思いますが、FLoC に比べると良さそうに見えました。
私は広告が好きではないですが、[コインハイブ事件の最高裁判決](https://www.courts.go.jp/app/files/hanrei_jp/869/090869_hanrei.pdf) にも「ウェブサイトの運営者が閲覧を通じて利益を得る仕組みは，ウェブサイトによる情報の流通にとって重要である」とあるように、Web が広告によって支えられている面もあると思います。
プライバシーを尊重しつつ、Web の発展が止まらないようにバランスがとれることを願っています。

> GoogleのPrivacy Sandboxプロジェクト代表であるBen Galbraith（ベン・ガルブレイス）氏は、25日の発表に先立って行われたプレスブリーフィングでこう述べた。「Topicsの設計は、以前のFLoCトライアルから得た知見に基づいて行われました。その結果、コミュニティから多くのすばらしいフィードバックが寄せられたことはご存じの通りです。私が強調したいのは、提案を共有し、トライアルを行い、フィードバックを集め、設計を繰り返していくという一連のプロセスは、我々がサンドボックスに求めていたオープンな開発プロセスそのものであり、このプロセスが意図したとおりに機能していることを示しているということです」。
[グーグルが脱クッキー技術「FLoC」を廃止、代わる新機能「Topics」を公表 | TechCrunch Japan](https://jp.techcrunch.com/2022/01/26/2022-01-25-google-kills-off-floc-replaces-it-with-topics/)

仕様の是非は置いておいて、オープンに議論されて改善されていくこのプロセスは、健全で素晴らしいと私は思いました。


# 参考リンク

- [The Topics API - Chrome Developers](https://developer.chrome.com/docs/privacy-sandbox/topics/)
- [jkarlin/topics: The Topics API](https://github.com/jkarlin/topics)
- [Google Japan Blog: プライバシー サンドボックスの新しい Topics API について](https://japan.googleblog.com/2022/01/topics-api.html)
- [Privacy Sandbox Timeline](https://privacysandbox.com/timeline/)
- [グーグルが脱クッキー技術「FLoC」を廃止、代わる新機能「Topics」を公表 | TechCrunch Japan](https://jp.techcrunch.com/2022/01/26/2022-01-25-google-kills-off-floc-replaces-it-with-topics/)
- [Google、脱Cookie技術「FLoC」開発を停止し、新たな「Topics」を発表 - ITmedia NEWS](https://www.itmedia.co.jp/news/articles/2201/26/news064.html)
