---
title: JavaScript で Unicode 正規化
---

## 発端

[AWS SDK for JavaScript](https://aws.amazon.com/jp/sdk-for-javascript/) で取得した S3 オブジェクトのキーの濁点が、文字に結合しておらず、ばらばらになっている。

> 例:  `が` 一文字ではなく `か` と `゛` で分離している

そのため、同じように見えても比較 ( `===` ) すると `false` になる場合があって困ったことがあったのでなんとかしたかった。

## 解決

普通に `String.prototype.normalize()` というメソッドを使えば正規化できるようです。
いくつか方式があるようです。（今回は一致すれば良いので、そこまで詳しく調べていない）

## 参考リンク

- [String.prototype.normalize() - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
- [Unicodeの結合文字列がバグを呼び起こしてしまった - エンジニアのはしがき](https://tm-progapp.hatenablog.com/entry/2021/03/13/122342)
- [macOS上のAPFSはUnicode Normalizationを行うのか? - なるせにっき](https://naruse.hateblo.jp/entry/2017/03/28/181519)
- [ファイルシステムとS3でのユニコード正規化の関係を調べてみた2021 - Techブログ - MNTSQ, Ltd.](https://tech.mntsq.co.jp/entry/2021/03/17/160000)
- [JavaScriptで濁音や半角カナの処理 - Qiita](https://qiita.com/jkr_2255/items/e0c039c438d3ebfd1a6a)
