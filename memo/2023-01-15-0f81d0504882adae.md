---
title: 複数のリポジトリを履歴を保持しながらマージするやり方
---

## はじめに

時々やりたい時があるのでメモ。

## シェルスクリプト

GitHub の前提ですが `REMOTE_URL` を変えれば多分使えると思います。

```shell
# https://github.com/mryhryki/target の場合の例
export OWNER="mryhryki"
export REPOSITORY="target"
export REMOTE_URL="git@github.com:${OWNER}/${REPOSITORY}.git"
export DIR_PATH="subtree" # マージ先ディレクトリ。この場合 `(ROOT)/subtree/` に `mryhryki/target` のリポジトリのコンテンツが入ります。

cd "(マージ先のリポジトリルート)"
git remote add "${REPOSITORY}" "${REMOTE_URL}"
git fetch "${REPOSITORY}"
git read-tree --prefix="${DIR_PATH}" "${REPOSITORY}/main"
git checkout -- .
git add .
git commit -m "Merge ${REPOSITORY} into ${DIR_PATH}/"
git merge -s subtree "${REPOSITORY}/main" --allow-unrelated-histories
git remote remove "${REPOSITORY}"
````

## 参考リンク

- [複数のGitリポジトリを一つにまとめる - Qiita](https://qiita.com/hellscare/items/bad5021964f529d6f690)
