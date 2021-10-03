---
title: "Google の提案しているプライバシーサンドボックスについて調べてみた"
emoji: "🔒"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["privacy","google","web"]
published: false
---

## おことわり

なるべく正確な情報をまとめることを心がけていますが、私はあまり広告の領域に詳しくはありません。
また提案の段階なので、今後変わっていく可能性もあります。
最新の正確な情報は [The Privacy Sandbox: Technology for a More Private Web](https://privacysandbox.com/) や[プライバシーサンドボックス - Chrome Developers](https://developer.chrome.com/ja/docs/privacy-sandbox/)、各提案の内容をご参照ください。

私はどちらかといえば、ターゲティング広告に対して否定的な感情を持っています。
なるべく中立に書きたいと思っていますが、どうしてもそういった書き方になる場面もあると思いますので、ご了承いただければと思います。

誤った情報などありましたら、コメントなどでご指摘いただけますと幸いです。



# プライバシーサンドボックスとは

> プライバシーサンドボックスは、サードパーティの Cookie やその他の追跡メカニズムを使用せずにクロスサイトのユースケースを満たすことを目指す一連の提案です。

https://developer.chrome.com/ja/docs/privacy-sandbox/

Google はサードパーティ Cookie を廃止することを目指しています。
その代替として、サードパーティ Cookie に頼らないターゲティング広告の仕組みや、プライバシーを向上させるための提案をまとめて「プライバシーサンドボックス」と呼んでいるようです。
そのため「プライバシーサンドボックス」という仕様などはなく、いくつかの提案をまとめて便宜上プライバシーサンドボックと呼んでいるようです。

この記事では [Privacy Sandbox とは何ですか？ - Chrome Developers](https://developer.chrome.com/ja/docs/privacy-sandbox/overview/) に書かれている以下の提案の概要をまとめています。

- FLoC
- FLEDGE
- アトリビューションレポート
- SameSite Cookieの変更
- First-Party Sets
- Trust Tokens
- Privacy Budget
- User-Agent Client Hints
- Gnatcatcher
- WebID



# FLoC

ブラウザ内で閲覧履歴など元に、機械学習によって閲覧者の興味のある領域を区分し、その情報をベースにターゲティング広告を行う、というもののようです。
閲覧履歴ではなく、興味のある領域という大きな数千人単位でのグループに属させることで個人を特定できない、というロジックでプライバシーを守りつつターゲティング広告ができる、というのが趣旨のようです。

Federated Learning of Cohorts の略で、[コホートの連合学習](https://legalsearch.jp/portal/column/floc/) と訳されたりするようです。

## 課題・疑問

ブラウザのみで行い、閲覧履歴などの情報をどこにも渡さないという点は、サードパーティ Cookie よりも評価できると思っています。
その一方で以下のような懸念があると私は思っています。

### 機械学習

機械学習の精度や振り分けに課題ができるのではないか、という懸念があります。


### プライバシー

コホートを取得する [サンプルコード](https://github.com/WICG/floc#overview) ランプル値に "43A7" という値がありました。
仮に16進数4桁だとすると65,536パターンあると思うので、ある程度ユーザーを識別しやすい情報になると考えられます。

コホートの情報と別の情報を組み合わせることで、ブラウザフィンガープリントの精度を上げてしまう可能性があると思います。
これは別の提案（FLEDGE, Privacy Budget, User-Agent Client Hints など）で緩和することも含めて考えられているとは思いますが、プライバシーの観点から考えればあまり良く無いと私は思っています。


## 参考リンク

- [WICG/floc: FLoC](https://github.com/WICG/floc)
    - Web Platform Incubator Community Group (WICG) に提出された提案
- [FLoCとは何ですか？ | GIGAZINE.BIZ](https://gigazine.biz/2021/02/20/floc/)
- [Cookieと違う、Googleが開発するFLoCとは？](https://legalsearch.jp/portal/column/floc/)
- [Googleが導入予定の「FLoC」は最悪なものだと電子フロンティア財団が指摘 - GIGAZINE](https://gigazine.net/news/20210305-googles-floc-terrible-idea/)
- [マイクロソフトEdge、Googleの広告技術FloCを無効化。事実上の「NO」表明か - Engadget 日本版](https://japanese.engadget.com/ms-edge-google-floc-diabled-073050317.html)
- [GoogleがCookieに代わる広告ターゲティング手段FLoCをChromeでテスト開始 | TechCrunch Japan](https://jp.techcrunch.com/2021/04/01/2021-03-30-google-starts-trialling-its-floc-cookie-alternative-in-chrome/)
- [Googleに騙されてはいけない：FLoCは邪悪なアイデアである | P2Pとかその辺のお話R](https://p2ptk.org/privacy/3290)
- [Googleが提案するサードパーティーCookieなしの新しい広告の仕組み「FLoC」とは？ - GIGAZINE](https://gigazine.net/news/20210126-google-chrome-privacy-sandbox-floc/)



# FLEDGE

ユーザーの関心に基づいて広告を配信できるが、ユーザーを特定することはできない、という仕様のようです。

## TURTLEDOVE

FLEDGE は TURTLEDOVE という提案の最初の実験という位置づけのようです。

> Chrome expects to build and ship a first experiment in this direction during 2021. For details of the current design, see FLEDGE.
https://github.com/WICG/turtledove/blob/main/README.md

> First Experiment (FLEDGE)
https://github.com/WICG/turtledove/blob/main/FLEDGE.md

FLEDGE が出てくるのは、以下のように TURTLEDOVE の概念だと Google Chrome 依存があるため、それを改善した FLEDGE を前面に出したい意図があるのではないかと私は思っています。

> FLEDGEはプライバシーサンドボックスで議論されてきたTURTLEDOVEという概念の初期のプロトタイプです。TURTLEDOVEはインターネットユーザーの興味・関心といった情報をブラウザに保存し、広告主がそれを利用可能にする仕組みですが、「Google Chromeへの依存が増す」と懸念されています。
> 
> そこでFLEDGEは、ブラウザに保存されたユーザー情報と、外部の「信頼されたサーバー」から送られるメタデータに基づいて、ブラウザ上で広告枠のオークションを行えるようにすることを検討しています。
https://gigazine.biz/2021/02/21/fledge/

## 実装例

```javascript
// https://github.com/WICG/turtledove/blob/main/FLEDGE.md#11-joining-interest-groups
const myGroup = {
  'owner': 'www.example-dsp.com',
  'name': 'womens-running-shoes',
  'biddingLogicUrl': ...,
  'dailyUpdateUrl': ...,
  'trustedBiddingSignalsUrl': ...,
  'trustedBiddingSignalsKeys': ['key1', 'key2'],
  'userBiddingSignals': {...},
  'ads': [shoesAd1, shoesAd2, shoesAd3],
  'adComponents': [runningShoes1, runningShoes2, gymShoes, gymTrainers1, gymTrainers2],
};
navigator.joinAdInterestGroup(myGroup, 30 * kSecsPerDay);
```

```javascript
// https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction
const myAuctionConfig = {
  'seller': 'www.example-ssp.com',
  'decisionLogicUrl': ...,
  'trustedScoringSignalsUrl': ...,
  'interestGroupBuyers': ['www.example-dsp.com', 'buyer2.com', ...],
  'additionalBids': [otherSourceAd1, otherSourceAd2, ...],
  'auctionSignals': {...},
  'sellerSignals': {...},
  'perBuyerSignals': {'www.example-dsp.com': {...},
                        'www.another-buyer.com': {...},
                        ...},
};
const auctionResultPromise = navigator.runAdAuction(myAuctionConfig);

```

## 課題・疑問

### 実装のモチベーション

Safari や FireFox などのブラウザベンダーは、このAPIを実装するモチベーションが無いのでは？
Google Chrome とかの広告に積極的なブラウザベンダーだけしか実装されない可能性が高そう。

## 参考リンク

- [WICG/turtledove: TURTLEDOVE](https://github.com/WICG/turtledove)
- [turtledove/README.md at main · WICG/turtledove](https://github.com/WICG/turtledove/blob/main/README.md)
- [TURTLEDOVEとは何ですか？ | GIGAZINE.BIZ](https://gigazine.biz/2021/02/21/turtledove/)
- [FLEDGEとは何ですか？ | GIGAZINE.BIZ](https://gigazine.biz/2021/02/21/fledge/)



# アトリビューションレポート

サードパーティ Cookie を使わず、ユーザーのコンバージョンを測定する仕様のようです。

## 課題・疑問

### Safari の仕様

> Safari / Webkit ではサポートされておらず、Private Click Measurement (プライベート クリック測定)と呼ばれる広告コンバージョンを測定する別の API が提案されています。
https://developer.chrome.com/ja/docs/privacy-sandbox/attribution-reporting-introduction/#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AE%E3%82%B5%E3%83%9D%E3%83%BC%E3%83%88

https://developer.apple.com/videos/play/wwdc2021/10033/

この仕様はそれぞれ別のものとして進んでいくのか、今後統合されていくのか。

## 参考リンク



# SameSite Cookieの変更

## 課題・疑問

## 参考リンク



# First-Party Sets

## 課題・疑問

### 何に対して有効なのか？

- ファーストパーティとサードパーティの区別がURLから判別できない
- 広告企業などをファーストパーティとして入れた場合、それは誰にとってメリットなのか。少なくともユーザーにとってのメリットはない

## 参考リンク



# Trust Tokens

## 課題・疑問

## 参考リンク



# Privacy Budget

## 課題・疑問

## 参考リンク



# User-Agent Client Hints

## 課題・疑問

## 参考リンク



# Gnatcatcher

## 課題・疑問

## 参考リンク



# WebID


## 課題・疑問

## 参考リンク



# おわりに



## 参考リンク

- [プライバシーサンドボックスについて調べる](https://zenn.dev/mryhryki/scraps/4b9e03d8788095)
- [Google Japan Blog: サードパーティ Cookie 廃止に関するタイムラインの変更について](https://japan.googleblog.com/2021/06/cookie.html)
- [どこで読めるの？今さらきけない仕様書の在り処！ | フロントエンドBlog | ミツエーリンクス](https://www.mitsue.co.jp/knowledge/blog/frontend/201809/20_1133.html)

