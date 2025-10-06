---
title: "\"JWTについてまとめてみる\""
emoji: "🔐"
type: "tech"
topics:
  - "JWT"
  - "Authorization"
published: true
canonical: "https://zenn.dev/mryhryki/articles/2021-03-28-json-web-token"
---

※この記事は[別アカウント(hyiromori)](https://zenn.dev/hyiromori/articles/2021-03-28-jwt)から引っ越しました

# はじめに

OpenID Connect で出てくる JWT について調べた結果をまとめてみました。

# JWTとは？

ざっくりいうと、JSON形式のデータを署名付きでやりとりできるトークンです。
認証関連で使われることも多いですが、JWT自体は単なるトークンの形式であり、直接は認証に関係ないです。



# JWTの特徴

1. 任意のJSONデータ（クレーム）を送信できる
    - クレーム(claim)には、日本で一般的に使われる「不満を述べる」という意味は含まれないのでご注意ください
2. URLセーフである（Webとの相性が良い）
3. 署名をつけて内容の改竄を防げる
    - DBなどに問い合わせなくても正しい内容であることを確認できる
    - ※リスクもあるので「署名なしのJWTも生成できる」の章も参照してください



# JWTの構造

JWT (JSON Web Token) とは、任意のJSONデータを格納できるURLセーフな文字列です。
構成としては以下のような３つの情報を `.` (ピリオド) でつなげた文字列になっています。

```
(ヘッダー).(クレーム).(署名)
```

## ヘッダー

トークンの形式と署名のバージョンを、URLセーフなBase64でエンコードされたJSON文字列です。

## クレーム

Base64でエンコードされた、任意のデータを含むJSON文字列です。
（※クレーム(claim)には、日本で一般的に使われる「不満を述べる」という意味は含まれないのでご注意ください）

RFCに登録済みのクレーム名（下記）もありますが、使用は必須ではありません。
また任意のフィールドを追加することも可能です。

### RFCに登録済みのクレーム名

- "iss" (Issuer) Claim
- "sub" (Subject) Claim
- "aud" (Audience) Claim
- "exp" (Expiration Time) Claim
- "nbf" (Not Before) Claim
- "iat" (Issued At) Claim
- "jti" (JWT ID) Claim

※登録されているというだけであって、必ずしもこれらを使用する必要はありません。

## 署名

ヘッダーとペイロードに対しての署名の文字列です。
これによって正しい発行者が発行したIDトークンであることを確認できます。

※リスクもあるので「署名なしのJWTも生成できる」の章も参照してください

## サンプル

[JSON Web Tokens - jwt.io](https://jwt.io/) に分かりやすい視覚的に分かりやすいサンプルがあったので紹介だけさせていただきます。

![https://jwt.io/](https://i.gyazo.com/5efc312a8853554c58694c9199e99d04.png)



# JWTのリスク

調べているうちにいくつかリスクがあることがわかったので、紹介させていただきます。

## 発行したトークンを取り消すことができない

有効期限などクレームに含めるなどの対策はできますが、一度発行したトークンは取り消すことができません。
発行したトークンをDBなどに保存するなどで対応することは可能ですが、単なるトークンと同等になってしまいます。
むしろDBに問い合わせる必要があるなら、DBにデータを保存して、ランダムなトークンを返す方がよりベターであるとさえ思います。

このことから、JWTは（例えば数分で有効期限が切れるような）有効期限の短いトークンなどの方が向いていると思います。
永続的なセッション管理などには向いていないと私は思いました。


### 2021-09-19 追記

こういう考え方は良いな、と思ったので紹介させていただきます。

> 「セッションIDをJWTに内包する」 という考え方です。

> - 明らかに無効な文字列 "hogehoge"
> - JWTのPayloadにあるセッションIDを改竄したもの
> - 有効期限が切れたJWT文字列
> 
> などを、データストアを参照する前に弾くことができるので、無駄なリクエストを減らすこともできるでしょう。

https://zenn.dev/ritou/articles/4a5d6597a5f250

## 署名なしのJWTも生成できる

JWTは実は署名なしで生成することも可能になっています。
[RFC 7519 の 6.1.  Example Unsecured JWT](https://tools.ietf.org/html/rfc7519#section-6.1) が残っているように、仕様としては署名なしで作ることはまだ可能なようです。

個人的には署名なしであれば、単にJSON文字列をURLセーフなBase64でエンコードすれば良いだけだと思うので、JWTの仕様に `"alg": "None"` があること自体がイマイチである気がします。

セキュアな用途で使うのであれば `"alg": "None"` を禁止するべきだと思いました。
私が使っているライブラリだと許可するアルゴリズムを指定できました。
また、単なるURLセーフなBase64でエンコードされたJSONなので、自前でパースしてチェックすることも比較的容易にできます。



# まとめ

- JWTは万能ではない
  - あらゆる用途で使えるわけではなく、使用する場面を考えて適切かどうかを考える必要がある
- セキュアな用途であれば、署名なしのJWTは禁止した方が良さそう
- 個人的な意見として、リスクを考慮すると発行するのは有効期限の短いトークンのみしておいた方が良さそう



# 参考資料

- [JSON Web Token - Wikipedia](https://ja.wikipedia.org/wiki/JSON_Web_Token)
- [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)
- [JSON Web Tokens - jwt.io](https://jwt.io/)
- [Common JWT security vulnerabilities and how to prevent them | Connect2id](https://connect2id.com/products/nimbus-jose-jwt/vulnerabilities)
- [Stop using JWT for sessions - joepie91's Ramblings](http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/)
- [JOSEは、絶対に避けるべき悪い標準規格である | POSTD](https://postd.cc/jwt-json-web-tokens-is-bad-standard-that-everyone-should-avoid/)
