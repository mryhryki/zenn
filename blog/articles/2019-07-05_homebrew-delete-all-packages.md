# Homebrew の全パッケージを削除する

Macbook が壊れて別の Macbook を使おうとしたとき、以前入れた Homebrew のパッケージと干渉して、一旦クリーンな状況に戻したいので、その手順をメモしました。

## Homebrew の更新

とりあえず Homebrew の更新をします。

```bash
$ brew update
```

## 実行方法

全パッケージの消し方については、調べていたら[こちらのブログ（英語）](https://darryldias.me/12/remove-all-installed-homebrew-packages/)に良い方法が書いてありました。

```bash
# 全パッケージの削除
$ brew remove --force $(brew list) --ignore-dependencies

# 未使用パッケージの削除
$ brew cleanup
```

これでキレイになり、パッケージのインストールが捗りました。
