---
title: "OpenID Connect についてと OAuth2.0 との違いを調べてみた"
emoji: "🔐"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["OAuth", "OAuth2", "OIDC", "OpenIDConnect"]
published: true
canonical: https://zenn.dev/mryhryki/articles/2021-01-30-openid-connect
---

※この記事は[別アカウント(hyiromori)](https://zenn.dev/hyiromori/articles/2021-01-30-oidc)から引っ越しました

# はじめに

最近、個人的に認証認可周りを学習していて、今回は OpenID Connect について学習したのでその内容をまとめた記事です。

世の中には既に OpenID Connect に関する優れた書籍やブログ記事が沢山ありますが、自分が学習する過程で色々なものを読むことでより理解が深まったと思うので、自分も学習したものをアウトプットすることで同じように学習している人の理解の助けになればと思い書きました。

まだ私も学習中なので、もし間違ったところなどあればコメント頂けるとありがたいです。



# OpenID Connect とはなにか？

OAuth2.0をベースにして（認可だけでなく）認証も行えるようにした拡張仕様です。

なぜOAuth2.0が認証に使えないかというと、以下のように認証に使ってしまうとリスクが非常に高いからです。

https://www.sakimura.org/2012/02/1487/

ざっくりかいつまんで言うと、以下のようになります。

- OAuth2.0 で認証をするということは、有効なアクセストークンをもって認証できたとみなすということを指す
- しかしアクセストークンには「いつ」「どこで」「なんのために」作られたのか分からない
- 例えば悪意があるサイトなどが、ユーザーから取得したアクセストークンを別サイトのログインに使ってなりすますなどの危険性がある

こういった事情から、OAuth2.0で発行されたアクセストークンを認証に使ってはいけません。

:::message
ちなみに認証に使えないことはOAuth2.0の問題ではありません。
OAuth2.0はあくまで「認可」を対象にした仕様なので、対象外の用途である「認証」に使って問題が発生することは当然とも言えます。
:::



# OAuth2.0 との一番大きな違い

一番大きな違いは「IDトークン」が発行されることです。
IDトークンはアクセストークンとは異なり「いつ」「どこで」「なんのために」発行されたトークンなのかの情報を含んでおり、かつ署名されているため改ざんができない（改ざんを検知できる）ようになっています。

## 以降の記述について

OpenID Connect と OAuth2.0 はIDトークン以外にも違いはあります。
（例：OAuth2.0のクライアントをリライング・パーティーと呼ぶなど用語が違ったり、UserInfoエンドポイントを実装するなど）

ただ私が学習していて、網羅的な説明だと初学者には一番重要なところがどこか分かりづらい、ということを私は経験しました。
なので、この記事ではIDトークンとOAuth2.0のフローの差分についてのみ書こうと思います。

なお[OAuth2.0の流れをまとめてみる](https://zenn.dev/hyiromori/articles/2020-12-28-oauth2) の続きという位置づけで書こうと思いますので、OAuth2.0がよく分からないという方はこちらを先に読むことをおすすめします。



# IDトークンとはなにか？

IDトークンは認証したことを証明するためのトークンという位置づけです。
具体的には JWT (JSON Web Token) という形式の文字列になっています。
この JWT に認証に関する情報が含まれています。



## JWTについて

JWT (JSON Web Token) とは、任意のJSONデータを格納できるURLセーフな文字列です。
構成としては以下のような３つの情報を `.` (ピリオド) でつなげた文字列になっています。

```
(ヘッダー).(クレーム).(署名)
```

### ヘッダー

トークンの形式と署名のバージョンを、URLセーフなBase64でエンコードされたJSON文字列です。

### クレーム

Base64でエンコードされた、任意のデータを含むJSON文字列です。
（※なおクレームには日本で使われる「苦情」のような意味合いは含まれないのでご注意ください）

RFCには予約済みのフィールドもありますが、必須ではありません。
また任意のフィールドを追加することも可能です。

OpenID Connect ではここに認証に関する情報を設定します。

### 署名

ヘッダーとペイロードに対しての署名の文字列です。
これによって正しい発行者が発行したIDトークンであることを確認できます。



## GoogleのIDトークンの例

私が実際にGoogleから取得したIDトークンを例に見てみましょう。
（※文字数が多い値や秘匿したい値は `...` としています）

```bash
$ jwt decode 'eyJh...8UOg'

Token header
------------
{
  "typ": "JWT",
  "alg": "RS256",
  "kid": "783ec031c59e11f257d0ec15714ef607ce6a2a6f"
}

Token claims
------------
{
  "at_hash": "u1...XA",
  "aud": "95...8u.apps.googleusercontent.com",
  "azp": "95...8u.apps.googleusercontent.com",
  "email": "hyiromori@gmail.com",
  "email_verified": true,
  "exp": 1611135338,
  "iat": 1611131738,
  "iss": "https://accounts.google.com",
  "sub": "10...08"
}
```

（`jwt` コマンドはこちらを使用しました）
https://github.com/mike-engel/jwt-cli

`Token claims` の部分が実際の認証に係るデータです。
特に注目すべきなのは `iss (ISSuer)`, `aud (AUDience)`, `exp (EXPiration)` です。

`iss (ISSuer)` はトークンの発行者、`aud (AUDience)` はトークンの受け手を指しています。
`aud` は設定時にGoogleから発行された値で、これを検証することでGoogleが自サイト向けの認証時に発行されたことが確認できます。

`exp (EXPiration)` はトークンの有効期限（UNIX時間）です。
これを検証することで、有効な（期限切れでない）トークンであることを確認できます。

なお `iat (Isused AT)` はIDトークンが発行された日時（UNIX時間）なので、これと有効期限を比較するとGoogleのIDトークンの生存時間が分かります。
実際に計算してみると 3,600秒なので１時間ほどで切れるようになっています。

```
1611135338 - 1611131738 = 3600 (sec)
```

このようにきちんと検証することで「正しい発行者が」「自サイト向けに」「１時間以内に認証して発行された（Googleの場合）」IDトークン以外は受け付けないようにできます。
これで OAuth2.0 のアクセストークンをそのまま使った場合の起きるなりすましのような脆弱性が解消されました。



# OAuth2.0でのフローの差分

この記事内ではOAuth2.0で定義されているフローの1つ、認可コードによる付与（Authorization Code Grant）をベースに差分を説明します。

[OAuth2.0の流れをまとめてみる](https://zenn.dev/hyiromori/articles/2020-12-28-oauth2#oauth2.0%E3%81%AE%E6%B5%81%E3%82%8C) との差分だけ記述しますので、OAuth2.0がまだあまり理解できていない方はこちらも合わせてご覧ください。

また差分をわかりやすくするため、図や用語などは OAuth2.0 のままとなっているのでご注意ください。

## 1.認可サーバーへのリダイレクト

![Redirect to authorization Server](https://i.gyazo.com/06a4969d7bc46138426ff1ad2c598c48.jpg)

Googleと連携したい時に、クライアントから必要なパラメーターを付与して、Googleの認可サーバーへのリダイレクトさせます。

その際に `scope` に `openid` を指定する、というのが OAuth2.0 と OpenID Connect の違いです。

### HTTPの例

クライアント（Webアプリ）内のリンクなどをクリックすると、リダイレクト専用のエンドポイント（例: `/request_authorize`）にアクセスします。

```http
GET /request_authorize HTTP/1.1
Host: https://client.example.com
```

このエンドポイントからは必要な情報をクエリパラメーターにセットされたURLが返却されて、Googleの認可サーバーへリダイレクトします。

```http
HTTP/1.1 302 Found
Location: https://accounts.google.com/o/oauth2/v2/auth?client_id=(CLIENT_ID)&redirect_uri=https%3A%2F%2client.example.com%2Fcallback&scope=openid%20email&response_type=code
```

:::message
`scope=openid` のように `openid` というスコープが追加されます。
:::

## 2.認可サーバーでの確認

![Authenticate on authorization server](https://i.gyazo.com/2522afa12f8a1ac3d3b34979b403f347.jpg)

（ここは特に変更ありません）

## 3.認可コードの発行

![Issue authorization code](https://i.gyazo.com/1ffbb8f6682b15c9f1b92603c5879a2c.jpg)

（ここも特に変更ありません）

## 4.アクセストークンとIDトークンの発行

![Issue access token by authorization server](https://i.gyazo.com/3daaf41950470eb5104f4819509c775d.jpg)

リダイレクト時に付与された認可コードを認可サーバーに渡して、アクセストークンと **IDトークン** を取得します。
ここで正しく検証を行うことで、自サイト向けに認証が行われたことを確認できます。

意外と OpenID Connect と OAuth2.0 の差分は多くないですね。

## 補足

- リソースサーバーは特に関係なく認証を行うことができます。
- OpenID Connect では「UserInfo エンドポイント」というユーザー情報（例: 名前やメールアドレスなど）を取得するエンドポイントを用意するようになっています。
  認証には必要ありませんが、これを使うことでユーザー情報をできるようようです。（本記事での詳細説明は割愛します）

# まとめ

OpenID Connect の重要なポイントはIDトークンが発行されるということでした。
私はIDトークンがなぜ必要で、どうして安全に認証に使えるのかが理解できた時、OpenID Connect について理解できた気がしました。

なるべく OpenID Connect の概要が分かりやすいように、最低限のものに絞って書いてみました。
実際に使うには情報が不足していると思いますが、OpenID Connect の概要を理解する助けになれば幸いです。



# 参考資料

学習する過程で参考になった資料をまとめておきます。

## 書籍

- [OAuth徹底入門 セキュアな認可システムを適用するための原則と実践](https://www.amazon.co.jp/dp/4798159298)

## ブログなど

- [JSON Web Token - Wikipedia](https://ja.wikipedia.org/wiki/JSON_Web_Token)
- [一番分かりやすい OpenID Connect の説明 - Qiita](https://qiita.com/TakahikoKawasaki/items/498ca08bbfcc341691fe)
- [OpenID Connect 全フロー解説 - Qiita](https://qiita.com/TakahikoKawasaki/items/4ee9b55db9f7ef352b47)
