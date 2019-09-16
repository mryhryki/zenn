---
layout: blog
header_image: blog
title: AWS CloudWatch Event のSNS通知を見やすく整形する
keyword: AWS,CloudWatch
---

`AWS`の`CloudWatch Event`で`SNS`を使用して通知設定をすると、ただひたすら長文の`JSON`が送信され見にくいので、整形する方法を探ったときのメモ。

## イベントの設定

1. AWSコンソールで`CloudWatch`のページに移動し、`イベント -> ルール`の順に選択。
1. 対象となるルールを選択し、編集状態にする。
1. ターゲットで`SNS トピック`を選択する。
1. 「入力の設定」でインプットトランスフォーマーを選択する。
1. 次章以降の内容を入力する（`GuardDuty`の結果を編集するサンプルです）

## 入力パス

```json
{
  "type": "$.detail.title",
  "title": "$.detail.title",
  "description": "$.detail.description",
  "severity": "$.detail.severity",
  "updatedAt": "$.detail.updatedAt",
  "createdAt": "$.detail.createdAt",
  "arn": "$.detail.arn"
}
```

## 入力テンプレート

```text
"GuardDuty で次の脅威が発見されました。"

"種別　　：<type>"
"タイトル：<title>"
"説明　　：<description>"
"重要度　：<severity> ( https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_findings.html#guardduty_findings-severity )"
"更新日時：<updatedAt>"
"作成日時：<createdAt>"
"ARN 　　：<arn>"
```

## まとめ

SNS経由で届く内容が見やすくなりました。
