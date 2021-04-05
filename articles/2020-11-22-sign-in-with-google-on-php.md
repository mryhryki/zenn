---
title: "(Cake)PHP で Sign in with Google を実装した時のメモ"
emoji: "🔐"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["OAuth","PHP"]
published: true
---

※この記事は[別アカウント(hyiromori)](https://zenn.dev/hyiromori/articles/b8ba9445f1e4c7282c89)から引っ越しました

## はじめに

社内ツールに認証を入れる際に、Google OAuth を使った認証の仕組みをいれました。
その作業の記録です。

`CakePHP 4.1.6` を使っていますが、基本的な部分は `CakePHP` に限らず `PHP` 全般で使えると思います。

また最近OAuthなど認証の学習を始めたので、違う箇所や別の良い方法がある場合はコメントいただけるとありがたいです。



## 前提

1. GCPで認証情報は作成され、JSONファイルを取得済であること
1. OAuth2 の `Authorization Code Grant` によるフローで実装しています



## やりたいこと

今回は Google OAuth を使ってユーザーを認証することを目的としていました。
またGoogleアカウントに紐づくメールアドレス、名前、プロフィール画像を取得してアカウント情報を作ることもしました。



## 認証のためのライブラリの導入

まずGoogle が提供しているライブラリを導入しました。
[googleapis/google-api-php-client: A PHP client library for accessing Google APIs](https://github.com/googleapis/google-api-php-client)

このドキュメントに紹介されています。
[Using OAuth 2.0 for Web Server Applications  |  Google Identity Platform](https://developers.google.com/identity/protocols/oauth2/web-server)

### インストール

`composer` で一発でした。

```bash
composer require google/apiclient:"^2.7"
```

### 認証情報の設定

GCPで認証情報を作成すると、JSONファイルで認証情報をダウンロードできます。

今回はJSON文字列ごと環境変数に設定して、それをパースして使用する方法にしました。

```bash
# こんな感じで設定されているイメージです
$ export GOOGLE_AUTH_CONFIG='{"web":"...(略)..."}'
```

```php
// こんな感じで環境変数をパースして使用します。
$config = json_decode(env('GOOGLE_AUTH_CONFIG', '{}'), true);
```

※以降のサンプルコード内の `$config` という変数は、このパースした認証情報を指します



### APIクライアントの生成

APIクライアントの生成は、以下のように実行します。

```php
$client = new Client();

// 上記のパースした認証情報をセットする
$client->setAuthConfig($config);

// リダイレクト用のURLをセットする
// GCPで設定したものと同じである必要がある
$client->setRedirectUri('http://localhost:8080/callback');
```

※以降のサンプルコード内の `$client` という変数は、このAPIクライアントを指します



## エンドポイントの実装

次に認証関連のエンドポイントを用意しました。
必要になるエンドポイントは３つです。

### /sign_in

サインイン画面を表示するためのエンドポイントです。
特に処理とかはなく、次に出てくる `/request_authorize` へのリンクを設置するだけです。

こんな感じで `Sign in with Google` のリンクを押して、リンクは `/request_authorize` を指定しています。

![/sign_in](https://i.gyazo.com/17db1df118d5dd8de1aed4342a5e0ab3.png)

（アイコンは以下のリンクにあります）
[ログインにおけるブランドの取り扱いガイドライン  |  Google Identity Platform  |  Google Developers](https://developers.google.com/identity/branding-guidelines?hl=ja)

### /request_authorize

Google の OAuth エンドポイントへリダイレクトするエンドポイントです。
色々とパラメーターを付与してリダイレクトする必要があります。

#### リダイレクト時に付与するパラメーター

リダイレクトする際に、以下の情報をクエリパラメーターに追加しておきます。

- `client_id`
    - GCP で作成したプロジェクトに表示されているクライアントID
- `redirect_uri`
    - リダイレクトURI
    - `/callback` のエンドポイントをドメインなども含め全て指
    - GCPでの設定と同じにしておく必要あり
- `response_type`
    - `code` をセット
    - 今回は OAuth2 で定義されている `Authorization Code Grant` のフローを使うため
- `scope`
    - `openid email profile` をセット
    - 認証＋メールアドレスとプロフィール画像を取得したかったのでこれらを指定
- `access_type`
    - `offline` をセット
- `state`
    - CSRFを防ぐための乱数
    - セッションに保存して `/callback` で検証する時に使う

#### CakePHPでの実装例

CakePHP のコントローラーはこんな感じで実装しました。

```php
public function requestAuthorize()
{
    // state の生成
    $state = base64_encode(random_bytes(16));

    $query = http_build_query([
        'client_id' => $config['web']['client_id'], // 認証情報からクライアントIDを取得
        'redirect_uri' => 'http://localhost:8080/callback', // GCPで設定したものと同じである必要がある
        'response_type' => 'code',
        'scope' => 'openid email profile',
        'access_type' => 'offline',
        'state' => $state
    ]);

    // callback で state のチェックをするためにセッションにセットしておく
    $this->getRequest()->getSession()->write('oauth_state', $state);

    // Google のエンドポイントへリダイレクト
    $this->redirect("https://accounts.google.com/o/oauth2/v2/auth?{$query}");
}
```

`state` は [CSRF](https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%AA) を防ぐために使用するものです。
以下の記事がとても分かりやすかったです。

[OAuthやOpenID Connectで使われるstateパラメーターについて | SIOS Tech. Lab](https://tech-lab.sios.jp/archives/8492)



### `/callback`

Googleでの認証が終わった後に呼ばれるエンドポイントです。
Gクエリパラメーターに必要なパラメーターが付与されているので、それらを処理して認証を完了します。

このエンドポイントはやることが多いので、軽く流れを説明します。

1. クエリパラメーターを取得する
1. `state` のチェックし一致しない場合は処理を終了する
1. Googleからアクセストークンを取得する
1. IDトークンを検証して認証する
1. サインイン完了の処理をする

#### クエリパラメーターを取得する

以下２つのパラメーターが付与されているので取得します。

- `code`
    - Google へ認証情報やプロフィールなどを取得するために使用する文字列です
- `state` 
    - `/request_authorize` で渡した `state` と同じ値がセットされています
    - このタイミングでリクエストしたユーザーと同じユーザーがリクエストしたかどうかを検証します（コードだけ盗み取られて別のユーザーがアクセスした場合に、情報漏えいを防ぐためです）

#### state のチェックし一致しない場合は処理を終了する

クエリパラメーターの `state` と、セッションの `state` が一致するかを検証します。
これによって、正しいリクエストであることを検証できます。

#### Googleからアクセストークンを取得する

クエリパラメーターに付与されている `code` は Google にアクセスして情報を取得するための引換券のようなものです。
`code` を使って、アクセストークンを取得します。
APIクライアントのメソッドを使えば一行でできます。

```php
$code = $this->getRequest()->getQuery('code');
$accessToken = $client->fetchAccessTokenWithAuthCode($code);
```

#### IDトークンを検証して認証する

アクセストークン内にある `id_token` というトークンを検証します。
このIDトークンを検証することで、ユーザーの認証が完了します。
こちらもAPIクライアントのメソッドを使えば一行でできます。

```php
$userInfo = $client->verifyIdToken($accessToken['id_token']);
if (!$userInfo) {
    return $this->renderError('トークンの検証に失敗しました');
}
```

#### サインイン完了の処理をする

ここは各アプリケーションの要件によって実装が変わってきます。
私の場合は、以下のような処理をしました。

1. メールアドレス、名前、プロフィール画像を取得
1. ユーザー情報の作成 or 更新
1. セッションにユーザー情報を入れる
1. 初期画面にリダイレクト

参考までに `$userInfo` から以下のように情報を所得できます。

```php
$email = $userInfo['email'];
$name = $userInfo['name'];
$picture = $userInfo['picture'];
```



## おわりに

Google OAuth を使うのは、思っていたよりも手軽にできることが分かりました。
とはいえ、何のためにこの処理を書いているのかは分かったほうが良いなー、と思いました。

私は認証認可の学習をしていて、こういった実装をしてみることで結構理解が深まった気がします。
認証認可は結構重要かつ色々なプロダクトで使っていくものなので、しっかり学習していきたいですね。



## 疑問（自分への宿題）

Google は OAuth と言っているけど、OpenID Connect とは何が違うのかな・・・？
OAuth2 の上に OpenID Connect が定義されている、とは見たけれど、どう違うのかは分かっていない。
この辺は学習を進めてわかったら追記するかもしてません。
