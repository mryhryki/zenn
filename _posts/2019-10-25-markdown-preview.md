---
layout: blog
header_image: blog
title: Markdownを好きなエディタで書きながらプレビューするnpmパッケージを公開してみた
keyword: Markdown,Preview
---

僕はただ、Markdownを楽しく書きたかったんだ・・・！

## はじめに

世の中にはMarkdownを書くための素晴らしいプロダクトがあります。([typora](https://www.typora.io/)とか)

しかしながら、私はどうしてもVimキーバインドで書きたいし、GitHubのREADMEとか書くことが多いのでGFM(GitHub Flavored Markdown)にしたいし、余計な機能がないシンプルなプレビューができれば良かったんです。

でも無いので、だったら自分で作ってみよう！と思ったので作ってみました。

([これ](https://www.npmjs.com/package/markdown-preview)なんかはイメージに近いんですけど、最終更新が2年以上前だし、やってみるチャンスだと思ったのも理由の一つです)

## 作ったもの

- ソースコード: [hyiromori/markdown-preview - GitHub](https://github.com/hyiromori/markdown-preview)
- npm: [@hyiromori/markdown-preview - npm](https://www.npmjs.com/package/@hyiromori/markdown-preview)

## 使い方

[README](https://github.com/hyiromori/markdown-preview/blob/master/README.md)の通りです。

※npmで公開しているので、nodeがあることが前提です。

```bash
$ npx @hyiromori/markdown-preview --port 34567 --file README.md

Root Directory : /current/dir
Default File   : /README.md
Preview URL    : http://localhost:34567/
```

デモも見ていただけるとイメージしやすいかもしれません。

![DEMO](https://github.com/hyiromori/markdown-preview/raw/master/gif/demo.gif)

## 仕組み

* 内部でexpressサーバーが起動しています。
* ブラウザからアクセスすると、expressサーバーとWebSocketで接続します。
* expressサーバー内では `setInterval` で指定されたファイルを250msごとに１回、最終更新日時を取得し、差分があればWebSocket経由でブラウザに送信します。
* ブラウザで受信したMarkdownテキストを[marked](https://marked.js.org/#/README.md#README.md)でHTMLに変換して表示します。

普通のWebサーバーを立ててゴニョゴニョやっているだけです。
ちなみにカレントディレクトリをルートとして、静的ファイルの配信もできるので、パスがあっていれば画像などもちゃんと取得できます。

なので[ngrok](https://ngrok.com)などのサービスを使うと、グローバルにアクセスできるので、例えば遠隔MTGの議事録をMarkdownで書きつつ、みんなにリアルタイムに見てんもらう、なんてことにも使えるかもしれません。

## やりたいこと

* Markdownの変換の仕組みはブラウザ側に寄せているので、任意のHTMLを差し込めるようにすると、カスタマイズ性が上がって良さそう
* [Homebrew](https://brew.sh/index_ja)で公開でいるといいな。（Windowsは持ってないからよくわからない）
