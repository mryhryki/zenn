---
title: CSS の改行を扱う指定についてまとめる
---

## はじめに

CSS で改行の調整をする時に、毎回調べている気がするので一覧にしたいという気持ちで書きました。
中身に関しては、基本MDNへのリンクと部分的に引用しているだけです。
詳しくは、MDN のドキュメントを参照してみてください。

## white-space

> このプロパティは 2 つのことを指定します。
>
> - ホワイトスペースを折り畳むかどうか、およびその方法。
> - 行を自動折り返しの場面で折り返すことができるかどうか。
> 
> https://developer.mozilla.org/ja/docs/Web/CSS/white-space
 
## line-break

> line-break は CSS のプロパティで、中国語、日本語、韓国語 (CJK) のテキストにおいて、句読点や記号を用いた場合の改行規則 (禁則処理) を設定します。
>
> https://developer.mozilla.org/ja/docs/Web/CSS/line-break

英語とかには影響ないのか。

## overflow-wrap

> overflow-wrap は CSS のプロパティで、インライン要素に対して、テキストが行ボックスをあふれないように、ブラウザーが分割できない文字列の途中で改行を入れるかどうかの設定を適用します。
> 
> Note: word-break とは対照的に、 overflow-wrap は単語全体があふれずに行内に配置できない場合にのみ、改行を生成します。
> 
> https://developer.mozilla.org/ja/docs/Web/CSS/overflow-wrap

## word-break

> word-break は CSS のプロパティで、改行しなければテキストがコンテンツボックスからあふれる場合に、ブラウザーが改行を挿入するかどうかを指定します。
> 
> https://developer.mozilla.org/ja/docs/Web/CSS/word-break


## おまけ: text-overflow

> text-overflow は CSS のプロパティで、非表示のあふれた内容をどのようにユーザーに知らせるのかを設定します。切り取られるか、省略記号 ('…') を表示するか、独自の文字列を表示するかです。
>
> https://developer.mozilla.org/ja/docs/Web/CSS/text-overflow


## 参考リンク

調べる時に参照した、MDN 以外のリンクです。

- [【CSS】content内で改行やスペースを入力する方法](https://saruwakakun.com/html-css/reference/css-break)
- [CSSでbr要素みたいに改行する方法](https://lab.syncer.jp/Web/CSS/Snippet/4/)
- [改行されないテキストをCSSで改行させる方法はこれ！ - WebKin](https://web-kin.com/2021/06/2868/)
