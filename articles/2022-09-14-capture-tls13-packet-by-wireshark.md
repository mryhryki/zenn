---
title: "Wireshark で TLS 1.3 のパケットを見てみる"
emoji: "🔍"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["TLS", "Wireshark"]
published: true
---

# はじめに

この記事は、筆者が [TLS 1.3 の学習中](https://zenn.dev/mryhryki/articles/2022-09-08-tls-note) に Wireshark 実際の通信内容を見てみたくなったので、その方法をまとめただけのメモです。

# 環境

macOS で動かしています。

```shell
$ sw_vers
ProductName:    macOS
ProductVersion: 12.5.1
BuildVersion:   21G83
```


# 参考リンク

Wireshark のコミュニティ (?) サイトで見つけました。
https://ask.wireshark.org/question/9733/decrypt-tls-13-with-wireshark/?answer=9752#post-id-9752

リンクされている2019年の資料のPDFのP8ページから書かれています。
https://lekensteyn.nl/files/wireshark-tls-debugging-sharkfest19us.pdf

![該当ページ](https://mryhryki.com/file/UgtINCjLS-vdsKrLBwQS1EDngM-JnGfeS7eFyPQeR2jxdMGc.png)

以下は、上記を macOS で実行した内容を書いているだけです。


# 環境変数 SSLKEYLOGFILE を設定

鍵の情報を出力するためのファイルパスを、環境変数 SSLKEYLOGFILE を設定します。
例えば `/tmp` ディレクトリ直下に出力する場合は以下のようにします。

```shell
$ export SSLKEYLOGFILE="/tmp/keys.txt"
```

## 環境変数 SSLKEYLOGFILE とは？

ブラウザが TLS 通信に使う **共通暗号の秘密鍵** を出力するファイルパスのようです。
共通暗号の秘密鍵が出力されるので、Wireshark も復号できるってことですね。非常に単純。

Google Chrome と Firefox がこの環境変数に対応しているみたいです。

参考: [Wiresharkに秘密鍵を登録しても解読できないのにSSLKEYLOGFILEを使えば解読できる理由 – 日々、コレ勉強](https://www.khstasaba.com/?p=686)

実際のファイルは以下のようになっています。
（鍵情報は `xxx...` でマスクしています）

```text
CLIENT_HANDSHAKE_TRAFFIC_SECRET e6bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx23d 3dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx6c
SERVER_HANDSHAKE_TRAFFIC_SECRET e6bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx23d 83xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx5b
CLIENT_HANDSHAKE_TRAFFIC_SECRET 07xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx3f6 ffxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxde
SERVER_HANDSHAKE_TRAFFIC_SECRET 07xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx3f6 44xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx25
CLIENT_HANDSHAKE_TRAFFIC_SECRET 48xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxa81 f1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1d
SERVER_HANDSHAKE_TRAFFIC_SECRET 48xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxa81 5axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx30
CLIENT_TRAFFIC_SECRET_0 e6xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx3d 7exxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxcb
SERVER_TRAFFIC_SECRET_0 e6xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx3d 66xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx6a
EXPORTER_SECRET e6xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx3d 2cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxd1
CLIENT_TRAFFIC_SECRET_0 48xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx81 dcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx4a
```


# ブラウザを起動

環境変数 SSLKEYLOGFILE を設定した状態で、ブラウザを立ち上げます。
私の環境ですと、以下のコマンドで Google Chrome を起動できました。

```shell
$ "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --user-data-dir="/tmp/cr"
```

## --user-data-dir とは？

だいたい名前の通りユーザーデータを保存するためのディレクトリを指定する引数のようです。
おそらく、通常しようしている場合にデフォルトからの設定変更や履歴などによる影響を抑えるためなのかな、と思います。

- [起動オプション - Google Chrome まとめWiki](http://chrome.half-moon.org/43.html#xd80acae)
- [技術/Chrome/初期設定で起動する(--user-data-dir) & リモートデバッグ可能にする(--remote-debugging-port) - Glamenv-Septzen.net](https://www.glamenv-septzen.net/view/1392)


# Wireshark の設定を変更

Wireshark の TLS の設定にある "(Pre-)Master-Secret log filename" を、環境変数 SSLKEYLOGFILE に設定したファイルパスを同じ値を設定します。

![Wireshark setting window capture 1](https://mryhryki.com/file/UgtCJCCT6LW1k2_EOMKzDJX7pMoZ2cYd0kTfHsJdo5oNg3-U.png)

![Wireshark setting window capture 2](https://mryhryki.com/file/UgtBjL9Jpafzm9YH7-UWql-DkxF6wmnNxmjQBdBhz_r6H4n4.png)


# ブラウザで任意のWebサイトにアクセス

Wireshak でパケットのキャプチャを開始し、任意のWebサイトにアクセスします。
今回は `https://www.google.co.jp` にアクセスしました。

無事 TLS 1.3 では暗号化されている Certificate などのメッセージが復号されてみることができました。

![TLS 1.3 package capture result](https://mryhryki.com/file/Ugt4EQnWw8Lr8fGldjTEJU7OU_UUJ4B7s8pBNE4VM9LYR9P0.png)
