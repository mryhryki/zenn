---
title: "Google のプライバシーサンドボックス関連の提案の概要と資料をまとめました"
emoji: "🔒"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["privacy","google","web"]
published: true
canonical: https://zenn.dev/mryhryki/articles/2021-10-10-privacy-sandbox
---

# はじめに

最近目にする FLoC や First-Party Sets について調べていると、Google がサードパーティ Cookie を廃止するための様々な提案を「プライバシーサンドボックス」という名前でまとめているということを知りました。

Google の動向はやはり気になりますし、広告だけでなくプライバシーに関する提案もあるので、とりあえずどういうことをやろうとしているのかの概要と資料をまとめておきたいと思い、この記事を書きました。

## おことわり

なるべく正確な情報をまとめることを心がけていますが、私はあまり広告の領域に詳しくはありませんし、各提案を完全に理解しているわけではありません。
また現在は提案の段階なので、今後変わっていく可能性もあります。
最新の正確な情報は [The Privacy Sandbox: Technology for a More Private Web](https://privacysandbox.com/) や[プライバシーサンドボックス - Chrome Developers](https://developer.chrome.com/ja/docs/privacy-sandbox/)、各提案の内容をご参照ください。

誤った情報などありましたら、コメントなどでご指摘いただけますと幸いです。


# プライバシーサンドボックスとは

> プライバシーサンドボックスは、サードパーティの Cookie やその他の追跡メカニズムを使用せずにクロスサイトのユースケースを満たすことを目指す一連の提案です。

https://developer.chrome.com/ja/docs/privacy-sandbox/

Google はサードパーティ Cookie を廃止することを目指しています。
その代替として、サードパーティ Cookie に頼らないターゲティング広告の仕組みや、プライバシーを向上させるための提案をまとめて「プライバシーサンドボックス」と呼んでいるようです。

この記事では [Privacy Sandbox とは何ですか？ - Chrome Developers](https://developer.chrome.com/ja/docs/privacy-sandbox/overview/) に書かれている以下の提案の概要と資料をまとめています。

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
サーバーではなくブラウザ内で閲覧履歴などを処理し、興味のある領域という数千人単位のグループに振り分けるようです。
数千人のグループであれば個人を特定できないので、プライバシーを守りつつターゲティング広告ができる、というロジックのようです。

FLoC は Federated Learning of Cohorts の略で、[コホートの連合学習](https://legalsearch.jp/portal/column/floc/) と訳されたりするようです。

## 2022-02-18 追記

Google は FLoC の提案をやめ、新たに The Topics API という提案をしました。
以下の記事に The Topics API の概要をまとめています。

https://zenn.dev/mryhryki/articles/2022-01-30-the-topics-api

[Backup](https://mryhryki.com/blog/2022-01-30-the-topics-api.html)

## 批判

FLoC は、サードパーティ Cookie に代わるターゲティング広告の中心的な技術であり、批判も多くあります。
詳しくは参考リンクの記事を参考にしてください。

## 参考リンク

- [WICG/floc: FLoC](https://github.com/WICG/floc)
- [FLoC - Chrome Developers](https://developer.chrome.com/ja/docs/privacy-sandbox/floc/)
- [FLoCとは何ですか？ | GIGAZINE.BIZ](https://gigazine.biz/2021/02/20/floc/)
- [FLoCとはなにか - ぼちぼち日記](https://jovi0608.hatenablog.com/entry/2021/05/06/160046)
- [Cookieと違う、Googleが開発するFLoCとは？](https://legalsearch.jp/portal/column/floc/)
- [Googleが導入予定の「FLoC」は最悪なものだと電子フロンティア財団が指摘 - GIGAZINE](https://gigazine.net/news/20210305-googles-floc-terrible-idea/)
- [マイクロソフトEdge、Googleの広告技術FloCを無効化。事実上の「NO」表明か - Engadget 日本版](https://japanese.engadget.com/ms-edge-google-floc-diabled-073050317.html)
- [GoogleがCookieに代わる広告ターゲティング手段FLoCをChromeでテスト開始 | TechCrunch Japan](https://jp.techcrunch.com/2021/04/01/2021-03-30-google-starts-trialling-its-floc-cookie-alternative-in-chrome/)
- [Googleに騙されてはいけない：FLoCは邪悪なアイデアである | P2Pとかその辺のお話R](https://p2ptk.org/privacy/3290)
- [Googleが提案するサードパーティーCookieなしの新しい広告の仕組み「FLoC」とは？ - GIGAZINE](https://gigazine.net/news/20210126-google-chrome-privacy-sandbox-floc/)
- [Googleの新しい広告システム「FLoC」はどのような仕組みで動作するのか？ | GIGAZINE.BIZ](https://gigazine.biz/2021/05/09/inside-floc/)
- [Googleの「FLoC」によってどのようにプライバシー侵害が起こるのか？ | GIGAZINE.BIZ](https://gigazine.biz/2021/06/13/privacy-analysis-of-floc/)



# FLEDGE

ユーザーの関心に基づいて広告を配信できるが、ユーザーを特定させないための仕様のようです。

具体的には、あるサイトにアクセスすると特定の広告グループに紐付けられ、**ブラウザ内で** オークションが行われて広告が決定されるようです。
そのため、広告主はどのページを見たなどの情報はわからないが、適した広告を配信できるという仕組みのようです。

## TURTLEDOVE

FLEDGE は TURTLEDOVE という提案の最初の実験的な API という位置づけのようです。

> Chrome expects to build and ship a first experiment in this direction during 2021. For details of the current design, see FLEDGE.
https://github.com/WICG/turtledove/blob/main/README.md

> First Experiment (FLEDGE)
https://github.com/WICG/turtledove/blob/main/FLEDGE.md

## 参考リンク

- [WICG/turtledove: TURTLEDOVE](https://github.com/WICG/turtledove)
- [turtledove/FLEDGE.md at main · WICG/turtledove](https://github.com/WICG/turtledove/blob/main/FLEDGE.md)
- [FLEDGE - Chrome Developers](https://developer.chrome.com/ja/docs/privacy-sandbox/fledge/)
- [TURTLEDOVEとは何ですか？ | GIGAZINE.BIZ](https://gigazine.biz/2021/02/21/turtledove/)
- [FLEDGEとは何ですか？ | GIGAZINE.BIZ](https://gigazine.biz/2021/02/21/fledge/)
- [PrivacySandboxにおけるWeb広告のEdgeComputing技術 | PLAID engineer blog](https://tech.plaid.co.jp/privacy-sandbox-edge-computing/)



# アトリビューションレポート

サードパーティ Cookie を使わず、ユーザーのコンバージョンを測定する仕様です。
特定の広告要素をクリックした時に、キャンペーンなどを識別する情報だけを送ってどの程度コンバージョンしたかを測定できるようです。
またレポートを遅延して送信したり、ノイズを含めることでよりプライバシーを高めるようです。

## Safari の場合

> Safari / Webkit ではサポートされておらず、Private Click Measurement (プライベート クリック測定)と呼ばれる広告コンバージョンを測定する別の API が提案されています。
https://developer.chrome.com/ja/docs/privacy-sandbox/attribution-reporting-introduction/#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AE%E3%82%B5%E3%83%9D%E3%83%BC%E3%83%88

リンク先のこちらの動画がわかりやすかったです。
（日本語字幕あり）

https://developer.apple.com/videos/play/wwdc2021/10033/

Google Chrome と Safari で違う方法で計測が必要になりそうです。

## 参考リンク

- [WICG/conversion-measurement-api: Conversion Measurement API](https://github.com/WICG/conversion-measurement-api/)
- [アトリビューションレポート - Chrome Developers](https://developer.chrome.com/ja/docs/privacy-sandbox/attribution-reporting/)
- [アトリビューション レポートの概要 (コンバージョン測定) - Chrome Developers](https://developer.chrome.com/ja/docs/privacy-sandbox/attribution-reporting-introduction/)



# SameSite Cookieの変更

Cookie の設定時に付与される `SameSite` 属性についての話のようです。
すでにモダンブラウザの多くは実装済みですね。

`SameSite` 属性はクロスオリジンへの Cookie の送信を制御するための属性で、適切に設定することで CSRF などの攻撃を防ぐことができます。
詳しくは以下の MDN のサイトなどを参照してください。

## 参考リンク

- [SameSite cookies - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [SameSite cookies explained](https://web.dev/samesite-cookies-explained/)



# First-Party Sets

First-Party Sets は、異なるオリジンをファーストパーティとして扱うための仕様です。
例えば `site-b.example` にアクセスした時に、`site-a.example` のファーストーパーティのメンバーだと指定されていた場合、`site-b.example` は `site-a.example` （ファーストーパーティ）と同等に扱われるようです。

具体的には `.well-known/first-party-set` というファイルをそれぞれのドメインに設置することで、ファーストパーティであることを検証するようです。

## 参考リンク

- [privacycg/first-party-sets](https://github.com/privacycg/first-party-sets)
- [First-Party Sets - Chrome Developers](https://developer.chrome.com/ja/docs/privacy-sandbox/first-party-sets/)
- [First-Party Setsについて](https://zenn.dev/tayusa/articles/efa8aa75ad5519)
- [First-Party Setsでドメインを超えてCookieを共有する - Qiita](https://qiita.com/rana_kualu/items/13a77f76257767a23643)



# Trust Tokens

アクセスしているのが人間かボットなのかを、ユーザーを識別することなく判定できるようにする仕様のようです。
ただし、どのように人間かボットかを判定するかは、仕様には含まれていないようです。

`fetch` のオプションに `trustToken` という設定を与えてアクセスすることで Trust Token の発行・認証ができるようにするようです。
（[提案の Sample API Usage](https://github.com/WICG/trust-token-api#sample-api-usage) を参照）

## 参考リンク

- [WICG/trust-token-api: Trust Token API](https://github.com/WICG/trust-token-api)
- [Trust Tokens (トラストトークン) - Chrome Developers](https://developer.chrome.com/ja/docs/privacy-sandbox/trust-tokens/)



# Privacy Budget

Privacy Budget は Font, Canvas, User-Agent などブラウザの識別（ブラウザフィンガープリント）のために使える API に対して、一定の制限を設ける、という仕様のようです。
ただし、現時点では実験段階で絶対的な基準はまだ存在しないようです。

## 参考リンク

- [Introducing the Privacy Budget - YouTube](https://www.youtube.com/watch?v=0STgfjSA6T8)
- [bslassey/privacy-budget](https://github.com/bslassey/privacy-budget)


# User-Agent Client Hints

`User-Agent` ヘッダーに含まれる情報量を減らすために `Sec-CH-UA*` というヘッダーを使って必要な情報を渡すことができるという仕様のようです。
`User-Agent` ヘッダーは情報量が多く、ブラウザフィンガープリントとしても使われるため、プライバシーを守るため情報量を減らしていきたい、という背景があるようです。

## 参考リンク

- [Improving user privacy and developer experience with User-Agent Client Hints](https://web.dev/i18n/ja/user-agent-client-hints/)



# Gnatcatcher

ユーザーをIPアドレスで識別させないための仕様のようです。
以下の２つの要素で構成されているようです。

- `Near-path NAT` は別のサーバーを介してアクセスすることでIPアドレスを隠すようです
- `Willful IP Blindness` は Web サイトが IP アドレスをユーザーに関連付けしていないことをブラウザに通知できるようです
    - （どういう風に実現するのかが私もまだ理解できていません。理解できたら書きたい）

## 参考リンク

- [bslassey/ip-blindness](https://github.com/bslassey/ip-blindness)



# WebID

IDフェデレーションを使った認証フローを、サードパーティCookieやリダイレクトを使わず、ブラウザで連携するための仕様のようです。

この図がイメージを掴みやすいです。
![Federated Credential Management API - 5. High Level Design](https://i.gyazo.com/e997e4b3955086259e0b7f7fb9b5c9dc.png)

## 参考リンク

- [WICG/WebID: A privacy preserving federated identity Web API](https://github.com/WICG/WebID)
- [Federated Credential Management API](https://wicg.github.io/WebID/#lifecycle)



# 補足

## ブラウザフィンガープリント

ブラウザフィンガープリントは、ブラウザから取得できる環境などの情報からブラウザを特定する手法です。

ブラウザの識別なので、ブラウザフィンガープリント単体で複数の端末やブラウザを使っているユーザーを識別することはできません。
ただし、Cookie などと併用すればできる可能性があります。

ブラウザフィンガープリントでは、ブラウザバージョン、プラグイン、ハードウェア情報、履歴、フォント、Canvas(WebGL) などの情報を組み合わせてブラウザを特定するようです。
[AmIUnique](https://amiunique.org/fp) のようにブラウザフィンガープリントのテストができるサイトもあります。

### 参考リンク

- [Device fingerprint - Wikipedia](https://en.wikipedia.org/wiki/Device_fingerprint)
- [Fingerprint解説サイト](https://www.saitolab.org/fp_site/)
- [Canvas Fingerprintingはクッキーより怖いのか技術的に調べてみた｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/morimorihoge/2014_07_29/18555)



# おわりに

ブラウザに依存する部分が大きくなるので、Google Chrome 以外のブラウザがどこまで実装されるのか疑問ですね。
将来的にはそれぞれのブラウザで、広告配信のやり方が変わったりするのでしょうか。（現状を知らないので、既にそうなのかもしれませんが）
広告に大きなメリットがないブラウザベンダーは、広告関連の提案を実装するモチベーションがあまりない気もしました。

ただ、プライバシーサンドボックス（特にFLoC）は批判も多いようですが、それでもこれらの提案がオープンに誰でも閲覧・参加ができる形で議論されているのは Web の良さかな、と私は感じました。

私は正直広告は好きではないですが、Web の発展を支える一部であることは確かだと思います。
サードパーティ Cookie よりプライバシーが尊重された Web の未来が来ると良いな、と調べながら思いました。

## 参考リンク

全体または複数の提案に関わる資料や、Privacy Sandbox 自体の資料などはこちらにおいておきます。

- [Google Japan Blog: サードパーティ Cookie 廃止に関するタイムラインの変更について](https://japan.googleblog.com/2021/06/cookie.html)
- [GoogleがCookieレスな「プライバシー・サンドボックス」を実現させると何が起こるのか？ - GIGAZINE](https://gigazine.net/news/20210119-death-of-third-party-cookies/)
- [Googleが「ユーザー情報を保護しつつ広告の関連性も損なわない」仕組みの開発を行うと宣言 - GIGAZINE](https://gigazine.net/news/20190823-google-privacy-sandbox/)
- [Googleはどのような「Cookieなしの広告システム」を作ろうとしているのか？ | GIGAZINE.BIZ](https://gigazine.biz/2020/12/20/concerns-google-privacy-proposals/)
- [Privacy Sandboxとはなにか/Privacy Sandbox Explained - Speaker Deck](https://speakerdeck.com/shigeki/privacy-sandbox-explained)
- [【一問一答】Googleの「 プライバシーサンドボックス 」とは？：Cookieの代わりとされる5つのAPI | DIGIDAY［日本版］](https://digiday.jp/platforms/wtf-googles-privacy-sandbox/)
- [どこで読めるの？今さらきけない仕様書の在り処！ | フロントエンドBlog | ミツエーリンクス](https://www.mitsue.co.jp/knowledge/blog/frontend/201809/20_1133.html)
- [プライバシーサンドボックスについて調べる](https://zenn.dev/mryhryki/scraps/4b9e03d8788095)
