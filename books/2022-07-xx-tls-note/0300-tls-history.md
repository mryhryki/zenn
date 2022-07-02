---
title: "TLS/SSL の歴史"
---

## 概要

TLS の前身となった SSL は、当時高いシェアを誇る Netscape Navigator を提供していた Netscape 社で開発されました。
その後、IETF に移管されました。

## SSL と TLS

SSL (Secure Socket Layer) は TLS の前身となるプロトコルで、合わせて SSL/TLS などと表記されることもあります。
以下で説明していますが、Netscape 社から IETF に移管された後、Microsoft の移行により名称が TLS に変更されました。

## SSL 1.0

1994年に Netscape 社によって開発されたが、公開前に問題が発覚したため、実装されることなく破棄された。

## SSL 2.0

SSL 1.0 と同じく1994年に Netscape 社によって開発された。
[RFC6176](https://datatracker.ietf.org/doc/html/rfc6176) により廃止された。

## SSL 3.0

1995年に SSL 2.0 のいくつかの重大な脆弱性に対応した。
根本から設計し直し、 現在の TLS プロトコルの基本設計になっている。
[RFC7568](https://datatracker.ietf.org/doc/html/rfc7568) により廃止された。

## TLS 1.0 ([RFC2246](https://datatracker.ietf.org/doc/html/rfc2246))

SSL を Netscape 社から IETF に移管するために、1996年に TLS ワーキンググループに移管された。
Netscape 社と Microsoft 社の政治的抗争により、標準化作業が遅れた結果、1999年にようやくリリースされた。

SSL 3.0 との違いはわずかだが、互換性はない。
また、Microsoft 社の意向により TLS に名称が変更された。
[RFC8996](https://datatracker.ietf.org/doc/html/rfc8996) により廃止された。

## TLS 1.1 ([RFC4346](https://datatracker.ietf.org/doc/html/rfc4346))

基本的なセキュリティに関する修正がメインで、2006年に公開された。
[RFC8996](https://datatracker.ietf.org/doc/html/rfc8996) により廃止された。

## TLS 1.2 ([RFC5246](https://datatracker.ietf.org/doc/html/rfc5246))

アルゴリズムの追加や、AEAD（認証付き暗号）に対応し、2008年にリリースされた。
また、ハードコードされていたセキュリティ技術が取り除かれ、柔軟なプロトコルに変更。

## TLS 1.3 ([RFC8446](https://datatracker.ietf.org/doc/html/rfc8446))

2018年にリリースされた。
詳細は、このノートで学習するのでここでは省略。

## 参考リンク

- [Transport Layer Security - Wikipedia](https://ja.wikipedia.org/wiki/Transport_Layer_Security)
- [SSL/TLS 20年の歩みと動向～ - JPNIC](https://www.nic.ad.jp/ja/newsletter/No59/0800.html)
