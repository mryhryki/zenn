---
title: "Deno で HTTP サーバーを手軽にインターネットへ公開する"
emoji: "🦕"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Deno", "DenoDeploy"]
published: true
canonical: https://zenn.dev/mryhryki/articles/2022-01-03-http-server-on-deno
---

# はじめに

開発している時にテスト用の HTTP サーバーを https で一時的にインターネットに公開したい、そんなことってありませんか？
例えば私の場合、[App Store Server Notifications](https://developer.apple.com/documentation/appstoreservernotifications) のテストをする際に、以下のようなテスト用の HTTP サーバーを用意しました。

- インターネットに公開して Apple からのリクエストを受け付ける
- リクエストボディの中身（Apple からのリクエストデータ）を全部ログに出して中身を見る
- レスポンスを 200 にしたり 500 にしたりして挙動を確認する

その時は [express](https://expressjs.com/) を使った適当なプロジェクトを作って、[ngrok](https://ngrok.com/) を使って一時的にインターネットに公開してテストしました。
しかし、この方法はローカルPCで上げっぱなにしておかねばならず、うっかりスリープ状態になってしまうとちゃんとリクエストが受け付けられなかった、なんてことがあったりしてちょっと面倒でした。

そこで、今回は Deno (+ Deno Deploy) を使って手軽にテスト用の HTTP サーバーをインターネットへ公開する方法を試したので、その記録をまとめます。



# Deno を使って HTTP サーバーを作る

Deno には標準ライブラリに [HTTP Server APIs](https://deno.land/manual@v1.17.1/runtime/http_server_apis) というのがあるので、それを使うと簡単に HTTP サーバーを構築できます。
今回は以下のようなソースコードを作成してみました。

```typescript
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const PORT = 8080;

const handler = async (request: Request): Promise<Response> => {
  console.log("Request:", request.method, request.url);
  const { pathname, search } = new URL(request.url);

  if (request.method === "GET") {
    // GET リクエストの場合は、クエリパラメータを返す
    const data = JSON.stringify({ pathname, search }, null, 2);
    console.log("Request Data:", data);
    return new Response(data, {
      headers: { "Content-Type": "application/json" },
    });
  } else if (request.method === "POST") {
    // POST リクエストの場合は、リクエストボディを返す
    const payload = await request.text();
    const data = JSON.stringify({ pathname, payload }, null, 2);
    console.log("Request Data:", data);
    return new Response(data, {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Not Found", { status: 404 });
};

console.log(`Listening on http://localhost:${PORT}/`);
await serve(handler, { addr: `:${PORT}` });
```

今回はシンプルに以下のような処理にしてみました。

- リクエストされたメソッドとURLをログに出す
- `GET` リクエストの場合は、リクエストされたパスとクエリパラメーターをログに出して、レスポンスにも JSON で返す
- `POST` リクエストの場合は、リクエストされたパスとボディをログに出して、レスポンスにも JSON で返す
- それ以外の場合は `404 Not Found` を返す
 
ここは、テストしたい内容に合わせて適宜変えればOKです。

実装した HTTP サーバーをローカルで動作確認するには、以下のコマンドで実行します。

```shell
$ deno run --allow-net ./get_secret.ts
```

あとは `curl` を実行して、以下のようなレスポンスが返ってくれば確認OKです。

```shell
$ curl http://localhost:8080/test?foo=bar
{
  "pathname": "/test",
  "search": "?foo=bar"
}
```

## 補足：HTTP サーバーの立て方の変遷

Deno で HTTP サーバーを立てるための推奨される方法は色々変わってきたようです。
こちらの記事が詳しくまとまっていて、非常に助かりました。
[Denoでサーバーを建てる方法 2021年11月版](https://zenn.dev/kawarimidoll/articles/8031c2618fedca#deno-native-http)

実はこの記事を書いている途中に、現在は `serve` が推奨されていることを知りました。
（それまでは `Deno.serveHttp` を使う方法でやっていました）
まだメジャーバージョンが `0` なので、色々変わってくるのは仕方ないところではありますね。


# Deno Deploy で公開

Deno Deploy は Deno Land Inc. が提供している Web サービスで、サーバーレス関数を提供しているプラットフォームで、現在はベータ版です。
詳しくは、こちらのスライドを参照していただけると把握しやすいと思います。
[Deno Deploy の話 - toranoana.deno #0](https://talk-deploy-kt3k.deno.dev/#1)

下準備として「Deno を使って HTTP サーバーを作る」を GitHub のリポジトリにプッシュしておきます。
私は以下のリポジトリを用意しました。

https://github.com/mryhryki/example-deno-http-server

Deno Deploy にデプロイするのはとても簡単です。

1. https://deno.com/deploy にアクセス
2. GitHub アカウントでサインアップ or サインイン
3. "New Project" からチュートリアルに従って GitHub リポジトリと連携する
4. デプロイ完了

本当に簡単にデプロイできるので、今回のようにサクッとサーバーを立てたい場合にも非常に便利です。
コード量が少ないというのもあるとは思いますが、GitHub にプッシュしてから数秒で反映されるのも嬉しいポイントです。

## 公開したHTTPサーバーにアクセス

デプロイが完了したら、実際にアクセスしてみます。
私のプロジェクトでは `https://example-deno-http-server.deno.dev` という URL が割り当てられたので、そこに対して `GET` と `POST` リクエストを発行してみます。

```shell
$ curl 'https://example-deno-http-server.deno.dev/?uuid=0a38784d-7f81-49ae-9a91-454f67f05e6f'
{
  "pathname": "/",
  "search": "?uuid=0a38784d-7f81-49ae-9a91-454f67f05e6f"
}
```

```shell
$ curl -XPOST -d 'UUID: 0a38784d-7f81-49ae-9a91-454f67f05e6f' 'https://example-deno-http-server.deno.dev/post_request'
{
  "pathname": "/post_request",
  "payload": "UUID: 0a38784d-7f81-49ae-9a91-454f67f05e6f"
}
```

意図したレスポンスが返ってきました。

## ログを確認

Deno Deploy では、Web UI から簡単にログが確認できます。
以下のように `console.log` の内容が出力されていることが確認できました。

```
0	2022-01-02 14:17:19	[Info]	Request Data: {
  "pathname": "/post_request",
  "payload": "UUID: 0a38784d-7f81-49ae-9a91-454f67f05e6f"
}
1	2022-01-02 14:17:19	[Info]	Request: POST https://example-deno-http-server.deno.dev/post_request
2	2022-01-02 14:17:12	[Info]	Request Data: {
  "pathname": "/",
  "search": "?uuid=0a38784d-7f81-49ae-9a91-454f67f05e6f"
}
3	2022-01-02 14:17:12	[Info]	Request: GET https://example-deno-http-server.deno.dev/?uuid=0a38784d-7f81-49ae-9a91-454f67f05e6f
4	2022-01-02 14:17:12	[Info]	Listening on http://localhost:8080/
5	2022-01-02 14:17:12	[Debug]	isolate start time: 128 milliseconds
```

![Deno Deploy Log](https://mryhryki.com/file/cW02Nk03R2_oTtCy-hCSVtKG8Z0hhHZ.png)



# おまけ： Docker イメージにする

Deno Deploy が使えない時のために、汎用的に使える Docker イメージも作ってみました。
今回の用途であれば５行程度の簡単な `Dockerfile` で作れます。

```dockerfile
FROM denoland/deno:1.17.1
COPY ./index.ts ./index.ts

EXPOSE 8080
RUN deno cache ./index.ts
CMD ["run", "--allow-net", "./index.ts"]
```

あとはビルドして、イメージを適当なサービスで走らせればOKです。
私は [AWS App Runner](https://aws.amazon.com/jp/apprunner/) を使って試してみましたが、AWS アカウントを持っていてば非常に簡単に動かすことができました。

とはいえ、Deno Deploy の方が更に簡単ではあるので、Deno で作るなら Deno Deploy を積極的に使っていきたいです。



# おわりに

最近 Deno に慣れるために、簡単なスクリプトや使い捨てのコードを Deno でよく作っているんですが、非常に使い勝手が良いです。

Deno Deploy は現在ベータ版で、無料で使えるところも嬉しいですね。
[正式リリース後もある程度の無料枠がある予定](https://talk-deploy-kt3k.deno.dev/#8) ということなので、こちらも期待したいところです。



# 参考リンク

- [Denoでサーバーを建てる方法 2021年11月版](https://zenn.dev/kawarimidoll/articles/8031c2618fedca#deno-native-http)
- [Deno Deploy の話 - toranoana.deno #0](https://talk-deploy-kt3k.deno.dev/#1)
- [Deno 1.13.0 がリリースされたので新機能や変更点の紹介](https://zenn.dev/magurotuna/articles/deno-release-note-1-13-0#1.-%E3%83%8D%E3%82%A4%E3%83%86%E3%82%A3%E3%83%96-http-%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E5%AE%9F%E8%A3%85%E3%81%AE%E5%AE%89%E5%AE%9A%E5%8C%96)
- [2021年のDenoの変更点やできごとのまとめ](https://zenn.dev/uki00a/articles/whats-new-for-deno-in-2021#%E3%83%8D%E3%82%A4%E3%83%86%E3%82%A3%E3%83%96http%E3%82%B5%E3%83%BC%E3%83%90)
