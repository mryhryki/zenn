---
title: "Notion API で新しいページを作る"
emoji: "📝"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Notion"]
published: false
---

# はじめに

最近 Notion を使い始めたんですが、Notion API を使って自動でページを作ったりできるのかを調べたくなったので、そのメモになります。
初めて使い、調べながらやってみた記事として見てもらえればと思います。
ここはこうした方が良いなどありましたらコメント頂けると嬉しいです。

# どうやってページを作るのか

ざっと調べてみた感じ、Notion は構造化されたデータで作られていて、ページの中にブロックという単位を組み合わせることで作られているようです。
なので、こんな感じでいけると思います。

1. ページを作る
    - https://developers.notion.com/reference/post-page
2. ブロックを追加する
    - https://developers.notion.com/reference/patch-block-children

# 事前準備

## トークンの作成

API アクセスに必要なトークンを生成します。

![](https://mryhryki.com/file/bWAFeESuYK9Ilf7kaOm_AGPOfq)

![](https://mryhryki.com/file/bWAFgWmodCXrtsh5MWYw21hyhn)

![](https://mryhryki.com/file/bWAFBIvKBYZ4RBh-bZsqwLkezl)

https://www.notion.so/my-integrations

以降 `NOTION_ACCESS_TOKEN` という名前の環境変数に、このトークンが設定されている前提で進めます。

## 対象ページに招待する

![](https://mryhryki.com/file/bWAFfVAgS3CBvVS6AqPPFmZ0CN)

## プロジェクトを作る

JavaScript API が用意されているので、こちらを使って進めていきます。

https://github.com/makenotion/notion-sdk-js


