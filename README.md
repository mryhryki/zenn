# portfolio

[Moriya Hiroyuki (ID: mryhryki)](https://github.com/mryhryki) のポートフォリオ関連のソースコードです。

主に以下のコードを管理しています。

- [ポートフォリオサイト](https://mryhryki.com/)
  - `site/`
- [Zenn](https://zenn.dev/mryhryki) の記事データ ([公式ドキュメント](https://zenn.dev/zenn/articles/connect-to-github))
  - `articles/`
- [ブログ](https://mryhryki.com/blog/)
  - `articles/` (Zenn の投稿をこちらでも公開）
  - `posts/blog/`
- [スライド](https://mryhryki.com/slide/)
  - `posts/slide/`
- [読了記録](https://mryhryki.com/reading_log/)
  - `posts/reading_log/`

## Setup

```bash
# 依存パッケージのダウンロード
$ npm install
```

## ポートフォリオサイト

### 開発・執筆

```bash
# `npm run build:watch` と `npm run preview` が同時に立ち上がる
$ npm run dev
```

### サイトデータのビルド

```bash
$ npm run build

# 変更監視
$ npm run build:watch
```

### プレビュー

```bash
$ npm run preview
```

### 更新

```bash
$ npm run update
```


## Zenn

[article/](./articles) ディレクトリは以下に記事データを管理しています。
`main` ブランチと同期しています。

### ローカルでの執筆のCLIサンプル。

```bash
# 記事の追加
$ npm run article:add

# ブラウザでのプレビュー
$ npm run article:preview
```
