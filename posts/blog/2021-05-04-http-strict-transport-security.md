---
title: HTTP Strict Transport Security（HSTS）
created_at: 2021-05-04T10:00:00+09:00
---

[HTTP Strict Transport Security（HSTS）とは？](https://zenn.dev/ak/articles/dfaa9e01b374a0)

`http://` を `https://` に強制するための方法。

1. `strict-transport-security` というヘッダーを付与する
2. `preloaded HSTS` というリストに追加しておく

`2.` のほうが安全そう。
