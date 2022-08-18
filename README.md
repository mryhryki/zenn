# portfolio

[Moriya Hiroyuki (ID: mryhryki)](https://github.com/mryhryki) のポートフォリオ関連のソースコードです。

主に以下のデータを管理しています。

- ポートフォリオサイトの静的リソース
  - `site/`
- ブログのデータ（記事・スライド・スクラップ）
  - `posts/`
- Zenn のデータ ([公式ドキュメント](https://zenn.dev/zenn/articles/connect-to-github))
  - `articles/`
  - `books/`

## URLs

### ポートフォリオサイト

複数のURLからアクセスできます。

- https://mryhryki.com/ (PRIMARY1, CloudFront + S3)
- https://www.mryhryki.com/ (PRIMARY2, GitHub Pages)
- https://deno.mryhryki.com (SECONDARY1, Deno Deploy)
- https://app.mryhryki.workers.dev/ (SECONDARY2, Cloudflare Workers)

※SECONDARY は最大1時間の遅延あり。

### Zenn

- https://zenn.dev/mryhryki
- https://mryhryki.com/blog/?check=zenn (BACKUP)

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
