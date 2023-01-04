---
title: "DenoでReactをビルドする"
emoji: "🦕"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Deno", "React"]
published: true
canonical: https://zenn.dev/mryhryki/articles/2022-03-24-frontend-development-on-deno
---

# はじめに

最近興味のある Deno でフロントエンド開発がどの程度できるのか気になって試してみました。
とはいえフロントエンド開発というと範囲が広すぎるので、今回は React をビルドすることにターゲットを絞って調べてみました。


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


# 試したこと

- Aleph.js: 動かず
- Deno.emit() + esbuild: 動いた
- Packup: 動いた


## Aleph.js: 動かず

まず調べていく中で[良さげな雰囲気があった Aleph.js](https://zenn.dev/uki00a/articles/frontend-development-in-deno-2021-autumn#aleph.js-v0.3-beta%E3%81%8C%E3%83%AA%E3%83%AA%E3%83%BC%E3%82%B9) を試してみました。

https://github.com/alephjs/aleph.js

[Get Started - Aleph.js](https://alephjs.org/docs/get-started) に従って進めてみたのですが、アクセスしても 404 が返ってきてしまいます🤔

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

↓アクセスした結果。

![aleph.js on local](https://mryhryki.com/file/Wc3KIaSZS0MTkKPDiG-9PPM2Qp_JR.png)

他のページを作ってみたりして色々試してみたのですが、どうしても 404 になってしまいます。
今回試したのが `v0.3.0-beta.19` でまだベータ版のためかもしれません。

ただリリースが2021年9月で、コミットも2021年10月頃からほぼないので、開発が停滞しているのかもしれません。
今回はあまり深追いするつもりもなかったので、これ以上は試しませんでした。


## Deno.emit() + esbuild: 動いた

[Deno.emit()](https://deno.land/manual/typescript/runtime#denoemit) は Deno に組み込まれている型チェック・トランスパイル・バンドルができる API のようです。
たまたま調べていたときに見つけたので使ってみました。

以下のような感じのコードでビルドすることができました。

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

また、esbuild をいれて minify してみました。

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

一応ビルドがとりあえずできました。
ただし `--unstable` フラグが必要な機能なので、今後 API が変わり上記のコードで動作しなくなる可能性もあるので微妙かもしれません。

補足として esbuild 単体で動かすこともできますが、残念ながら `import React from "https://cdn.skypack.dev/react@17.0.2?dts";` のような URL からのインポートに対応できないので、実戦ではまだ使えない感じでした。


## Packup: 動いた

> Packup is web application bundler for Deno, inspired by parcel.
https://packup.deno.dev/

Packup はバンドルツールで、parcel に影響を受けているようです。
作者の [@kt3k](https://twitter.com/kt3k) さんは日本人で [Deno Land Inc. の中の人](https://engineer-lab.findy-code.io/deno-kt3k) です。

使い方もシンプルで、parcel と同じように `index.html` のように HTML ファイルをエントリーポイントとして指定すれば動きます。

```shell
$ packup serve index.html
$ packup build index.html
```

`parkup serve` では(たぶん)ホットリロードにも対応しているようです。
今回試した中では、これが開発体験的に一番良かったです。


## おまけ: Deno Deploy で公開してみる

Deno.emit() + esbuild でビルドしたWebアプリを Deno Deploy で公開してみました。
https://example-react-with-deno.deno.dev/

ソースコードはこちらです。
https://github.com/mryhryki/example-react-with-deno

Deno Deploy 上で Deno.emit() は（たぶん安定化されておらず `--unstable` が必要なので）使用できないようなので、今回はビルド済みのコードをコミットしてデプロイしています。

サーバー側のコードは、以下の記事で紹介したような感じで実装しています。
https://zenn.dev/mryhryki/articles/2022-01-03-http-server-on-deno


# おわりに

色々調べてみたのですが、なかなか Deno だとこれ！っていう感じのものがないような雰囲気を感じました。
時々触る程度ですが、Deno は結構期待しているのでいい感じに開発ができるようになると良いな〜、と思います。


# 参考リンク

- [Deno 用のフロントエンド開発ツール packup について](https://zenn.dev/kt3k/articles/1df2e54cd9d4f3)
- [Deno.emit() - deno-ja](https://scrapbox.io/deno-ja/Deno.emit())
- [Denoでブラウザで動くJSファイルをビルドするには](https://zenn.dev/itte/articles/65e3ec70ef5ff6)
- [DenoでReact Server Side Renderingした話 - Qiita](https://qiita.com/isihigameKoudai/items/40b5263b7296c79873a6)
- [Denoのフロントエンド開発の動向【2021年秋】](https://zenn.dev/uki00a/articles/frontend-development-in-deno-2021-autumn)
- [Denoのフロントエンド開発の動向【2021年春】](https://zenn.dev/uki00a/articles/frontend-development-in-deno-2021-spring)
- [2021年のDenoの変更点やできごとのまとめ](https://zenn.dev/uki00a/articles/whats-new-for-deno-in-2021)
- [Deno(Aleph.js) で Markdown で投稿できる SNS のようなものを作ってみた](https://zenn.dev/chiba/articles/md-sns-deno-alephjs)
