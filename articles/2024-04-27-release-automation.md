---
title: GitHub Actions でリリースを完全に自動化した話
emoji: "🎉"
type: "tech"
topics: ["GitHub Actions", "npm", "gh"]
published: true
canonical: https://zenn.dev/mryhryki/articles/2024-04-xx-auth0-organizations
---

# はじめに

私は [markdown-preview](https://github.com/mryhryki/markdown-preview) という、よくある(?)マークダウンをリアルタイムにブラウザで見れる、個人的OSSを作っています。

個人的なOSSなので、なるべく手間をかけずにリリース作業を行いたいと考えていました。
そこで GitHub Actions を使いワンクリックで以下の作業ができるようにしました。

- npmjs.com へのリリース
- GitHub へのコミットとタグのプッシュ
- GitHub Release の作成

意外とこの辺りの情報がまとまっている記事が私は見つけられなかったので、ブログ記事にしてみました。

## おことわり

先に書いた通り、個人的なOSSのリポジトリにフィットするようなものです。
例えば、チーム開発ではワンクリックで簡単にリリースされると困る、などの問題も出ると思います。
あくまで「こういった事もできるんだな〜」という参考程度に見ていただけると幸いです。

# サンプル

実際に使用している YAML ファイルです。この記事の執筆時点のものです。

https://github.com/mryhryki/markdown-preview/blob/043830d7b9a6a43696e8f921554b37d375efb112/.github/workflows/release.yaml

# ポイント解説

## actions/checkout

[actions/checkout](https://github.com/actions/checkout) の `with.token` を使い、リポジトリに設定している Personal Access Token を使用しています。
何も指定しない場合は、実行毎に付与される `GITHUB_TOKEN` が使われるようです。

```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

`GITHUB_TOKEN` だと Branch Protection の関係で `main` ブランチにプッシュができないので、管理者である私の GitHub アカウントとして Git を操作するためです。管理者であれば、Branch Protection の設定を無視してプッシュすることができるようにしています。

この辺の事情は、リポジトリの設定によって異なります。`with.token` を指定しなくても問題ない場合もあるかもしれません。

[actions/checkout](https://github.com/actions/checkout) が Git の設定をやってくれるため、自分で `git` コマンドを使った設定をしなくて良くなり楽です。

## package.json のアップデート

`npm version` コマンドでバージョンをアップデートしています。
引数に `major`, `minor`, `patch` のいずれかを指定すると、現在のバージョンを元に自動で適切な次のバージョンに書き換えてくれて、Git のタグも作成してくれます。

現在のバージョンを確認する必要がなく、GitHub Actions を起動する際にバージョンアップの種類を選択するだけで良くなります。

![Select update type](https://mryhryki.com/file/20240425223405-1bBiT5otb8c4XS-mhcbKUqj9P1X1Ey6SrwHHGOXRLwI.webp)

## Git へのプッシュ

普通に `git` コマンドを使用します。
小さな注意点としては、以下の２つを使わないとコミットとタグの両方をプッシュできなかったです。

```shell
$ git push
$ git push --tags
```

## GitHub Release の作成

`gh` コマンドを使って GitHub Release を作成しています。
`--generate-notes` を使うと、自動でコミットログからリリースノートを生成してくれるので、手間がかかりません。

```shell
gh release create "${VERSION}" --generate-notes
```

このような感じで、リリースノートが自動的に作成されます。

https://github.com/mryhryki/markdown-preview/releases/tag/v0.5.9

ちなみに、GitHub 上にある `Generate release notes` というボタンと同じ内容です。

![Generate release notes](https://mryhryki.com/file/20240425223739-_p30i8LM7_YOn1tz0Zp7bgCgMNKGMXUXO39XKwY61nU.webp)

# おわりに

リリース作業が非常に楽になったので、今後も更新を続けていけそうです。
