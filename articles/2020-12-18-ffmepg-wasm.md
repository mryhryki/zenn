---
title: "ffmpeg.wasm を使ってGIF動画を作れるWebアプリを作って遊んでみた"
emoji: "📹"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["FFmpeg", "WebAssembly", "WASM"]
published: true
canonical: https://zenn.dev/mryhryki/articles/2020-12-18-ffmepg-wasm
---

※この記事は[別アカウント(hyiromori)](https://zenn.dev/hyiromori/articles/ca4bbf1f67ae04652398)から引っ越しました

これは [コネヒト Advent Calendar 2020 18日目](https://qiita.com/advent-calendar/2020/connehito) の記事です。

## はじめに

コネヒト社で定期的に開催している[フロントエンドの勉強会(※)](https://www.wantedly.com/companies/connehito/post_articles/211397) で、FFmpeg が WebAssembly で使えるという情報を耳にしたので、遊びがてらブラウザだけで動画をGIFに変換するWebアプリを作ってみました。 
（※コロナでリモートワークになってから、ランチではなくおやつタイムにやっています）

@[tweet](https://twitter.com/mryhryki/status/1328251958788976641)

ffmpeg.wasm の公式リポジトリと日本語の解説記事はこちらです。

https://github.com/ffmpegwasm/ffmpeg.wasm
https://gigazine.net/news/20201109-ffmpeg-wasm/


# 作ったWebアプリ

~~https://video-to-gif.vercel.app/~~

https://mryhryki.com/app/video-to-gif/index.html

ソースコードはこちら。

https://github.com/mryhryki/video-to-gif

Google Chrome だけ動作確認をしています。他のブラウザは使えません。 また大きな動画ファイルを変換すると途中でエラーになります。 
（これらの理由は「ハマりどころ」の章をご覧ください）

## 使用方法

大したアプリではないですが一応手順を説明します。
![How to use](https://i.gyazo.com/236042299cc18c6a6282efa82dea14b2.gif)

1. 動画ファイルを選択
2. 出力するGIFのフレームレートを設定
3. `Convert to GIF` をクリック
4. （GIFをダウンロードしたい場合）`Download GIF` をクリック

## 使ったもの

- [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)
  - 動画変換のため
- [Vercel](https://vercel.com/)
  - Webアプリのホスティング先として
- [Next.js](https://nextjs.org/)
  - [チーム個々人のテックブログをRSSで集約するサイトを作った（Next.js）](https://zenn.dev/catnose99/articles/cb72a73368a547756862) で `Next.js` と `Vercel` の相性がすごく良いんだなー、と思ったので試しに使ってみた感じです。
  - あまり詳しくないので雰囲気で使っています。

## FFmpeg.wasm の使い方

普通に `<script>` タグでインポートして、

```html
<script src="https://unpkg.com/@ffmpeg/ffmpeg@0.9.4/dist/ffmpeg.min.js"></script>
```

通常のFFmpegと同様の引数を文字列で渡してあげればOKです。

```javascript
await ffmpeg.run(
  '-i', '(file name)',
  '-r', '(frame rate)',
  'output.gif'
);
```

ただしロードなどの手順は必要になります。
その辺りは公式ドキュメントの [USAGE](https://github.com/ffmpegwasm/ffmpeg.wasm#usage) に詳しく書かれていますので、こちらを参照してみてください。
ファイルの扱いもちょっと面倒な感じですが、FFmpeg と同じ感じで使えるのは良いですね。


# ハマりどころ

## npm 経由でインストールしたパッケージはブラウザで使えない

いつもの癖で [npmjs.com](https://www.npmjs.com/search?q=%40ffmpeg) で配布されているパッケージを使おうとしたら、ビルド時にエラーになりました。
こちらは `Node.js` 用のパッケージのようです。

READMEにも、ブラウザの場合は `<script>` で読み込むように書かれています。
（ちゃんとドキュメントは読まないといけませんね）

![README](https://i.gyazo.com/0c68c1353f3d47abb9455b04d7de6b9d.png)

Next.js で直接参照はできないので、私はこんな感じで使っています。

```javascript
const getFFmpeg = () => {
  if (('FFmpeg' in window) && ('SharedArrayBuffer' in window)) {
    return window.FFmpeg;
  }
  throw new Error('FFmpeg がロードできません')
}
```

## SharedArrayBuffer が使えないブラウザでは変換できない

[Installation](https://github.com/ffmpegwasm/ffmpeg.wasm#installation) のところに書かれていたのですが、[SharedArrayBuffer](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) が使えないブラウザでは実行できないようです。

> Only browsers with SharedArrayBuffer support can use ffmpeg.wasm, you can check HERE for the complete list.


![Can I Use SharedArrayBuffer?](https://i.gyazo.com/ad9399ee477c2a813eaadde68d1cfb53.png)
[https://caniuse.com/?search=SharedArrayBuffer](https://caniuse.com/?search=SharedArrayBuffer)

FireFox も対応しているように見えるのですが、制限があるため使えないようです。
Edge は試していないですが、Chromium ベースなら使えるのかも？（未検証）

## 大きなファイルを扱えない

オンメモリでしか動かないようなので、容量の大きなファイルだと変換できないです。
![ffmpeg error](https://i.gyazo.com/c4ca6175c0f7642099b9e85b5b7e814f.png)
@[tweet](https://twitter.com/ko_noike/status/1326413474231095296)
今回は短い動画でGIFアニメーションを作っていたので、問題にならなかったようです。


# 感想

WebAssembly に興味があって触ってみたのですが、全然中身が分からなくても使えてしまった、というのが正直な感想です。
逆に言えば、きちんと提供する側で用意しておけば、利用する側はあまり意識しなくても使えるんだなー、ということでもあるとは思います。

FFmpeg.wasm については、対応ブラウザが少ないことや、ブラウザだけで動画変換ができるけどオンメモリなので用途が現時点では限られそう、という感じでした。
しかし、ブラウザだけでできることがどんどん増えているなー、という感じがしてWebエンジニアとしては嬉しく思います。

次はWASMでなにか作ってみたい。
