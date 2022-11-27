---
title: "S3のマルチパートアップロードを理解して、異なるS3サービス間でも大容量ファイルを効率良くコピーする"
emoji: "🆙"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["AWS", "S3"]
published: false
---

この記事は [コネヒトアドベントカレンダー](https://qiita.com/advent-calendar/2022/connehito) 1日目の記事です。

# はじめに

S3 って便利ですよね。
容量無制限で従量課金、99.999999999% のデータ耐久性がある便利なサービスです。
AWS 初期からあるのも納得の便利サービスで、AWSでよく使うサービスの一つです。

そんな便利なサービスなので、S3 互換をうたうサービスも多く存在します。
私は個人的に [Wasabi](https://wasabi.com/) というサービスも併用しています。

S3 は便利ですが、S3 で5GB以上の大容量ファイルを扱うには、マルチパートアップロードについて理解しておく必要があります。

# 想定読者

この記事は以下のような方を想定して書いています。

- S3 のマルチパートアップロードについて知りたい方
- 異なる S3 サービス間で大容量のデータを効率よくコピーしたい方
- AWS SDK や REST API で大容量のデータを扱いたい方

## 補足: AWS CLI ではマルチパートアップロードを自動的に使ってくれる

AWS CLI の `aws s3 cp` や　`aws s3 sync` を実行すれば、サイズに応じてマルチパートアップロードを使ってくれるようです。

> aws-cliのaws s3 cpコマンドによるアップロードは、ファイルサイズが8〜9MB以上になると自動的に分割しマルチパート＆並列アップロードをしてくれます。同様にダウンロードについてもファイルサイズがある程度（12MB以上？）大きいと分割し並列ダウンロードをしてくれます。
>
> https://dev.classmethod.jp/articles/aws-s3-multipart-upload/

なので、AWS CLI を使えばマルチパートアップロードを意識する必要はありません。

例えば、AWS 内のバケット間でコピーする場合は、以下のようなコマンドで簡単に実行できます。

```shell
$ aws s3 cp s3://source-bucket/path/to/file s3://destination-bucket/path/to/file
 or
$ aws s3 sync s3://source-bucket/prefix/ s3://destination-bucket/prefix/
```

# マルチパートアップロードとは

５GBを超えるファイルをアップロードするために使用できるアップロードの方法です。

> マルチパートアップロード API を使用すると、最大 5 TB のサイズの単一の大容量オブジェクトをアップロードできます。
>
> マルチパートアップロード API は大容量オブジェクトのアップロードを効率よく行えるように設計されています。1 つのオブジェクトをいくつかに分けてアップロードできます。オブジェクトのパートは、単独で、任意の順序で、または並行してアップロードできます。マルチパートアップロードは 5 MB～5 TB のオブジェクトで使用できます。詳細については、マルチパートアップロードを使用したオブジェクトのアップロードとコピー を参照してください。
>
> https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/upload-objects.html

バケット間でデータコピーする場合の、マルチパートアップロードのイメージは以下のような感じです。

![How does MultipartUpload work?](https://mryhryki.com/file/UBq6NkABktw0eQBVd7g3VRSgWpgN9BNjFa5M3N6UhzzZbPUw.webp)

1. CreateMultipart でマルチパートアップロードを開始します
  - アップロードする領域を用意するようなイメージかな、と思います。
2. 以下のどちらかの方法で、オブジェクトを分割しながらコピーします
  - UploadPartCopy を使う（同一サービス内の場合）
  - GetObject と UploadPart を使う（別サービス間でコピーする場合）
3. すべてのコピーが完了したら CompleteMultipartUpload で完了する
  - CompleteMultipartUpload が正常に終了して始めて単一オブジェクトとしてアクセスできます


# S3 のコピーの方法

S3 間でのコピーする方法は、大きく分けて以下の４パターンがあります。

| No  | 方法                                                  |        容量         |    適用範囲    |
|:---:|:----------------------------------------------------|:-----------------:|:----------:|
|  1  | CopyObject を使う方法                                    |      0B〜5GB       | 同一サービス内のみ  |
|  2  | UploadPartCopy を使う方法<br>(マルチパートアップロード)              | 5MB〜5,000GB (5TB) | 同一サービス内のみ  |
|  3  | GetObject + PutObject を使う方法                         |      0B〜5GB       | 別サービス間でもOK |
|  4  | GetObject + UploadPart<br/> を使う方法<br>(マルチパートアップロード) | 5MB〜5,000GB (5TB) | 別サービス間でもOK |


# マルチパートアップロードを使うメリット

## PutObject の制限を受けない

PutObject は 5GB までのアップロードしか対応できません。

> 1 回の PUT オペレーションでは、最大 5 GB の単一のオブジェクトをアップロードできます。
>
> https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/upload-objects.html

そのため 5GB を超えるオブジェクトをアップロードしようと思った場合は、マルチパートアップロードが必須になります。

## 細かくアップロードできるのでリトライなどの制御がしやすい

大容量のファイルを一度にアップロードする場合、途中でネットワークエラーなどが発生すると最初からやり直しになります。
マルチパートアップロードは最小で5MB単位でアップロードでき、失敗してもリトライ範囲が小さくできるので、5GB 未満であってもマルチパートアップロードを使うメリットがあるかもしれません。
（ただし、制御は自分でやる必要があります）

## 並列にアップロードすることで高速化できる（かもしれない）

これは使っている回線速度などにも依存すると思いますが、アップロードを並列化することでアップロードを高速化することができる、かもしれません。
機会があれば検証して追記したいと思います。

## ローカルを経由する場合、空き容量に制限されない

これは、異なる S3 サービス間でファイルを移動する場合など、一度ローカルを経由するようなケースでのメリットです。
大容量ファイルをコピーする場合、通常であれば一度ローカルにダウンロードしてアップロードすると思いますが、最小5MBごとにダウンロード→アップロードすることで、ローカルの保存容量を最小限に済ませることができます。
やり方次第ではメモリ上で完結できるので、ローカルの保存容量を使わないということも可能です。

# マルチパートアップロードのデメリット

## アップロードの手順が複雑

マルチパートアップロードは3〜4種類の　API　を使ってアップロードをする必要があるので、どうしても複雑になってしまいます。

## 5MB 未満のファイルには適用できない

デメリットと言うには微妙ですが、マルチパートアップロードは 5MB 以上のファイルしか使用できません。
そのため、マルチパートアップロードだけでは全てのケースに対応できない、というのは若干のデメリットかもしれません。


# 参考: S3 サービスの使い分け

私は S3 サービスを以下のように使い分けています。

## AWS

ストレージ階層によって特徴があるので使い分けています。

### STANDARD

最低保管期間がない完全な従量課金なので、頻繁に作成・削除するようなケースで使っています。
また CloudFront と連携しやすいので、[小容量のリソースを配信](https://mryhryki.com/) するために使用しています。

### GLACIER DEEP ARCHIVE

保管料金が特に安いので、ほぼ取り出す可能性のない定期バックアップデータとかを入れています。

## Wasabi

AWS S3 の STANDARD よりも保管料金が安く、インターネット転送量も無料なので、一定期間以上保管し、ある程度取り出しが発生する（しそう）なデータを保管しています。

最低1TB/月の保管料金（ap-northeast-1 なら $6.99）がかかる点と、最低オブジェクト保存期間が90日である点に注意してください。

# マルチパートアップロードを中断した場合の注意点

マルチパートアップロード中に中断してしまった場合（CompleteMultipartUpload が完了しなかった場合）、アップロードしたデータが残ってしまいます。
その残ってしまったデータに対しても保管料がかかるので注意してください。

消す方法としては、以下の方法があります。

1. [AbortMultipart](https://docs.aws.amazon.com/AmazonS3/latest/API/API_AbortMultipartUpload.html) をリクエストする
2. S3 のライフサイクルルールで自動削除する設定をする
  - 参考: [不完全なマルチパートアップロードをクリーンアップするための Amazon S3 ライフサイクル設定ルールを検証する](https://aws.amazon.com/jp/premiumsupport/knowledge-center/s3-multipart-cleanup-lifecycle-rule/)
  - 指定した日数が経過し削除されるまでは料金が発生する点に注意してください

`2.` を設定して気づかず残ってしまった場合に備えつつ、`1.` で削除しておく、というのが良いかと思います。

# AWS SDK for JavaScript を使用したマルチパートアップロードの実装

「S3 のコピーの方法」で紹介した４パターン全てを実装して Gist にしています。
JavaScript (TypeScript) での実装例を見たい場合は、こちらも参照してみてください。

https://gist.github.com/mryhryki/99d6821b7b05587ed1c3b688bd76c96d

中でどの　API　を呼び出しているかログに出力しているので、実行した結果だけ以下に記載しておきます。

## 1. CopyObject を使う方法の実行例

5GB　未満のオブジェクトであれば、単純に一回　`CopyObject` を呼び出すだけで実行できます。

```shell
$ npm run CopyObject

...

#### START #####
[CopyObject]
#### END #####
```

## 2. UploadPartCopy を使う方法の実行例

マルチパートアップロードを使うので、以下のような流れになります。

1. `CreateMultipartUpload` を実行する
2. `UploadPartCopy` で部分的なコピーを繰り返す
3. `CompleteMultipartUpload` でマルチパートアップロードを完了させる

```shell
$ npm run UploadPartCopy

...

#### START #####
[CreateMultipartUpload] UploadId: sKaXXXXXXXXXXX5-
[UploadPartCopy #1] 0-5253124 Bytes
[UploadPartCopy #2] 5253125-10506249 Bytes
[UploadPartCopy #3] 10506250-11807690 Bytes
[CompleteMultipartUpload] UploadId: sKaXXXXXXXXXXX5-
#### END #####
```

## 3. GetObject + PutObject を使う方法の実行例

`GetObject` でダウンロードし `PutObject`　でアップロードというわかりやすい流れです。

```shell
$ npm run GetAndPutObject

...

#### START #####
GetObject: 11807691 Bytes
PutObject: 11807691 Bytes
#### END #####
```

## 4. GetObject + UploadPart を使う方法の実行例

マルチパートアップロードを使うので、以下のような流れになります。

1. `CreateMultipartUpload` を実行する
2. `GetObject` で部分的にダウンロードし `UploadPart`　でアップロードする、という流れを繰り返す
3. `CompleteMultipartUpload` でマルチパートアップロードを完了させる

```shell
$ npm run GetObjectAndUploadPart

...

#### START #####
[CreateMultipartUpload] UploadId: q.lXXXXXXXXXXi4-
[GetObject #1] 0-5253124 Bytes
[UploadPart #1] 0-5253124 Bytes, ETag: "1daXXXXXXXXXXXXXXXXXXXXXXXXXXdd7"
[GetObject #2] 5253125-10506249 Bytes
[UploadPart #2] 5253125-10506249 Bytes, ETag: "7d8XXXXXXXXXXXXXXXXXXXXXXXXXXd59"
[GetObject #3] 10506250-11807690 Bytes
[UploadPart #3] 10506250-11807690 Bytes, ETag: "125XXXXXXXXXXXXXXXXXXXXXXXXXX3f7"
[CompleteMultipartUpload] UploadId: q.lXXXXXXXXXXi4-
#### END #####
```

# 参考リンク

- [別の AWS アカウントから Amazon S3 オブジェクトをコピーする](https://aws.amazon.com/jp/premiumsupport/knowledge-center/copy-s3-objects-account/)
