---
title: "TLSとは?"
---

TLS は Transport Layer Security の略で、インターネット上で安全に通信を行うためのプロトコルです。

> TLSはデジタル証明書（公開鍵証明書）による通信相手の認証（一般的にはサーバの認証）と、共通鍵暗号（秘密鍵暗号）による通信の暗号化、ハッシュ関数による改竄検知などの機能を提供する。
> https://e-words.jp/w/TLS.html

> Transport Layer Security（トランスポート・レイヤー・セキュリティ、TLS）は、インターネットなどのコンピュータネットワークにおいてセキュリティを要求される通信を行うためのプロトコルである。主な機能として、通信相手の認証、通信内容の暗号化、改竄の検出を提供する。TLSはIETFによって策定された。
> https://ja.wikipedia.org/wiki/Transport_Layer_Security

主に「認証」「暗号化」「改竄検知」の機能を提供しています。

## 認証

公開鍵証明書 を使用し、正当なサーバーであることを検証できる。

## 暗号化

公開鍵暗号  共通鍵暗号 を使用し、通信内容を暗号化して通信できる。
## 改竄検知

ハッシュ関数を使い、通信内容の改竄を検知できる。
（MEMO: 理解できていないのでまた調べる）

## TLS に関する仕様

- [RFC 8446 - The Transport Layer Security (TLS) Protocol Version 1.3](https://datatracker.ietf.org/doc/html/rfc8446)

「徹底解剖 TLS 1.3」の「Chapter4 TLSを支える標準」に網羅した表あり。
