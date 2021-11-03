# AWS Route53 のホストゾーンを削除する

削除したときので順をメモしておく。

## バックアップ

まずは何か合ったときのために CLI でデータをバックアップしておく。

```bash
$ export ZONE_ID="HOSTED ZONE ID"
$ aws route53 get-hosted-zone --id "${ZONE_ID}"
$ aws route53 list-resource-record-sets --hosted-zone-id "${ZONE_ID}"
```

## NS, SOA 以外のレコードを削除する

`NS`, `SOA` のレコードは削除できないので、それ以外のレコードを削除する

## ゾーンを削除する

後は普通にゾーンを削除すればおわり。

## さいごに

思ったより簡単に削除できた。
