---
title: Webpack5 にバージョンアップしました。
canonical: https://tech.connehito.com/entry/2022/02/16/163119
---

こんにちは！ フロントエンドエンジニアの [もりや](https://mryhryki.com/) です。
今回はママリのアプリ内で使われている WebView の [Webpack](https://webpack.js.org/) を v4 から v5 にアップデートしたので、その事例を紹介します。

Webpack5 は2020年10月にリリースされたので、特に目新しい情報はありませんが、１つの事例として読んでいただければ幸いです。

## はじめに

今回のアップデートは、以下２つの公式ドキュメントを参考に進めました。

- [To v5 from v4 | webpack](https://webpack.js.org/migrate/5/#upgrade-webpack-4-and-its-pluginsloaders)
    - Webpack 公式の v4 から v5 へのマイグレーションガイド
- [Webpack 5 release (2020-10-10) | webpack](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)
    - Webpack v5 のリリース情報

リリース情報を見たところ、Webpack5 で破壊的な変更はなく、Webpack4 系の最新で非推奨のメッセージが出ていなければアップデートできるようです。
実際にやってみたところ、Webpack 本体は割と簡単にアップデートできました。

ただし、プラグインやローダーのアップデートでちょっと手間がかかりましたので、そのあたりを中心に紹介します。

## アップデートの流れ

1. Webpack4 と `webpack-cli` を最新に上げる
2. プラグイン、ローダーを可能な限り最新に上げる
3. Webpack5 にアップデート
4. プラグイン、ローダーを最新に上げる
5. 動作確認


## 1. Webpack4 と webpack-cli を最新に上げる

まず Webpack を v4 系の最新にアップデートします。
2022-02-01 時点で最新は以下のようになっていました。

- `webpack`: [v4.46.0](https://github.com/webpack/webpack/releases/tag/v4.46.0)
- `webpack-cli`: [v4.9.2](https://github.com/webpack/webpack-cli/releases/tag/webpack-cli%404.9.2)

この時点で非推奨のメッセージが出たり、[非推奨のオプション](https://webpack.js.org/migrate/5/#update-outdated-options) を使っていなければOKです。
出ている場合は、それぞれ内容に応じて修正をします。

コネヒトの場合、アップデートによって非推奨のメッセージが出たり、非推奨のオプションを使用している箇所はありませんでした。

## 2. プラグイン、ローダーを可能な限り最新に上げる

Webpack で使用しているプラグインやローダーがある場合は、可能な限り最新にアップデートします。
「可能な限り」と書いたのは、最新バージョンだと Webpack4 では使えない場合があるためです。

コネヒトの場合、２つのプラグインで引っかかりました。

まず [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) というプラグインの場合、[v2 系は Webpack5 のみのサポート](https://github.com/webpack-contrib/mini-css-extract-plugin/releases/tag/v2.0.0) になったので、この段階では v1 系の最新にアップデートしました。

![mini-css-extract-plugin v2.0.0 breaking changes](https://mryhryki.com/file/Wc21CBDT0p8jnaOKNVwrVrfTROgXm.png)

また [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) というプラグインの場合、Webpack5 では [css-minimizer-webpack-plugin](https://github.com/webpack-contrib/css-minimizer-webpack-plugin) を使うようにと書かれていたので、この時点では変更を控え、Webpack5 にアップデート後にライブラリを差し替えました。

![optimize-css-assets-webpack-plugin README](https://mryhryki.com/file/Wc21ApuSfCBS_GrjVxbAQQVQM2bKC.jpg)

このようにライブラリによって、それぞれのライブラリのドキュメントを見て判断する必要があります。
ただ数も多いので、ライブラリを一つずつバージョンアップしてビルドが通るかどうかを見て、エラーが出た場合はドキュメントなどを確認する、という感じで進めました。


## 3. Webpack5 にアップデート

いよいよ Webpack5 にアップデートします。

コネヒトの場合、アップデートしてみるとビルドエラーが出ました。
ただエラーメッセージを見たところプラグイン関連のエラーだったので、次のプラグイン、ローダーを最新に上げる対応に進みました。


## 4. プラグイン、ローダーを最新に上げる

`2.` で Webpack5 でないと使えなかったプラグインやローダーの最新版にアップデートしました。

- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) → 最新バージョンに上げる
- [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) → [css-minimizer-webpack-plugin](https://github.com/webpack-contrib/css-minimizer-webpack-plugin) に差し替え
    - css-minimizer-webpack-plugin の README に従って導入すれば特に問題なくできました。


## 5. 動作確認

正常に動作し、CIでのテストなどチェックが完了したら、最後に実機で動作テストします。

コネヒトの場合、この段階では特に問題は出ませんでした。

余談ですが、以前 [「ママリの WebView を JavaScript + Flow から TypeScript に移行しました - コネヒト開発者ブログ」](https://tech.connehito.com/entry/2021-12-11-flow-to-typescript) の際に Cypress によるスクリーンショットの比較テストを導入していたので、明らかに動作しない場合などは作業途中でも自動で検出できました。
特定のページだけライブラリの関係で表示されないケースもあり、コミットしてプッシュするたびに自動でチェックしてくれるので効率が良かったです。


## おわりに

既に Webpack5 がリリースされて１年以上経っているためか、関連ライブラリ含めドキュメントが充実していたので、比較的簡単にアップデートができました。

また自動テストを整備したおかげで効率よく作業を進められ、テストの重要性も感じました。

今後もママリのモダン化を進めていきたいです。


### PR

コネヒトでは、フロントエンド開発のモダン化に挑戦したいエンジニアも募集中です！

[https://hrmos.co/pages/connehito/jobs/00e:embed:cite]
