---
title: Storybook で error:0308010C:digital envelope routines::unsupported というエラーが出た場合の対応方法
---

## このドキュメントの目的

Node.js を v18.x にバージョンアップして、Storybook をビルドしようと `build-storybook` を実行すると、以下のようなエラーが出ました。

```
Error: error:0308010C:digital envelope routines::unsupported
```

このエラーを解消するために集めた情報と解消方法をまとめます。



## 原因

はっきり特定したわけでは無いですが、Node.js のバージョンが上がったことで、OpenSSL のバージョンも v3 系になったことが原因かもしれません。

https://github.com/storybookjs/storybook/issues/18230#issuecomment-1239859295

また、Storybook はデフォルトで Webpack4 を使うようなので、それも関連しているかもしれません。

![Storybook has Webpack4 by default](https://mryhryki.com/file/U4sq8VEA9Z7e3Ll2KXSnEp8qm13Jl7u-Xi9pd-15eoMWl_4Q.webp)

https://storybook.js.org/blog/storybook-for-webpack-5/



## Storybook で Webpack5 を使う

公式のドキュメントに書いてあります。

![Use Webpack5 on Storybook](https://mryhryki.com/file/U4sqHsFfaqkUKC1HXC7JeR9a20ug3P7_OCf-PNJCsz-tXccA.webp)

https://storybook.js.org/docs/react/builders/webpack#webpack-5

まず [@storybook/manager-webpack5](https://www.npmjs.com/package/@storybook/manager-webpack5) と [@storybook/builder-webpack5](https://www.npmjs.com/package/@storybook/builder-webpack5) の２つを追加します。

```shell
$ npm i -D @storybook/manager-webpack5 @storybook/builder-webpack5
```

次に `.storybook/main.js` に以下の指定を追加します。

```diff
  module.exports = {
+   core: {
+     builder: 'webpack5',
+   },
```

最後に `build-storybook` を実行してエラーが出なければOKです。

## 追記

解消後に見つけてしまったのですが、Node 17 でエラーになるよ、というドンピシャの Issue を発見しました。

[Error when running build-storybook with Node 17 · Issue #16555 · storybookjs/storybook](https://github.com/storybookjs/storybook/issues/16555)


