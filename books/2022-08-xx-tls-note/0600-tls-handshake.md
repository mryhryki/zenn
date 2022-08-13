---
title: "ハンドシェイク"
---

ハンドシェイクは、暗号化された通信を行うための情報を交換し、暗号化通信を確立するための一連の処理です。
TLS 1.3 では、フルハンドシェイクと事前共有鍵(PSK: Pre-Shared Key)接続の２種類があります。

ハンドシェイクでは、以下の４つを達成する必要があります。

> 達成すべきことは4つあります。
>
> 1. 接続で使いたいパラメータを双方が提示し、一般的なセキュリティパラメータについて双方で合意する
> 2. サーバの真正性を検証する（必要であればクライアントの真正性も検証する）
> 3. 暗号鍵をいくつか生成する
> 4. ハンドシェイクメッセージが能動的ネットワーク攻撃者によって書き換えられていないことを検証する
>
> プロフェッショナルSSL/TLS 特別版PDF P495

# フルハンドシェイクの流れ

1. `[Client --> Server]` Client Hello
  - TLS 接続の要求
    - 接続したい TLS のバージョン
    - クライアントが使用できる暗号スイート一覧
    - (TLS 1.3 のみ) 鍵合意のパラメーター一式
2. `[Client <-- Server]` Server Hello
  - サーバー側が選択した暗号スイート
3. `[Client <-- Server]` Encrypted Extensions
4. `[Client <-- Server]` Certificate
5. `[Client <-- Server]` Certificate Verify
6. `[Client <-- Server]` Finished
7. `[Client <-- Server]` Finished (ハンドシェイク完了)
8. `[Client <-> Server]` Application Data
  - 双方向にアプリケーションデータをやり取りする
9. `[Client <-- Server]` Alert (Close Notify)
10. `[Client --> Server]` Alert (Close Notify) (接続終了)

- [TLS 1.3の性能 その2 – フルハンドシェイク - wolfSSL](https://www.wolfssl.jp/wolfblog/2018/06/01/tls-1-3performance2/)

# 事前共有鍵接続の流れ

- (TODO)
- 0-RTT
- 前方秘匿性がなくなる
- [TLS 1.3の性能 その3 - 事前共有鍵（Pre-Shared Key: PSK） - wolfSSL](https://www.wolfssl.jp/wolfblog/2018/06/04/tls-1-3performance3/)
