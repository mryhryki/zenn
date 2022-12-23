# portfolio

[Moriya Hiroyuki (ID: mryhryki)](https://github.com/mryhryki) のポートフォリオ関連のリソースです。

## URLs

### ポートフォリオサイト

複数のURLからアクセスできます。

- https://mryhryki.com/ (PRIMARY, CloudFront + S3)
- https://www.mryhryki.com/ (SECONDARY, GitHub Pages)

### Zenn

- https://zenn.dev/mryhryki

## Setup

```shell
# 依存パッケージのダウンロード
$ npm install
```

## ポートフォリオサイト

### 開発・執筆

```shell
# `npm run build:watch` と `npm run preview` が同時に立ち上がる
$ npm run dev
```

### サイトデータのビルド

```shell
$ npm run build

# 変更監視
$ npm run build:watch
```

### プレビュー

```shell
$ npm run preview
```

### 更新

```shell
$ npm run update
```

## Zenn

### ローカルでのプレビュー

```shell
$ npm run article:preview
```
