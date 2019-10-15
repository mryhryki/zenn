---
layout: blog
header_image: blog
title: CSSアニメーションを使って風車をぐるぐる回してみた
keyword: CSS
---

なんかアニメーションを使ってサクッと何か作って欲しい、という事があったので、その内容を書いてみました。

今回は、風車をぐるぐる回すというアニメーションを作ってみました。

## 画像の準備

まずは、ぐるぐる回すための画像を加工します。

[こちらのフリー素材](https://illust.okinawa/k-event/k-event-autumn/kajimaya/e718.html)を使わせていただきました。
ありがとうございます。

こちらの画像を、固定表示する部分と、ぐるぐる回る部分に分割します。

僕は、Mac標準のプレビューツールを使いました。

以下のように、２つの画像を用意できればOKです。

<img style="float: left; width: 100px;" src="/assets/images/blog/2019-10-15-css-animation/kazaguruma.png" />
<img style="float: left; width: 100px;" src="/assets/images/blog/2019-10-15-css-animation/base.png" />
<br style="clear: both" />

## HTMLの作成

とりあえずベースとなるHTMLを書きます。

```html
<!doctype html>
<html lang="ja">
<head>
  <title>風車をぐるぐる回してみた</title>
  <style type="text/css">
    /* この後で記述します */
  </style>
</head>
<body>
  <img id="kazaguruma" src="./img/kazaguruma.png" />
  <img id="base" src="./img/base.png" />
</body>
</html>
```

## CSSを書く

### アニメーション

`@keyframes` という宣言をしてどういうアニメーションをするのかを記述します。
以下の例では、開始時は0度、終了時は-360度（左回転で１周）という内容になります。

```css
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
```

### スタイルとアニメーションを設定

それぞれの画像の位置を固定し、風車部分の画像を回転させるCSSを記述します。
`top` `left` は画像に応じて頑張っていい感じの位置に調整します。

```css
#kazaguruma {
  animation: spin 1.5s infinite linear;
  position: absolute;
  top: 0;
  left: 46px;
}
#base {
  position: absolute;
  top: 0;
  left: 0;
}
```

アニメーションは `animation: spin 1.5s infinite linear` という一行のみです。
それぞれの意味は以下のとおりです。

- `spin` 先に記述したアニメーション名
- `1.5s` 1.5秒で一連のアニメーションを実行する
- `infinite` 無限ループ（指定がない場合は一回だけ実行される）
- `linear` アニメーションを線形に実行する

## 出来あがり

<style type="text/css">
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
  #kazaguruma {
    animation: spin 1.5s infinite linear;
    position: absolute;
    top: 0;
    left: 46px;
  }
  #base {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<div style="position: relative; height: 400px; margin: 16px;">
  <img id="base" src="/assets/images/blog/2019-10-15-css-animation/base.png" />
  <img id="kazaguruma" src="/assets/images/blog/2019-10-15-css-animation/kazaguruma.png" />
</div>
