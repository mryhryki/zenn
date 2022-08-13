---
title: "esbuild を使って AWS Lambda (Node.js) を2秒でアップデートする"
emoji: "⚡"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["esbuild", "lambda"]
published: true
---

# はじめに

[esbuild](https://esbuild.github.io/) のビルド時間の速さに感動して、個人プロダクトで使っている AWS Lambda (Node.js) をなるべく速く更新できるようにしたいな、と思ってやってみた投稿です。



# おことわり

タイトルに2秒と書いていますが、当然どんな環境でも2秒でできるわけではありませんのでご注意ください。

- 使用するソースコードの内容によって、デプロイする時間も変わります
- インターネットの回線速度やAWSリージョンによって、デプロイする時間も変わります
  - 参考までに、私の通信速度はこのぐらいでした。
  - ![image.png](https://i.gyazo.com/3cdde0855467b8e03f337133b16f0618.png)
- その他 AWS の状況などの要因でも変わるかもしれません。

「参考：私の個人環境の場合」の章にも書いていますが、私が実際に使っている Lambda 関数は約4.2秒でアップデートできます。



# 高速にデプロイしたい理由

ローカルでも AWS Lambda の環境をある程度まで再現して開発することは可能です。

しかし、私の経験では API Gateway + Lambda で API を使っている場合に、リクエストにどんな値がどこに入っているのかや、バイナリデータをやり取りする時など、実環境の挙動を確認しながら開発を行いたい場合が何度かありました。

そういった場合、可能な限りソースコードを編集してから Lambda をアップデートする時間を短くできると、効率よく開発できると考えます。



# サンプルソース

本記事で使ったソースコードは、以下の GitHub リポジトリに置いています。
もし詳しい設定などが知りたい、という方はこちらを参照してください。

https://github.com/mryhryki/example-update-aws-lambda-fast



# 高速化の方法

順を追って Lambda のアップデートを高速化する方法を説明します。



## 前提：ソースコードの内容

API Gateway を使って API レスポンスを返すためのコードにしています。
固定のレスポンスを返すだけのような最小限のソースコードでは検証として微妙なので、S3 の ListObjectV2 を使って、バケットのオブジェクト一覧を返すようにしてみました。

```typescript
import { S3 } from "aws-sdk";
const s3 = new S3({ apiVersion: "2006-03-01" });
const Bucket: string = process.env.S3_BUCKET;

export const handler = async (): Promise<any> => {
  const result = await s3.listObjectsV2({ Bucket }).promise();

  return {
    statusCode: 200,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(result, null, 2)
  }
}
```



## 検証１：Serverless Framework を使ったデプロイ（52.7s)

[Serverless Framework](https://www.serverless.com/) を使って、AWS 環境にデプロイしました。
[serverless-esbuild](https://www.serverless.com/plugins/serverless-esbuild) というプラグインを使って、esbuild でのビルドを行っています。
内容が膨大なのとあまり本質ではないので詳しい設定は割愛しますが、詳しい設定などを見たい方はリポジトリを参照してください。

実行してみます。

```bash
$ time npm run aws:deploy

> aws:deploy
> serverless deploy

Serverless: Compiling with esbuild...
Serverless: Compiling completed.
Serverless: Zip service example-update-aws-lambda-fast - 924.87 KB [68 ms]
Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service example-update-aws-lambda-fast.zip file to S3 (924.87 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.....
Serverless: Stack update finished...
Service Information
service: example-update-aws-lambda-fast
stage: prod
region: ap-northeast-1
stack: example-update-aws-lambda-fast-prod
resources: 8
api keys:
  None
endpoints:
  GET - https://82yg1oiim5.execute-api.ap-northeast-1.amazonaws.com/
functions:
  index: example-update-aws-lambda-fast-prod-index
layers:
  None

real    0m52.693s
user    0m3.929s
sys     0m0.766s
```

`52.7s` という結果でした。
（※これは２回目のデプロイの結果です。初回デプロイはAWSリソースを作る関係で特に時間がかかるので除外しました）

このデプロイ方法は CloudFormation を使うため、どうしても時間がかかってしまいます。
関数のみアップデートする場合であれば、次の関数のみのアップデートを行うのが一般的かな、と思います。



## 検証２：Serverless Framework を使った関数のみのアップデート (3.6s)

Serverless Framework には関数のみをデプロイする機能があるので、それを使って Lambda を更新してみます。

```json
{
  ...
  "scripts": {
    "deploy:byServerless": "serverless deploy --function index",
  ...
}
```

```bash
$ time npm run deploy:byServerless

> deploy:byServerless
> serverless deploy --function index

Serverless: Compiling with esbuild...
Serverless: Compiling completed.
Serverless: Zip service example-update-aws-lambda-fast - 924.87 KB [57 ms]
Serverless: Packaging function: index...
Serverless: Code not changed. Skipping function deployment.
Serverless: Configuration did not change. Skipping function configuration update.

real    0m3.590s
user    0m2.710s
sys     0m0.616s
```

`3.6s` ぐらいになりました。
この時点でもなかなか速いですし、設定も簡単なのでこのぐらいで良しとするのも全然ありだと思います。

しかし、今回はもっと速くしてみたかったので、次の章で自前で Lambda アップデート処理を書いて見ることにしてみました。



## 検証３：自前で Lambda アップデート処理を書く（2.2s）

`Serverless Framework` を使った場合、チェックなどの処理に多少時間がかかっているようでした。

今回は最速を目指したいので、そういった処理をなるべく省くべく、esbuild と AWS SDK for JavaScript を使って自前で  Lambda アップデートの処理を書いていこうと思います。


### ビルド設定

esbuild でのビルド設定を `package.json` にこんな感じで追記しておきます。

```json
{
  ...
  "scripts": {
    "build": "esbuild src/index.ts --outfile=dist/index.js --bundle --minify --platform=node --target=node14",
  ...
}
```

試しに実行してみます。

```bash
$ time npm run build

> build
> esbuild src/index.ts --outfile=dist/index.js --bundle --minify --platform=node --target=node14


  dist/index.js  5.4mb ⚠️

⚡ Done in 171ms

real    0m0.549s
user    0m1.045s
sys     0m0.563s

```

0.549s でビルド完了です。
体感的には本当に一瞬で終わります。
この速度は、本当に感動します。


### AWS SDK for JavaScript を使った Lambda のアップデート処理

よりシンプルに Lambda をアップデートするだけにしたいので、[AWS SDK for Javascript](https://aws.amazon.com/jp/sdk-for-javascript/) を使って処理を書いてみます。

```javascript
const fs = require("fs/promises");
const path = require("path");
const {Lambda} = require("aws-sdk");

const lambda = new Lambda({apiVersion: "2015-03-31"});
const functionName = 'example-update-aws-lambda-fast-prod-index';

(async () => {
  const zipFile = await fs.readFile(path.resolve(__dirname, "lambda.zip"));
  await lambda.updateFunctionCode({
    FunctionName: functionName,
    ZipFile: zipFile,
    Publish: true,
  }).promise();
})()
```

### 統合

Lambda にアップロードするための Zip 化する処理も合わせて、以下のように `package.json` を記述します。

```json
{
  ...
  "scripts": {
    "build": "esbuild src/index.ts --outfile=dist/index.js --bundle --minify --platform=node --target=node14",
    "deploy": "run-s build zip update",
    "deploy:aws": "node scripts/update_lambda.js",
    "zip": "zip scripts/lambda.zip dist/index.js",
    ...
  }
```

実行してみます。

```bash
$ time npm run deploy

> deploy
> run-s build zip update


> build
> esbuild src/index.ts --outfile=dist/index.js --bundle --minify --platform=node --target=node14


  dist/index.js  5.4mb ⚠️

⚡ Done in 168ms

> zip
> zip scripts/lambda.zip dist/index.js

updating: dist/index.js (deflated 87%)

> update
> node scripts/update_lambda.js


real    0m2.248s
user    0m2.085s
sys     0m0.841s
```

`2.2s` ぐらいに短縮されました！
※タイトルの2秒はこの結果を使っています。

おそらくこれが最速なんじゃないかな〜、と思いますので、今回の検証はここまででやめました。



## 参考：私の個人環境の場合（4.2s）

私が個人開発で使っているソースコードを「自前で Lambda アップデート処理を書く」の方法でアップデートした場合の結果は以下のとおりです。

- AWSリージョン: `us-east-1` (バージニア）
  - この記事内は `ap-northeast-1` (東京) を使っているので、物理的に遠くなります。
- Lambda の Zip ファイルのサイズ: `1.8MB`
  「自前で Lambda アップデート処理を書く」の Zip ファイルのサイズは `725KB` だったので、約2.5倍です。

この環境で約4.2秒でデプロイできます。
2秒とまではいきませんが、これでも体感的には十分快適にデプロイができます。



# nodemon を使ってソースコードの変更するたびに Lambda をアップデートする

高速化できたので、後はソースコードを変更するたびに Lambda をアップデートできるように設定しましょう。
普通に [nodemon](https://nodemon.io/) を使って、以下のように `"scripts"` に追加すればOKです。

```json
{
  ...
  "scripts": {
    "dev": "nodemon --watch src/ --ext ts --exec 'npm run deploy'",
  ...
}
```

以下のキャプチャのように、変更をすぐ反映しながら開発ができます。

- 左: ソースコードを編集しています。
- 右上: １秒のインターバルをはさみながら、curl で API を呼び、ステータスコードを表示しています。
- 右下: nodemon を使って変更のたびに Lambda を更新しています。

![capture](https://i.gyazo.com/e045c22928c631646058d0fce12d2efb.gif)



# 補足：型チェックについて

esbuild は型チェックを飛ばしているので、IDE でチェックしたり、以下のように CLI でチェックしたりしてください。

```json
{
  ...
  "scripts": {
    "typecheck": "tsc src/index.ts --noEmit",
    ...
}
```

## 参考

> ts-node では実行時に型チェックをしてくれますが、 esbuild では型チェックそのものをスキップします。

https://zenn.dev/januswel/articles/451789fb5d29fbcd3932



# まとめ

esbuild と AWS SDK for JavaScript を使うと、高速に Lambda を更新できることができました。

私はこれと [awslogs](https://github.com/jorgebastida/awslogs) を組み合わせて使って（数秒〜十数秒程度のラグはありつつも）かなりリアルタイムに変更〜実際の環境で動いたログの取得までを行っています。
実際に動く環境を高速にアップデートできると「ローカルで動くのに本番で動かない〜」みたいな時にかなり原因調査や対応が捗ります。

必ずしも全ての環境で使った方が良いとは思いませんが、場合によっては有効な場面もあると思いますので、良ければ参考にしてみてください。
