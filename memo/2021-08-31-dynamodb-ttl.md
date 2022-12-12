---
title: DynamoDB の TTL 設定
---

## はじめに

DynamoDB に TTL が設定できることを知ったので、設定してみた時のメモです。


## 公式ドキュメント

この辺りを見ればだいたい仕組みから設定までわかります。

- [DynamoDB の有効期限 (TTL) の使用 - Amazon DynamoDB](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/time-to-live-ttl-before-you-start.html)
- [仕組み: DynamoDB の有効期限 (TTL) - Amazon DynamoDB](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/howitworks-ttl.html)
- [有効期限 (TTL) の有効化 - Amazon DynamoDB](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/time-to-live-ttl-how-to.html)



### 私が感じたポイントまとめ

- データ内に含まれるTTLとして指定された属性値（任意）を見て、期限切れの場合は自動で削除してくれる
    - 専用の設定方法があるわけではなく、通常のデータに含まれる属性を参照してくれる
    - 有効期限は UNIXTIME（秒単位）で指定する
- バックグラウンドで自動的に実行され、トラフィックに影響を与えず、コストも発生しない


## Terraform の設定

私は Terraform で管理しているので、以下のように設定を追加して反映しました。

```
resource "aws_dynamodb_table" "example" {
  name           = "example-table"
  # ...

  ttl {
    attribute_name = "ttl_key"
    enabled        = true
  }
}
```

https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table#ttl



## 削除の確認

AWS コンソールから簡単に確認できます。

![capture 3.png](https://i.gyazo.com/93b1458521868a6f3e8efdc19ba04866.png)

普通に CloudWatch のメトリクスでも見れます。

![image.png](https://i.gyazo.com/1a1a65a3caa2bce7dceb44251a6e9195.png)
