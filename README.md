# portfolio

[Moriya Hiroyuki (ID: mryhryki)](https://github.com/mryhryki) のポートフォリオ関連のソースコードです。

主に以下のコードを管理しています。

- [ポートフォリオサイト](https://mryhryki.com/)
  - `site/`
- [Zenn](https://zenn.dev/mryhryki) の記事データ ([公式ドキュメント](https://zenn.dev/zenn/articles/connect-to-github))
  - `articles/`
- [ブログデータ](https://mryhryki.com/blog/)
  - `articles/` (Zenn の投稿をこちらでも公開）
  - `backup/` (過去の投稿記事のバックアップをこちらでも公開）
  - `blog/`

## Setup

```bash
# 依存パッケージのダウンロード
$ npm install
```

## ポートフォリオサイト

### サイトデータのビルド

```bash
$ npm run build
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
