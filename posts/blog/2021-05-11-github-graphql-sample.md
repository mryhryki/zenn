---
title: GitHub の GraphQL を手軽に使う方法
created_at: 2021-05-11T10:00:00+09:00
---

よく使うのでメモ。

[Explorer - GitHub Docs](https://docs.github.com/en/graphql/overview/explorer) にアクセスして「Sign in with GitHub」をするとすぐ使える。

例えば、以下のようなクエリでリポジトリ一覧が取得できる。

```
{
  user(login: "mryhryki") {
    repositories(first: 100) {
      nodes {
        name
      }
    }
  }
}
```