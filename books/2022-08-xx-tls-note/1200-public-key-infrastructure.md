---
title: "公開鍵基盤 (PKI)"
---

# TODO
- [ ]
- [ ] 最終チェック

---

公開鍵暗号を利用し、通信相手の認証を行い、通信における信頼を成り立たせる仕組み。
正当な通信相手であることを認証するために、認証局 (CA) から発行された証明書を使用する。
この認証局 (CA) が PKI における重要な役割を果たしている。

例として `https://example.com` にアクセスした場合、通信相手が確かに `https://example.com` であることを認証できる。
(`https://example.com` にアクセスしているつもりが、実は `https://evil.example` にアクセスしていた、ということにはならない)

あくまで通信相手が想定している相手であることが確認できるだけで、例にあげた `https://example.com` が悪意のないサイトであるかどうかは PKI を使っても確認することはできないので注意。

## PGP (Pretty Good Privacy)

- 個人レベルで信頼関係を構築する方式

## TTP (Trusted Third Party)

- 信頼できる第三者機関
- 証明書を発行する TTP を CA (Certification Authority) と呼ぶ

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

## X.509 デジタル公開鍵証明書形式

- 公開鍵証明書の標準
- X.500 ディレクトリシリーズの一つで、ISO/IEC の国際標準として規定されている

## PEM (Privacy-Enhanced Mail)

証明書でよく使われるフォーマット。
メールで送ったり、コピーペーストしやすい。


## 余談：ロシアの事例

[ロシアが自国のウェブサイトの信頼を独自に担保するTLS認証局を設置 - GIGAZINE](https://gigazine.net/news/20220311-russia-certificate-authority/)
