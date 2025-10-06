---
title: "\"S3のマルチパートアップロードを理解して、異なるS3サービス間でも大容量ファイルを効率良くコピーする\""
emoji: "🆙"
type: "tech"
topics:
  - "AWS"
  - "S3"
published: true
canonical: "https://zenn.dev/mryhryki/articles/2022-12-01-s3-multipart-upload"
---

この記事は [コネヒトアドベントカレンダー](https://qiita.com/advent-calendar/2022/connehito) 1日目の記事です。


# はじめに

[S3](https://aws.amazon.com/jp/s3/) って便利ですよね。
容量無制限（1つのオブジェクトは最大5TBの制限あり）で従量課金、99.999999999% のデータ耐久性がある便利なサービスです。
AWS 初期からあるのも納得の便利サービスで、私もよく使うサービスの一つです。
しかし、5GBを超えるファイルを単純にアップロードする事ができず、マルチパートアップロードを使う必要があります。

また S3 は便利なサービスなので、S3 互換をうたうサービスも多く存在しており、私は個人的に [Wasabi](https://wasabi.com/) というサービスも併用しています。
ただS3サービス自体が異なるバケット間のデータ移動、特に大容量の場合は面倒です。

そこで今回は、マルチパートアップロードを理解し、異なる S3 サービス間でも効率的にコピーする方法を紹介しようと思います。


# 想定読者

この記事は以下のような方を想定して書いています。

- S3 のマルチパートアップロードについて知りたい方
- 異なる S3 サービス間で大容量のデータを効率よくコピーしたい方
- AWS SDK や REST API で大容量のデータを扱いたい方

## 補足: AWS CLI ではマルチパートアップロードを自動的に使ってくれる

AWS CLI の `aws s3 cp` や `aws s3 sync` を実行すれば、サイズに応じてマルチパートアップロードを使ってくれるようです。

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


# 参考: S3 サービスの使い分け

私は S3 サービスを以下のように使い分けています。

## AWS S3

ストレージ階層によって特徴があるので使い分けています。
[Amazon S3 ストレージクラスを使用する - Amazon Simple Storage Service](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/storage-class-intro.html) も参考になるかと思います。

### Standard

最低保管期間がない完全な従量課金なので、頻繁にファイル作成・削除するようなケースで使っています。

### Intelligent-Tiering

比較的小容量のリソース配信を CloudFront と連携して行っており、自動でコストを最適化してくれるこのストレージ階層を使っています。

### Glacier Deep Archive

保管料金が特に安いので、ほぼ取り出す可能性のない定期的なバックアップデータなどを保管しています。
取り出しに時間がかかることや、大容量のデータをダウンロードするとインターネット転送料がそれなりにかかる点に注意です。
（インターネット転送料が高いのは、AWS S3 だけではなく AWS サービス全般で言えます）

## Wasabi

特徴としては、AWS S3 の STANDARD よりも保管料金が安く（リージョンにもよりますが1/4程度）、API リクエストやインターネット転送量が無料という点です。
一定期間以上保管し、ある程度取り出しが発生する（しそう）なデータを保管しています。
最低1TB/月の保管料金（ap-northeast-1 なら $6.99）がかかる点と、最低オブジェクト保存期間が90日である点に注意です。



# マルチパートアップロードとは？

５GBを超えるファイルをアップロードするために使用できるアップロードの方法です。

> マルチパートアップロード API を使用すると、最大 5 TB のサイズの単一の大容量オブジェクトをアップロードできます。
>
> マルチパートアップロード API は大容量オブジェクトのアップロードを効率よく行えるように設計されています。1 つのオブジェクトをいくつかに分けてアップロードできます。オブジェクトのパートは、単独で、任意の順序で、または並行してアップロードできます。マルチパートアップロードは 5 MB～5 TB のオブジェクトで使用できます。詳細については、マルチパートアップロードを使用したオブジェクトのアップロードとコピー を参照してください。
>
> https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/upload-objects.html

バケット間でデータコピーする場合、マルチパートアップロードは以下のイメージです。

![How does MultipartUpload work?](https://mryhryki.com/file/UBq6NkABktw0eQBVd7g3VRSgWpgN9BNjFa5M3N6UhzzZbPUw.webp)

1. CreateMultipart でマルチパートアップロードを開始します
    - アップロードする領域を用意するようなイメージかな、と思います。
2. 以下のどちらかの方法で、オブジェクトを分割しながらコピーします
    - UploadPartCopy を使う（同一サービス内の場合）
    - GetObject と UploadPart を使う（別サービス間でコピーする場合）
3. すべてのコピーが完了したら CompleteMultipartUpload で完了する
    - CompleteMultipartUpload が正常に終了したら、通常の単一オブジェクトとしてアクセスできます


# マルチパートアップロードのメリット

## PutObject の制限を受けない

PutObject は 5GB までのアップロードしか対応できません。

> 1 回の PUT オペレーションでは、最大 5 GB の単一のオブジェクトをアップロードできます。
>
> https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/upload-objects.html

そのため 5GB を超えるオブジェクトをアップロードしようと思った場合は、マルチパートアップロードが必須になります。

## ローカルの空き容量に制限されにくい

これは異なる S3 サービス間でファイルを移動する場合など、一度ローカルを経由するケースでのメリットです。 
今回の目的である「異なるS3サービス間でも大容量ファイルを効率良くコピーする」ための重要なポイントです。

AWS CLI を使って異なるS3サービス間で大容量のファイルをコピーする場合、一度ローカルにダウンロードしてアップロードする必要があります。
そのためローカルに十分な空き容量が必要になり、細かく分割してコピーしたり、そもそもファイル自体が大きい場合（S3は1ファイル5TBまで保管可能）はコピーできない可能性もあります。

しかしマルチパートアップロードを使えば、最小で5MBごとにダウンロード→アップロードすることが可能です。
やり方次第でメモリ上で完結させることもできるので、ローカルの空き容量の制限を受けずにコピーすることができます。

## 細かくアップロードできるのでリトライなどの制御がしやすい

大容量のファイルを一度にアップロードする場合、途中でネットワークエラーなどが発生すると最初からやり直しになります。
マルチパートアップロードは最小で5MB単位でアップロードでき、失敗してもリトライ範囲が小さくできるので、5GB 未満であってもマルチパートアップロードを使うメリットがあるかもしれません。

## 並列にアップロードすることで高速化できる（かもしれない）

使っている回線速度などにも依存すると思いますが、アップロードを並列化することでアップロードを高速化することができる、かもしれません。
実際にどの程度速くできるかは検証していないですし、並列度によっても異なると思うので、機会があれば検証して追記したいと思います。


# マルチパートアップロードのデメリット

## アップロードの手順が複雑

マルチパートアップロードは3種類の API を使ってアップロードをする必要があるので、どうしても手順が複雑になります。

## 5MB 未満のファイルには適用できない

マルチパートアップロードは 5MB 以上のファイルしか使用できません。
そのためマルチパートアップロードだけで全てのケースに対応できない、というのは若干のデメリットだと思います。

# マルチパートアップロードの注意点

マルチパートアップロード中に中断してしまった場合（`CompleteMultipartUpload` が完了しなかった場合）アップロードしたデータが残ってしまいます。
その残ってしまったデータに対しても保管料金がかかるので注意してください。

消す方法としては、以下の方法があります。

1. [AbortMultipart](https://docs.aws.amazon.com/AmazonS3/latest/API/API_AbortMultipartUpload.html) をリクエストする
2. S3 のライフサイクルルールで自動削除する設定をする
    - 参考: [不完全なマルチパートアップロードをクリーンアップするための Amazon S3 ライフサイクル設定ルールを検証する](https://aws.amazon.com/jp/premiumsupport/knowledge-center/s3-multipart-cleanup-lifecycle-rule/)
    - 指定した日数が経過し削除されるまでは料金が発生する点に注意してください

私は、なるべく保管料金抑えるために `1.` で削除しつつ、消し忘れを防ぐため `2.` も設定しています。



# S3バケット間でコピーする４つの方法

マルチパートアップロードを含め、S3バケット間でのコピーする方法は大きく分けて以下の４パターンがあります。

| No  | 方法                                                  |      対応可能な容量      |    適用範囲    |
|:---:|:----------------------------------------------------|:-----------------:|:----------:|
|  1  | CopyObject を使う方法                                    |      0B〜5GB       | 同一サービス内のみ  |
|  2  | UploadPartCopy を使う方法<br>(マルチパートアップロード)              | 5MB〜5,000GB (5TB) | 同一サービス内のみ  |
|  3  | GetObject + PutObject を使う方法                         |      0B〜5GB       | 別サービス間でもOK |
|  4  | GetObject + UploadPart<br/> を使う方法<br>(マルチパートアップロード) | 5MB〜5,000GB (5TB) | 別サービス間でもOK |

今回の「異なるS3サービス間でも大容量ファイルを効率良くコピーする」には `4` の方法を使います。



# AWS SDK for JavaScript を使用した実装例

上記の「S3 のコピーの方法」で紹介した４パターン全てを実装して Gist にしています。
JavaScript (TypeScript) での実装例を見たい場合は、こちらも参照してみてください。

https://gist.github.com/mryhryki/99d6821b7b05587ed1c3b688bd76c96d

`.env` ファイルで、コピー元とコピー先の設定を分けて指定できるようになっているため、異なる S3 サービス間でもコピーできるようになっています。

```shell
SOURCE_AWS_ACCESS_KEY_ID="(REPLACE-YOUR-TOKEN)"
SOURCE_AWS_SECRET_ACCESS_KEY="(REPLACE-YOUR-TOKEN)"
# SOURCE_AWS_SESSION_TOKEN="(REPLACE-YOUR-TOKEN)" # OPTIONAL
SOURCE_AWS_S3_BUCKET_NAME="(REPLACE-YOUR-BUCKET-NAME)"
SOURCE_AWS_S3_OBJECT_KEY="(REPLACE-YOUR-OBJECT-KEY)"
SOURCE_AWS_REGION="(REPLACE-YOUR-BUCKET-REGION)"
# SOURCE_AWS_ENDPOINT="(REPLACE-YOUR-BUCKET-ENDPOINT)" # OPTIONAL

DEST_AWS_ACCESS_KEY_ID="(REPLACE-YOUR-TOKEN)"
DEST_AWS_SECRET_ACCESS_KEY="(REPLACE-YOUR-TOKEN)"
# DEST_AWS_SESSION_TOKEN="(REPLACE-YOUR-TOKEN)" # OPTIONAL
DEST_AWS_S3_BUCKET_NAME="(REPLACE-YOUR-BUCKET-NAME)"
DEST_AWS_S3_OBJECT_KEY="(REPLACE-YOUR-OBJECT-KEY)"
DEST_AWS_REGION="(REPLACE-YOUR-BUCKET-REGION)"
# DEST_AWS_ENDPOINT="(REPLACE-YOUR-BUCKET-ENDPOINT)" # OPTIONAL
```

中でどの API を呼び出しているかログに出力しているので、実行した結果と簡単な説明を以下に記載しておきます。

## 1. CopyObject を使う方法の実行例

5GB 未満のオブジェクトであれば、単純に一回 `CopyObject` を呼び出すだけで実行できます。

```shell
$ npm run CopyObject

...

#### START #####
[CopyObject]
#### END #####
```

### 補足

- 最大 5GB のデータをメモリで保持するため、データサイズや環境によってはエラーになるかもしれません
- 異なる S3 サービス間でのコピーでは使えません（実行するとエラーになります）

## 2. UploadPartCopy を使う方法の実行例

マルチパートアップロードを使うので、以下のような流れになります。

1. `CreateMultipartUpload` を実行する
2. `UploadPartCopy` で部分的なコピーを繰り返す
3. `CompleteMultipartUpload` でマルチパートアップロードを完了させる

```shell
$ npm run UploadPartCopy

...

#### START #####
[CreateMultipartUpload] UploadId: sKa..........X5-
[UploadPartCopy #1] 0-5253124 Bytes
[UploadPartCopy #2] 5253125-10506249 Bytes
[UploadPartCopy #3] 10506250-11807690 Bytes
[CompleteMultipartUpload] UploadId: sKa..........X5-
#### END #####
```

### 補足

- 異なる S3 サービス間でのコピーでは使えません（実行するとエラーになります）
- 5MB 未満のファイルを指定するとエラーになります（マルチパートアップロードは5MB以上のアップロードでしか使えないため）

## 3. GetObject + PutObject を使う方法の実行例

`GetObject` でダウンロードし `PutObject` でアップロードというわかりやすい流れです。

```shell
$ npm run GetAndPutObject

...

#### START #####
GetObject: 11807691 Bytes
PutObject: 11807691 Bytes
#### END #####
```

### 補足

- 最大 5GB のデータをメモリで保持するため、データサイズや環境によってはエラーになるかもしれません

## 4. GetObject + UploadPart を使う方法の実行例

マルチパートアップロードを使うので、以下のような流れになります。

1. `CreateMultipartUpload` を実行する
2. `GetObject` で部分的にダウンロードし `UploadPart`　でアップロードする、という流れを繰り返す
3. `CompleteMultipartUpload` でマルチパートアップロードを完了させる

```shell
$ npm run GetObjectAndUploadPart

...

#### START #####
[CreateMultipartUpload] UploadId: q.l..........i4-
[GetObject #1] 0-5253124 Bytes
[UploadPart #1] 0-5253124 Bytes, ETag: "1da......dd7"
[GetObject #2] 5253125-10506249 Bytes
[UploadPart #2] 5253125-10506249 Bytes, ETag: "7d8......d59"
[GetObject #3] 10506250-11807690 Bytes
[UploadPart #3] 10506250-11807690 Bytes, ETag: "125......3f7"
[CompleteMultipartUpload] UploadId: q.l..........i4-
#### END #####
```

### 補足

- 5MB 未満のファイルを指定するとエラーになります（マルチパートアップロードは5MB以上のアップロードでしか使えないため）



# おわりに

AWS SDK を使い、プログラムから大容量のファイルを扱えるようになると非常に便利になりました。

私の場合、Wasabi を使い始めた時に AWS S3 から Wasabi に400GB弱ぐらいのデータを一気に移行した際にこの方法が役に立ちました。
（余談ですが、この時の AWS のインターネット転送料金は約$31ぐらいかかっていました。AWS はインターネット転送転送料金が高い・・・）

他にも、複雑な条件（プレフィックス、容量、作成日時、`Content-Type` など）を判定して対象のファイルだけコピーしたい、などのケースも比較的容易に実装できます。
他の方法もあるかもしれませんが、使い慣れた言語で、公式の SDK を使って思い通りに実装できるのは便利です。

S3 をよく使うエンジニアであれば、マルチパートアップロードを使いこなせると用途の幅も広がるな〜、と思ったので紹介させていただきました。

明日の担当は [@otukutun](https://twitter.com/otukutun) さんです！



# 関連リンク

- [別の AWS アカウントから Amazon S3 オブジェクトをコピーする](https://aws.amazon.com/jp/premiumsupport/knowledge-center/copy-s3-objects-account/)
    - （S3 サービスではなく）AWS アカウントが異なる場合であれば IAM とバケットポリシーの設定をすることで、AWS CLI を使ってコピーができるようです
