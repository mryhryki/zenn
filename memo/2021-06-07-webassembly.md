---
title: WebAssembly (WASM) 関連
---

## 2021-06-07

結構難しい話なのと、どの辺りを狙っているのかがまだよくわからないので、後で見返したい。

[WebAssemblyで、JITコンパイラに迫る高速なJavaScriptエンジンを実装へ。Bytecode Allianceが技術解説。JavaScript以外の言語でも － Publickey](https://www.publickey1.jp/blog/21/webassemblyjitjavascriptbytecode_alliancejavascript.html)

> 事前初期化ツールで初期化が13倍も高速に

事前に JavaScript をパースしてバイトコードにしておくことで高速化する、ってことっぽい。
たしかに実行時にやる必要性はないか。

> そして記事によると、このインラインキャッシングのパターンの95％程度が、あらかじめ用意した一般化された2キロバイト程度のインラインキャッシングでカバーできるとのこと。

どのレベルでのキャッシュなんだろう 🤔

---

## 2021-06-17 追記

[Web 以外でも期待される WebAssembly - Blockchain との親和性について - LINE ENGINEERING](https://engineering.linecorp.com/ja/blog/webassembly-expected-to-be-used-beyond-the-web/)

WebAssembly の Web 以外での特徴がよくまとまっていた記事。
