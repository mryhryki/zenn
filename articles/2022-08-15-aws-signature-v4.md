---
title: "AWS Signature v4 を TypeScript でスクラッチ実装してみた"
emoji: "🔑"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["AWS"]
published: false
---

# はじめに

この記事は TypeScript を使い AWS Signature V4 をスクラッチで実装してみた記録です。
目的としては、AWS の API リクエストをする時の認証についてよく知らなかったので、勉強がてら 実装してみようと思った次第です。

基本的に 以下の AWS 公式ドキュメントにある内容を実装しただけです。
https://docs.aws.amazon.com/ja_jp/general/latest/gr/sigv4_signing.html

この記事で紹介するサンプルコードは、以下の Gist からの抜粋です。
コード全体を見たい場合は、こちらの Gist を見てもらうと良いと思います。
https://gist.github.com/mryhryki/58a1ad77a5e3f3ff14c23324c7b346af

いくつか動作確認はしていますが、すべての場合において正しく動作するかは不明です。
この記事内および上記の Gist のコードは自由に使っていただいて構いませんが、自己責任でご使用ください。
プロダクション環境で使う時は [AWS SDK for JavaScript](https://www.npmjs.com/package/aws-sdk) を使うことを強くおすすめします



# 前提

## 動作環境

今回は Deno で動かせるコードにしています。
単純に TypeScript を手軽に動かしやすいから、が理由です。

セットアップ方法は、以下のリンクから確認してください。
https://deno.land/manual/getting_started/installation

また、特別なライブラリは使用していないので、以下のように修正すれば Node.js でも実行できるようになると思います。（動作は未確認です）

### 環境変数の取得方法を変更する

```diff
- const getOptionalEnv = (key: string): string | null | undefined => Deno.env.get(key);
+ const getOptionalEnv = (key: string): string | null | undefined => process.env[key];
```

### `node:crypto` モジュールの中身をグローバルにセットしておく

Node.js には crypto がグローバルに存在しないので。

```diff
+ import crypto from "node:crypto";
+ globalThis.crypto = crypto.webcrypto;
```

## バイナリデータの扱い

今回は分かりやすくするために、バイナリデータの扱いは `Uint8Array` に統一して実装しています。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array

# ユーティリティ関数

いくつか変換に使用するための関数を実装しているので紹介します。

## テキスト -> バイナリ (Uint8Array) 変換

```typescript
const textToBin = (text: string): Uint8Array => new TextEncoder().encode(text);
```

## バイナリ (Uint8Array) -> テキスト (Hex) 変換

```typescript
const binToHexText = (buf: Uint8Array): string =>
  [...buf].map((b): string => b.toString(16).padStart(2, "0")).join("");
```

## SHA-256 の算出

```typescript
const digestSha256 = async (data: Uint8Array): Promise<Uint8Array> =>
  new Uint8Array(await crypto.subtle.digest("SHA-256", data));
```

## HMAC-SHA256 の算出

```typescript
const hmacSha256 = async (key: Uint8Array, message: Uint8Array): Promise<Uint8Array> => {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, true, ["sign"]);
  const signedData = await crypto.subtle.sign("HMAC", cryptoKey, message);
  return new Uint8Array(signedData);
};
```

https://stackoverflow.com/a/56416039 を参考にしました。


# AWS Signature v4 の実装

既に書いたとおり、コードの全体像は Gist に置いています。
https://gist.github.com/mryhryki/58a1ad77a5e3f3ff14c23324c7b346af

以下はこのコードの部分部分を解説しているものになります。

## インターフェース

今回は [Request](https://developer.mozilla.org/ja/docs/Web/API/Request) オブジェクトを受け取り、生成した署名を設定した [Request](https://developer.mozilla.org/ja/docs/Web/API/Request) オブジェクトを返すような関数で実装します。


```typescript
const signRequest = async (request: Request, params: AwsParams): Promise<Request> => {
  // ...
  return signedRequest;
}
```

また、第２引数に AWS のパラメーターを設定するようにしています。
これは単にテストがしやすいからという理由です。

## 日時データの取得

内部で何度か日時、日付の文字列が必要になります。
標準の `Date` オブジェクトで十分そうだったので、以下のようなコードで取得するようにしました。

```typescript
const dateTimeText = new Date().toISOString().replace(/\.[0-9]{3}/, "").replace(/[-:]/g, "");
const dateText = dateTimeText.substring(0, 8);

console.log(JSON.stringify({ dateTimeText, dateText }));
// => {"dateTimeText":"20220814T084035Z","dateText":"20220814"}
```

## Step1: 正規リクエストの作成

HTTP リクエストの情報から SHA-256 文字列を生成します。
以下の内容に沿って実装します。

https://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html

まず、URL に含まれるクエリパラメーターをキー名の昇順で並べ替えた文字列を生成します。

```typescript
const canonicalQueryString = Array.from(url.searchParams.entries())
  .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
  .sort()
  .join("&");
```

ヘッダーの小文字に変換した名前と値を整形し、 `:` で結合し、名前の昇順に並び替えた文字列を生成します。
すべてのヘッダーの内容を入れる必要はないですが、最低 `Host` ヘッダーを含める必要があるようです。

```typescript
const canonicalHeaders: string = Array.from(signedHeaders.entries())
  .map(([key, val]) => `${key.toLowerCase().trim().replace(/ +/g, " ")}:${val.trim().replace(/ +/g, " ")}\n`)
  .sort()
  .join("");
```

ヘッダーの名前を小文字に変換し、名前の昇順に並び替えた文字列を生成します。

```typescript
const signedHeadersText: string = Array.from(signedHeaders.entries())
  .map(([key]) => key.toLowerCase())
  .sort()
  .join(";");
```

リクエストボディの内容から SHA-256 を算出します。

```typescript
  const hashedPayload: string = binToHexText(await digestSha256(new Uint8Array(await request.clone().arrayBuffer())));
```

リクエストメソッドやパスとここまでで算出した内容を、改行文字で結合します。

```typescript
  const canonicalRequest: string = [
    request.method,
    url.pathname,
    canonicalQueryString,
    canonicalHeaders,
    signedHeadersText,
    hashedPayload,
  ].join("\n");
```

その文字列の SHA-256 を算出すれば完了です。

```typescript
  const hashedCanonicalRequest: string = binToHexText(await digestSha256(textToBin(canonicalRequest)));
```

## Step2: 署名文字列の作成

署名アルゴリズム、日付、認証スコープ、正規リクエストの情報を改行文字で結合します。

https://docs.aws.amazon.com/ja_jp/general/latest/gr/sigv4-create-string-to-sign.html

特に説明するようなことはない、シンプルな処理です。

```typescript
const stringToSign: string = [
  "AWS4-HMAC-SHA256",
  dateTimeText,
  `${dateText}/${awsRegion}/${awsService}/aws4_request`,
  hashedCanonicalRequest,
].join("\n");
```

## Step3: 署名を算出

HMACとシークレットアクセスキーを使って、リクエストデータを署名します。

https://docs.aws.amazon.com/ja_jp/general/latest/gr/sigv4-calculate-signature.html

AWSシークレットアクセスキー、日付、リージョン、サービスの情報を使って、HMAC-SHA256 を計算します。
文字列をまとめて計算するのではなく、何度も計算結果に対して HMAC-SHA256 を計算するのは、AWSシークレットアクセスキーをなるべく特定困難にしたいとかなんですかね。（単なる推測です）

```typescript
const kDate = await hmacSha256(textToBin(`AWS4${awsSecretAccessKey}`), textToBin(dateText));
const kRegion = await hmacSha256(kDate, textToBin(awsRegion));
const kService = await hmacSha256(kRegion, textToBin(awsService));
const kSigning = await hmacSha256(kService, textToBin("aws4_request"));
const signature = binToHexText(await hmacSha256(kSigning, textToBin(stringToSign)));
```

最終的に署名文字列が生成されます。

## Step4: リクエストに署名を追加

リクエストヘッダーに署名データを追加します。
（クエリパラメーターに設定することも可能ですが、本記事では対象外とします）

https://docs.aws.amazon.com/ja_jp/general/latest/gr/sigv4-add-signature-to-request.html

認証情報の範囲などを定義した文字列を生成します。

```typescript
const credential = [awsAccessKeyId, dateText, awsRegion, awsService, "aws4_request"].join("/");
```

最後に生成した署名などの情報を `Authorization` ヘッダーにセットすれば署名の完了です。

```typescript
const signedRequest = request.clone();
const authorization = `${AwsSignatureAlgorithm} Credential=${credential}, SignedHeaders=${signedHeadersText}, Signature=${signature}`;
signedRequest.headers.set("Authorization", authorization);
```

## APIリクエストを試す

実装ができたら、実際に API リクエストを試したいですね。
今回は [STS](https://docs.aws.amazon.com/ja_jp/STS/latest/APIReference/welcome.html) の [GetCallerIdentity](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html) へリクエストしてみました。

こんな感じでリクエストを組み立てて、実装した署名関数 (`signRequest`) にわたすと署名ができます。

```typescript
const awsRegion = "ap-northeast-1";
const awsService = "sts";
const signedRequest = await signRequest(
  new Request(`https://${awsService}.${awsRegion}.amazonaws.com/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "identity",
      "Accept": "application/json",
    },
    body: "Action=GetCallerIdentity&Version=2011-06-15",
  }),
  {
    awsRegion,
    awsService,
    awsAccessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID"),
    awsSecretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY"),
    awsSessionToken: getOptionalEnv("AWS_SESSION_TOKEN"),
  },
);
```

署名さえ付与できれば、あとは単なる HTTP リクエストなので、普通に `fetch` で取得できます。

```typescript
const response = await fetch(signedRequest);
```

レスポンスからデータを取り出して表示されればOKです。

```typescript
console.log(JSON.stringify(await response.json(), null, 2));
```

ちなみに CLI からも簡単に呼び出せます。
同じデータが取得できていれば成功です。

```shell
$ aws sts get-caller-identity
```

# おわりに

読み解いていくと、要素は多いもののやっていることは意外とシンプルでした。
しかし、実装してみたら単純なミス (typo や渡すべき値が違うなど) で結構引っかかり、またエラーメッセージから何が間違いなのか分かりづらいことも多かったです。
（認証に関わる部分なので当然ではあります）

あとは、認証に関わる部分を実装してみることで、使用する要素や手法からどのように不正なリクエストから守っているかが分かるのも面白かったです。

最後に大事なことなので何度も書きますが、プロダクション環境で使う時は [AWS SDK for JavaScript](https://www.npmjs.com/package/aws-sdk) を使うことを強くおすすめします。
