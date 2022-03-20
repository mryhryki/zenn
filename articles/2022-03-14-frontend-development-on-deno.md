---
title: "Denoでフロントエンド開発を試す"
emoji: "🦕"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Deno"]
published: false
---

# はじめに

Deno を使ったフロントエンド開発は現状どうなっているのかを試したかった。

# 試したこと

- Aleph.js :arrow_right: うまく動かず
  - https://github.com/alephjs/aleph.js
  - 自分の環境ではダメだった。
  - 開発が止まってる？
    - ![image](https://user-images.githubusercontent.com/12733897/153724600-49c5c77e-a1d7-4a81-8a93-8b141ea204a9.png)
- Rollup :arrow_right: うまく動かず
- Deno.emit() + esbuild :arrow_right: それなりに動いた
  - `React` のビルドはうまくいった
  - CSS をいい感じに扱いにくい
    - `styled-components` を使うとエラーになった（あまり追求してはいない）
- `packup` :arrow_right: 試した中では一番いい感じに動いた
  - https://packup.deno.dev/
  - いい感じに動いた
  - `styled-components` も普通に使えた
  - 中では `esbuild-wasm` を使っているらしい
    - 時間がある時にソースを見たい

## Aleph.js

## Rollup

[Deno Rollup - Next-generation ES module bundler ported for Deno - (deno-rollup)](https://opensourcelibs.com/lib/deno-rollup)

ダメっぽい。

```
error: TS2488 [ERROR]: Type 'Headers' must have a '[Symbol.iterator]()' method that returns an iterator.
  for (const [key, value] of download.headers) {
                             ~~~~~~~~~~~~~~~~
    at https://deno.land/x/cache@0.2.13/file_fetcher.ts:29:30
```

## Deno.emit() + esbuild

## packup

# 参考リンク

- [Deno 用のフロントエンド開発ツール packup について](https://zenn.dev/kt3k/articles/1df2e54cd9d4f3)
- [Deno.emit() - deno-ja](https://scrapbox.io/deno-ja/Deno.emit())
- [Denoでブラウザで動くJSファイルをビルドするには](https://zenn.dev/itte/articles/65e3ec70ef5ff6)
- [DenoでReact Server Side Renderingした話 - Qiita](https://qiita.com/isihigameKoudai/items/40b5263b7296c79873a6)
- [Denoのフロントエンド開発の動向【2021年秋】](https://zenn.dev/uki00a/articles/frontend-development-in-deno-2021-autumn)
- [Denoのフロントエンド開発の動向【2021年春】](https://zenn.dev/uki00a/articles/frontend-development-in-deno-2021-spring)
- [2021年のDenoの変更点やできごとのまとめ](https://zenn.dev/uki00a/articles/whats-new-for-deno-in-2021)
- [Deno(Aleph.js) で Markdown で投稿できる SNS のようなものを作ってみた](https://zenn.dev/chiba/articles/md-sns-deno-alephjs)
