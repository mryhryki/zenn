---
title: "AWS API Gateway の WebSocket API をちゃんと理解する"
emoji: "⚡️"
type: "tech"
topics:
  - "AWS"
  - "APIGateway"
  - "WebSocket"
published: true
canonical: "https://zenn.dev/mryhryki/articles/2020-12-01-aws-api-gateway-websocket"
---

※この記事は[別アカウント(hyiromori)](https://zenn.dev/hyiromori/articles/96ebdcd5e8171bcd388f)から引っ越しました

これは [コネヒト Advent Calendar 2020 1日目](https://qiita.com/advent-calendar/2020/connehito) の記事です。

## はじめに

これは AWS のサービスの1つ、[API Gateway](https://aws.amazon.com/jp/api-gateway/) の [WebSocket API](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/apigateway-websocket-api-overview.html) を理解するために書いた記事です。
[発表当初](https://aws.amazon.com/jp/blogs/news/announcing-websocket-apis-in-amazon-api-gateway/) から「ついに WebSocket もサーバーレスで使える！」と喜び、個人的に色々試していました。
ただ自分の理解が断片的になっていたので、一度ちゃんとまとめたいと思いこの記事を書きました。



# WebSocket API が提供してくれるもの

まずは、WebSocket API がどういった機能を提供してくれるのか紹介します。

## サーバー管理不要で WebSocket コネクションを管理してくれる

API Gateway が WebSocket の接続から切断までを面倒みてくれます。
EC2などのサーバーを管理しなくても良い、いわゆるサーバーレスなサービスです。

## 接続時、切断時、メッセージ受信時にバックエンドへ送信してくれる

当然コネクションの管理だけではなく、WebSocket コネクションが接続された時、切断された時、そしてメッセージを受信した時にバックエンドへイベントを送信してくれます。
バックエンドは [Lambda](https://aws.amazon.com/jp/lambda/) などのAWSサービスはもちろん、`HTTP` での送信もできるので自前のサーバーに送ることもできます。

![API Gateway](https://i.gyazo.com/61fcdc520d1c60e8b146c4dce7de7bcd.png)

またコネクションの接続時、切断時、メッセージ受信時でそれぞれ別のバックエンドを指定できます。
（※更にメッセージ受信時はカスタムルートというのを作ると、メッセージ内容によって別のバックエンドに送信することも可能ですが、今回は使いません）

![API Gateway](https://i.gyazo.com/292ac6f6ac64cc3bdb4f28fbf5da2031.png)

## WebSocket へメッセージを送信できる

WebSocket API が接続毎に発行しているコネクションIDを使って、AWS CLI や SDK で WebSocket に対してメッセージを送信できます。
このコネクションIDは接続時、切断時、メッセージ受信時のイベントから取得できます。
コネクションIDをどのように管理するかは、ユーザーの実装に委ねられています。（一覧APIのようなものは AWS にはありません）



# WebSocket API の実験

WebSocket API を実際にデプロイして、その仕組みを理解していきます。

## Serverless Framework を使ったサンプルで WebSocket API をデプロイする

今回は [Serverless Framework](https://www.npmjs.com/package/serverless) を使い、数十行程度の小さなサンプルプロジェクトを作りました。
https://github.com/mryhryki/example-aws-api-gateway-websocket

コアとなる部分は [index.js](https://github.com/mryhryki/example-aws-api-gateway-websocket/blob/main/index.js) の部分です。
ここにメッセージ受信時、接続時、切断時の処理を実装しています。

まずメッセージ受信時の処理です。
ここでは受信したイベントからエンドポイントURLを組み立てて、コネクションIDと共に送信元に返す処理をしています。
このエンドポイントURLとコネクションIDが、WebSocket へメッセージを送信するために必要です。

```javascript
const onMessage = async (event) => {
  // イベントデータからコネクションのエンドポイントURLを組み立てる
  const { body } = event
  const {connectionId, apiId, stage} = event.requestContext;
  const endpoint = `https://${apiId}.execute-api.${process.env.AWS_REGION}.amazonaws.com/${stage}`

  // 送信元コネクションにエンドポイントURLとコネクションIDを送信する
  const apiGateway = new ApiGatewayManagementApi({apiVersion: '2018-11-29', endpoint})
  const params = {Data: JSON.stringify({endpoint, connectionId, request: body}), ConnectionId: connectionId}
  await apiGateway.postToConnection(params).promise()

  return {}
}
```

接続時と切断時は特に何もしないので、そのまま正常終了させます。
ちなみに接続時と切断時にもメッセージ受信時と同等のイベント情報は含まれているので、ここで色々な処理を実装することも可能です。

```javascript
const mockHandler = (_event, _context, callback) => callback(null, {})
```

そして [serverless.yml](https://github.com/mryhryki/example-aws-api-gateway-websocket/blob/main/serverless.yml#L24-L38) で `WebSocket API` のイベントと `Lambda` を紐付けています。

```yaml
onConnect:
  handler: "index.onConnect"
  events:
    - websocket:
        route: "$connect"
onMessage:
  handler: "index.onMessage"
  events:
    - websocket:
        route: "$default"
onDisconnect:
  handler: "index.onDisconnect"
  events:
    - websocket:
        route: "$disconnect"
```

[README](https://github.com/mryhryki/example-aws-api-gateway-websocket/blob/main/README.md) に従って実行すると、WebSocket API をデプロイできます。

```bash
$ npm run setup
# `.env` ファイルを編集

$ npm run deploy
(略)
endpoints:
  wss://xxxxxxxxxx.execute-api.(AWS_REGION).amazonaws.com/dev
(略)
```

`wss://....` のURLは、後で使用するのでメモしておきます。

ちなみに使い終わったら以下のコマンドで削除できます。

```bash
$ npm run remove
```

## wscat と AWS CLI を使って動作確認してみる

[wscat](https://www.npmjs.com/package/wscat) という WebSocket のクライアントと AWS CLI を使って、簡単に WebSocket API の動作確認をしてみましょう。
先に結果を紹介するとこんな感じです。

![websocket experiment](https://i.gyazo.com/4ad51c9bafc17546825378af16adbc26.gif)

何をやっているか順番に説明します。

まず以下のコマンドで `wscat` を起動して、API Gateway の WebSocket 用エンドポイントに WebSocket で接続します。
（実際に試す場合は、デプロイ時に出力されたURLを指定してください）

```bash
$ npx wscat -c 'wss://xxxxxxxxxx.execute-api.(AWS_REGION).amazonaws.com/dev'
```

これは WebSocket 経由で `{}` というデータを送信しています。（wscat で入力した内容はそのまま WebSocket で送信されます）
送信したデータは、WebSocket API 経由で `Lambda` が処理をして、エンドポイントURLとコネクションIDが入ったメッセージ（JSON）を生成します。
そのメッセージを WebSocket 経由で受信して表示されています。

```
> {}
< {"endpoint":"https://lxhspujxjd.execute-api.us-east-1.amazonaws.com/dev","connectionId":"WqK8Ie4IIAMCEdA=","request":"{}"}
```

そうして取得したエンドポイントURLとコネクションIDを使い、別のターミナルから AWS CLI で `{"test":"data"}` というメッセージを送信します。

```bash
$ aws apigatewaymanagementapi post-to-connection \
    --data '{"test":"data"}' \
    --endpoint-url 'https://lxhspujxjd.execute-api.us-east-1.amazonaws.com/dev' \
    --connection-id 'WqK8Ie4IIAMCEdA='
```

そうすると `wscat` 側で `{"test":"data"}` というメッセージを受信します。

```
< {"test":"data"}
```

これで API Gateway を経由した WebSocket でのデータ受信が確認できました。

ポイントは、エンドポイントURLとコネクションIDがあれば、AWS CLI や SDK を使ってメッセージの送信ができるということです。
特にコネクションIDをどのように管理していくかを、実装時に注意していく必要があります。



# WebSocket API の実装例

WebSocket API を使って様々な実装が可能ですが、ここでは２つの例を紹介します。

## Lambda + DynamoDB

サーバーレスに実装するのなら、おそらくスタンダードな構成です。
AWSからの発表時にも、この構成でサンプルが紹介されていました。
[[発表]Amazon API GatewayでWebsocketが利用可能 | Amazon Web Services ブログ](https://aws.amazon.com/jp/blogs/news/announcing-websocket-apis-in-amazon-api-gateway/)

構成図にするとこんな感じです。
（[Cloudcraft](https://www.cloudcraft.co/) というサービスで作っています）

![Lambda + DynamoDB](https://i.gyazo.com/cccf94a5b1f806138a7a839274b0ee3e.png)

バックエンドの処理を Lambda で実行し、コネクションIDを管理するデータストアとして DynamoDB を使用します。
サーバーレスな構成で、コネクション数が増えても自動的にスケールし、料金も従量課金です。

ただし、別のアプリケーションサーバーと連携する場合は、何らか連携する仕組みを作る必要があります。
実験で行ったように WebSocket 経由でコネクションIDを取得し、クライアントが別途アプリケーションサーバーに送信する、というのも1つの手です。
しかし、この辺りはアプリケーションの要件によって異なるので、その都度考えていく必要があります。

## HTTPバックエンド

WebSocket 自体の管理を API Gateway に任せ、残りは全て自前のHTTPサーバーで受け付ける例です。
構成図としてはこんな感じです。（シンプルなのであまり意味はないですが）

![http backend](https://i.gyazo.com/8ec8bf9112988aba483f84ba2ee9335a.png)

自前のサーバーなので、後はコネクションIDの管理などは RDS なり Redis なり自由に実装できます。
自由度は高いですが、自前のHTTPサーバーの管理が必要になります。

また、HTTPバックエンドを指定して送られてくるデータを調べてみたのですが、コネクションIDは開始時にしか送られていないようでした。
HTTPバックエンドを使ったことがなく詳細に調べてもいないので、対応する方法は他にあるかもしれません。
もし詳しい方がおられましたらコメントいただけると幸いです。

以下に調査した結果を載せておきます。

### コネクション開始時

```http request
POST /connect HTTP/1.1
content-length: 0
host: 1d5e52b811b9.ngrok.io
sec-websocket-extensions: permessage-deflate; client_max_window_bits
sec-websocket-key: I84zv8KHNRzb3Szo8cireQ==
sec-websocket-version: 13
user-agent: AmazonAPIGateway_lxhspujxjd
x-amzn-apigateway-api-id: lxhspujxjd
x-amzn-trace-id: Root=1-5fc14bec-16170b9451248e1e10b6e6ae
x-forwarded-for: 115.162.104.13, 3.216.142.111
x-forwarded-port: 443
x-forwarded-proto: https, https
```

### メッセージ受信時

```http request
POST /default HTTP/1.1
content-length: 2
content-type: application/json; charset=UTF-8
host: 1d5e52b811b9.ngrok.io
user-agent: AmazonAPIGateway_lxhspujxjd
x-amzn-apigateway-api-id: lxhspujxjd
x-forwarded-for: 3.216.142.44
x-forwarded-proto: https

{}
```

### コネクション切断時

```http request
POST /disconnect HTTP/1.1
content-length: 0
host: 1d5e52b811b9.ngrok.io
user-agent: AmazonAPIGateway_lxhspujxjd
x-amzn-apigateway-api-id: lxhspujxjd
x-api-key:
x-forwarded-for: , 3.216.142.125
x-forwarded-proto: https
x-restapi:
```



# WebSocket API の料金

WebSocket API は接続時間と、メッセージの送受信量に応じて課金されます。
ここでは簡単に料金を紹介します。
（最新の正確な料金は [公式ドキュメント](https://aws.amazon.com/jp/api-gateway/pricing/) を確認してください）

## 注意事項

1. `ap-northeast-1` (東京リージョン) の料金です。
1. 日本円への変換は `$1 = 100円` で計算しています。

## 接続時間に応じた料金

100万分の接続に対して、$0.315かかります。
例えば、１万人のユーザーが１人あたり月に1000分（約16時間）接続したら31.5円かかる計算です。

## メッセージの送受信量に応じた料金

メッセージの送受信量は、32KB単位で計算されます。
１メッセージ32KB以下であれば、10億回につき$1.26かかります。
例えば、１万人のユーザーが32KB以下のメッセージを１人あたり月に10万回送受信したら126円かかる計算です。



# おわりに

API Gateway の WebSocket API は、WebSocket のコネクションを管理してくれるできるサービスです。
エンジニアはコネクションをIDで管理して、受信時と送信時の処理だけ集中して実装できます。
手軽に WebSocket を扱えるようになるので、リアルタイムなメッセージ送受信が必要になった時は積極的に使っていきたいですね。
