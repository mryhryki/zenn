# portfolio

[ポートフォリオサイト](https://mryhryki.com/) のソースコードです。<br>
また [Zenn](https://zenn.dev/mryhryki) の記事データも管理しています。

## ポートフォリオの更新

```bash
$ npm run update
```

## Zenn

[article/](./article) ディレクトリは以下に記事データを管理しています。
`main` ブランチと同期しています。

詳しくはこちら: [GitHubリポジトリでZennのコンテンツを管理する](https://zenn.dev/zenn/articles/connect-to-github)

### ローカルでの執筆のCLIサンプル。

```bash
# 依存パッケージのダウンロード
$ npm i

# 記事の追加
$ npm run article:add

# ブラウザでのプレビュー
$ npm run article:preview
```
