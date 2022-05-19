---
title: "公開鍵基盤 (PKI)"
---



## CA (Certification Authority, 認証局)


## 証明書

### フィールド

(プロフェッショナルSSL/TLS P65)

- Version (バージョン)
- Serial Number (シリアル番号)
- Signature Algorithm (署名アルゴリズム)
- Issuer (発行者)
- Validity (有効性)
- Subject (主体者)
- Public key (公開鍵)

TODO: 実際の証明書の中身を見たい


## 失効

(プロフェッショナルSSL/TLS P73)

- CRL (Certificate Revocation List)
    - 執行した証明書のシリアル番号を一覧にしたもの。
- OCSP
    - 単一の証明書の失効状態を証明書利用者が取得できるようにする仕組み（よく分かってない）

## X.509

公開鍵基盤の国際標準。

## PEM (Privacy-Enhanced Mail)

証明書でよく使われるフォーマット。
メールで送ったり、コピーペーストしやすい。


## 余談：ロシアの事例

[ロシアが自国のウェブサイトの信頼を独自に担保するTLS認証局を設置 - GIGAZINE](https://gigazine.net/news/20220311-russia-certificate-authority/)
