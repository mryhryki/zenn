---
title: "サーバーとの物理的な距離による Lighthouse のパフォーマンススコアの差を調べてみた"
emoji: "🌎"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Lighthouse"]
published: true
canonical: https://zenn.dev/mryhryki/articles/2020-12-23-distance-affects-lighthouse-score
---

※この記事は[別アカウント(hyiromori)](https://zenn.dev/hyiromori/articles/a80361ae13f26ccabfaf)から引っ越しました

# はじめに

サーバーまでの物理的な距離によって Lighthouse のパフォーマンススコアがどのぐらい変わるのか気になったので、実験してみた時のメモです。



# HTTP Server (S3) の設定

`S3 Static Hosting` を以下３つのリージョンで作成しました。
（※実験目的で一時的に作ったもので、現在はバケットごと削除しておりアクセスできません）

- ap-northeast-1: アジアパシフィック (東京)
  - http://dff1084c-f388-40b1-9d0b-3381ed61f41d.s3-website-ap-northeast-1.amazonaws.com/
- us-east-1: 米国東部 (バージニア北部)
  -  http://54381649-886e-4ca7-a4f0-24add9599000.s3-website-us-east-1.amazonaws.com/
- sa-east-1: 南米 (サンパウロ)
  - http://55f0e11c-d30e-4cb2-9cc2-e1a7e2bc5b91.s3-website-sa-east-1.amazonaws.com/

## S3設定メモ

ちょっと手間取ってしまったので、備忘録として残しておきます。

- 「静的ウェブサイトホスティング」を「有効」にする
- 「パブリックアクセスをすべて ブロック」を「オフ」にする
- 「アクセスコントロールリスト (ACL)」の「全員 (パブリックアクセス)」の以下２つにチェックを入れる
  - オブジェクト → リスト
  - バケット ACL → 読み込み
- バケットポリシーを以下のようにしておく

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadForGetBucketObjects",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::(BUCKET NAME)/*"
        }
    ]
}
```



# 配置したリソース

ポートフォリオサイトとして使用している [portfolio (b18988bd)](https://github.com/mryhryki/portfolio/tree/b18988bd089c915398ab79e154bd8087fc93142e) のソースをそのままS3にアップロードして使用しています。



# Lighthouse で計測した結果

Chrome DevTools の Lighthouse を使って計測しました。
設定はこの状態です。
![capture.png](https://i.gyazo.com/8255724d0abe9da04bd7b5257c6977dd.png)

（※一応ですが、日本から計測しています）

## ap-northeast-1: アジアパシフィック (東京)

![ap-northeast-1 score](https://i.gyazo.com/8c3b909047af36b0e1efd9b1ae38a439.png)

## us-east-1: 米国東部 (バージニア北部)

![us-east-1 score](https://i.gyazo.com/faa615226e9a6b03c666724d53a4cd20.png)

## sa-east-1: 南米 (サンパウロ)

![sa-east-1 score](https://i.gyazo.com/fe9af630ff8e175d885620b7b1890ad3.png)

# まとめ

1. 物理的な距離はパフォーマンススコアにも大きく影響する
2. やはり計測する時はサーバーの場所とメインで使うユーザーの場所を意識する必要があることが分かった
