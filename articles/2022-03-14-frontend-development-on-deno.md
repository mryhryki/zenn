---
title: "DenoでReactをビルドする"
emoji: "🦕"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Deno", "React"]
published: false
---

# はじめに

最近興味のある Deno を使って、フロントエンド開発がどの程度可能なのかを試してみました。
今回は自分のよく使う React をビルドできるかにターゲットを絞って調べてみました。

開発体験の良さをもとめるというよりは、とりあえず React(JSX) を TypeScript で書いて、ブラウザで動かせるようにするという感じです。


# 検証環境

```shell
$ sw_vers
ProductName:	macOS
ProductVersion:	12.2.1
BuildVersion:	21D62

$ deno --version
deno 1.18.2 (release, x86_64-apple-darwin)
v8 9.8.177.6
typescript 4.5.2
```

# 試したことと結果

- Aleph.js: 動かず
- Deno.emit() + esbuild: 動いた
- Packup: 動いた

## Aleph.js: 動かず

https://github.com/alephjs/aleph.js


```shell
$ deno run -A https://deno.land/x/aleph/install.ts
Check https://deno.land/x/aleph/install.ts
Looking up latest version...
Aleph.js was installed successfully
Run 'aleph -h' to get started

$ aleph init example-aleph
Using VS Code? [y/n] n
Deploy to Vercel? [y/n] n
Downloading template. This might take a moment...
Apply template...
Cache deps...
Check https://deno.land/x/aleph@v0.3.0-beta.19/framework/core/mod.ts
Check https://deno.land/x/aleph@v0.3.0-beta.19/framework/react/mod.ts
Done

Aleph.js is ready to go!
▲ cd example-aleph
▲ aleph dev    # start the app in `development` mode
▲ aleph start  # start the app in `production` mode
▲ aleph build  # build the app to a static site (SSG)

Docs: https://alephjs.org/docs
Bugs: https://alephjs.org.com/alephjs/aleph.js/issues

$ aleph dev
INFO Start watching code changes...
INFO Server ready on http://localhost:8080/$ deno run -A https://deno.land/x/aleph/install.ts
INFO render '/' in 6ms
INFO render '/favicon.ico' in 1ms
WARN http: response headers already sent
```

![aleph.js on local](https://mryhryki.com/file/Wc3KFuZ7xDqDHUO7sqYiSOBZX1gvk.png)

`v0.3.0-beta.19` でまだベータ版のためかもしれません。
ただリリースが2021年9月で、コミットも2021年10月頃からほぼないので、開発が停滞しているのかもしれません。
あまり深追いする感じでもないかな、と思ったのでここで試すのはやめました。


## Rollup

[Deno Rollup - Next-generation ES module bundler ported for Deno - (deno-rollup)](https://opensourcelibs.com/lib/deno-rollup)

ダメっぽい。

```
error: TS2488 [ERROR]: Type 'Headers' must have a '[Symbol.iterator]()' method that returns an iterator.
  for (const [key, value] of download.headers) {
                             ~~~~~~~~~~~~~~~~
    at https://deno.land/x/cache@0.2.13/file_fetcher.ts:29:30
```

## Deno.emit() + esbuild: 動いた


[Deno.emit()](https://deno.land/manual/typescript/runtime#denoemit) は


```typescript
const { files } = await Deno.emit("./src/app.tsx", {
  bundle: "module",
  check: true,
  compilerOptions: {
    allowSyntheticDefaultImports: true,
    jsx: "react",
    jsxFactory: "React.createElement",
    lib: ["dom", "esnext"],
    module: "esnext",
    target: "es2015",
  },
});

console.log(files["deno:///bundle.js"]); // => [Bundled Code]
```

また、esbuild をいれて minify したりもできました。


```typescript
import * as esbuild from "https://deno.land/x/esbuild@v0.14.13/mod.js";

const { files } = await Deno.emit("./src/app.tsx", {
  // (省略)
});

const { warnings, code, map } = await esbuild.transform(
  files["deno:///bundle.js"],
  {
    minify: true,
    sourcemap: true,
    define: {
      "ENVIRONMENT": '"production"',
    },
    format: "esm",
  },
);
if (warnings.length > 0) {
  warnings.forEach((warning) => console.warn(warning));
}

const encoder = new TextEncoder();
await Deno.writeFile("./dist/bundle.js", encoder.encode(code));
await Deno.writeFile("./dist/bundle.js.map", encoder.encode(map));
esbuild.stop();
```

これで React 自体のビルドはいい感じにできました。
ただ CSS Modules は使えず、styled-components だとエラーが起きたのでもうちょっと良い方法があるか調べてみました。

※と思ってたんですが、2022-03-20 に再度試してみたところ正常にビルドができたので、実は可能だったかもしれません。

## Packup: 動いた

> Packup is web application bundler for Deno, inspired by parcel.
https://packup.deno.dev/

Packup はバンドルツールで、parcel に影響を受けています。

作者の [@kt3k] さんは日本人で [Deno Land Inc. の中の人](https://engineer-lab.findy-code.io/deno-kt3k) です。

使い方もシンプルで、parcel と同じように `index.html` のように HTML ファイルをエントリーポイントとして指定すれば動きます。

```shell
$ packup serve index.html
$ packup build index.html
```

今回試した中では、これが一番いい感じに動きました。

## Deno Deploy

https://example-react-with-deno.deno.dev/

# おわりに

いくつか試してみましたが、なかなかこれという感じのものはないですね。

# 参考リンク

- [Deno 用のフロントエンド開発ツール packup について](https://zenn.dev/kt3k/articles/1df2e54cd9d4f3)
- [Deno.emit() - deno-ja](https://scrapbox.io/deno-ja/Deno.emit())
- [Denoでブラウザで動くJSファイルをビルドするには](https://zenn.dev/itte/articles/65e3ec70ef5ff6)
- [DenoでReact Server Side Renderingした話 - Qiita](https://qiita.com/isihigameKoudai/items/40b5263b7296c79873a6)
- [Denoのフロントエンド開発の動向【2021年秋】](https://zenn.dev/uki00a/articles/frontend-development-in-deno-2021-autumn)
- [Denoのフロントエンド開発の動向【2021年春】](https://zenn.dev/uki00a/articles/frontend-development-in-deno-2021-spring)
- [2021年のDenoの変更点やできごとのまとめ](https://zenn.dev/uki00a/articles/whats-new-for-deno-in-2021)
- [Deno(Aleph.js) で Markdown で投稿できる SNS のようなものを作ってみた](https://zenn.dev/chiba/articles/md-sns-deno-alephjs)
