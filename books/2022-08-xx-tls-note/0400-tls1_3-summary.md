---
title: "TLS1.3 の概要"
---

TLS 1.3 は2018年にリリースされた比較的新しい暗号プロトコルである。
番号はマイナーバージョンアップだが、事実上新しいプロトコルと言えるほどの変更がある。

現在有効な前バージョン (TLS 1.2) と比較して、どう改善されたのかをピックアップする。

## セキュリティの改善

### ハンドシェイクの暗号化範囲の拡大

ハンドシェイク中の Client Hello, Server Hello 以外が暗号化されるようになった。
逆に言うと、TLS 1.2 では合意前のハンドシェイクの内容は全て平文でやりとりしていた。

これは、鍵交換を DH (ディフィー・ヘルマン) 系に統一されたことによる改善である。
（DH鍵交換については「公開鍵暗号」の章を参照）

### 暗号スイートの削減

TLS 1.2 であった数百の暗号スイートが大幅に削減された。
特に、古く安全でない暗号が削減されたので、安全性が高まった。

TLS 1.3 では５つの暗号スイートが定義されている。

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

### 認証付きの共通鍵暗号アルゴリズムに統一

AES-GCM などの認証付きの共通鍵暗号アルゴリズムを使うように統一された。
認証付きの共通鍵暗号アルゴリズムは、改ざん防止の (H)MAC がついているようなモード。

これにより、なりすましや改ざんを防ぎつつ MAC による真正性検証が不要になった

### PFS（Perfect Forward Security）

TODO

- [PFS（Perfect Forward Security）についてまとめる](https://mryhryki.com/view/?type=memo&id=2022-08-17_8e5e)
- [PFS（Perfect Forward Secrecy） | Program Is Made At Night](https://kimh.github.io/blog/jp/security/understanding-pfs-jp/)
- [フロントエンジニアがTLSで学ぶ暗号技術 - Qiita](https://qiita.com/shun_takagi/items/eb46e0c1f0bb512fa04d)

## RTT (Round Trip Time) の改善

TLS 1.3 は 1-RTT で合意ができ、データのやり取りまでの時間が短縮された。
TLS 1.2 は 2-RTT が必要だった。

これは、鍵交換が DH 系のみになったことによる。

### 0-RTT

- [走り出した TLS 1.3（２）：0-RTTでいきなり暗号化メッセージ - wolfSSL](https://www.wolfssl.jp/wolfblog/2018/10/22/0-rtt/)
- オプション機能
- 事前共有鍵を使う（鍵交換はできない）
- セキュリティを犠牲にしてパフォーマンスを向上させる手法
- 前方秘匿性がなくなるが、Early Data を使用することで 0-RTT も実現可能
