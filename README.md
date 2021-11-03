# portfolio

[Moriya Hiroyuki (ID: mryhryki)](https://github.com/mryhryki) のポートフォリオ関連のソースコードです。

主に以下のコードを管理しています。

- [ポートフォリオサイト](https://mryhryki.com/)
  - `docs/`
- [ブログデータ](https://mryhryki.com/blog/)
  - `blog/`
- [Zenn](https://zenn.dev/mryhryki) の記事データ
  - `articles/`, `books/`
  - 関連: [GitHubリポジトリでZennのコンテンツを管理する](https://zenn.dev/zenn/articles/connect-to-github)
- 過去のブログのバックアップデータ
  - `backup/`

## ポートフォリオサイト

### プレビュー

```bash
$ npm run site:preview
```


### 更新

```bash
$ npm run site:update
```

## Zenn

[article/](./article) ディレクトリは以下に記事データを管理しています。
`main` ブランチと同期しています。


### ローカルでの執筆のCLIサンプル。

```bash
# 依存パッケージのダウンロード
$ npm i

# 記事の追加
$ npm run article:add

# ブラウザでのプレビュー
$ npm run article:preview
```
