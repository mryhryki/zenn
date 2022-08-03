---
title: "TLS1.3 の概要"
---

TLS 1.3 は2018年にリリースされた比較的新しい暗号プロトコルです。
番号はマイナーバージョンアップですが、事実上新しいプロトコルと言っても良いほど変更されています。

現在有効な前バージョン (TLS 1.2) と比較して、どう改善されたのかをピックアップしていきます。

## セキュリティの改善

### ハンドシェイクの暗号化範囲の拡大

- ハンドシェイク中の Client Hello, Server Hello 以外は暗号化されるようになった
    - TLS 1.2 では、ハンドシェイク中の内容は平文でやりとりしていた
- DH (ディフィー・ヘルマン) 系の鍵交換に統一されたことによる

### 鍵交換

プロフェッショナルSSL/TLS PDF版 付録A P497
https://mryhryki.com/api/s3/download/mryhryki-data/Ym9vay_jg5fjg63jg5Xjgqfjg4Pjgrfjg6fjg4rjg6tTU0xUTFMt54m55Yil54mI77yIVExTMTPop6Poqqzku5jvvIkucGRm

- クライアントからの通信開始
- 0-RTT (0 Round Trip Time)
  - [走り出した TLS 1.3（２）：0-RTTでいきなり暗号化メッセージ - wolfSSL](https://www.wolfssl.jp/wolfblog/2018/10/22/0-rtt/)
  - オプション機能
  - 事前共有鍵を使う（鍵交換はできない）
  - セキュリティを犠牲にしてパフォーマンスを向上させる手法
- サーバ拡張の暗号化
- ハンドシェイク以降で使うメッセージ

### 暗号スイートの削減

TLS 1.3 では５つの暗号スイートが定義されています。

```
This specification defines the following cipher suites for use with TLS 1.3.

           +------------------------------+-------------+
           | Description                  | Value       |
           +------------------------------+-------------+
           | TLS_AES_128_GCM_SHA256       | {0x13,0x01} |
           |                              |             |
           | TLS_AES_256_GCM_SHA384       | {0x13,0x02} |
           |                              |             |
           | TLS_CHACHA20_POLY1305_SHA256 | {0x13,0x03} |
           |                              |             |
           | TLS_AES_128_CCM_SHA256       | {0x13,0x04} |
           |                              |             |
           | TLS_AES_128_CCM_8_SHA256     | {0x13,0x05} |
           +------------------------------+-------------+
```

https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.4

### PFS（Perfect Forward Security）

- [PFS（Perfect Forward Secrecy） | Program Is Made At Night](https://kimh.github.io/blog/jp/security/understanding-pfs-jp/)
- [フロントエンジニアがTLSで学ぶ暗号技術 - Qiita](https://qiita.com/shun_takagi/items/eb46e0c1f0bb512fa04d)

## RTT (Round Trip Time) の改善

- TLS 1.2 は 2-RTT 必要だが、TLS 1.3 は 1-RTT で良くなった
  - 鍵交換が DH 系のみになった
- 300以上の暗号スイートが存在する
  - TLS 1.3 では５つのみ
- ハンドシェイクの内容が暗号化されない
  - TLS 1.3 では、最初の Client Hello と Server Hello メッセージ以外はすべて暗号化される



