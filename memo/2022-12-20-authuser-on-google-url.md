---
title: Google サービスの URL で認証ユーザーを指定する
---

## 認証ユーザーの指定方法

以下のように、URL のクエリパラメータに `authuser=(Googleのメールアドレス)` を指定すると、アクセス時に自動的にそのユーザーとしてアクセスできる。

https://mail.google.com/?authuser=user@gmail.com

未指定の場合は最初に Google にログインしたアカウントとしてアクセスされる。
複数の端末・ブラウザでログイン順が異なる場合は不便なので、上記のようにメールアドレスで指定しておくほうが個人的には便利だと思っている。

ただし、全てでできるわけではないので、自分が知る限りの範囲で以下に可否を書いておく。

### 指定できるもの

- Gmail
- Google Calendar
- Google Drive
- Google Keep
- Google Photos

### 指定できないもの（効果がないもの）

- Google Maps
  - `authuser=1` のような番号での指定はできる
  - これをいい感じにできる方法を知りたい

## Link

- [GoogleサービスのURLでユーザアカウントを指定する（?authuser=email） · えやみぐさ](https://blog.aoirint.com/entry/2021/google_authuser_link/)
