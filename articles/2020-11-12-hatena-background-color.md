---
title: "JavaScriptで背景色から文字色を導出する"
emoji: "🚚"
type: "tech"
topics:
  - "JavaScript"
published: true
canonical: "https://zenn.dev/mryhryki/articles/2020-11-12-hatena-background-color"
---

※この記事は[はてなブログ](https://hyiromori.hateblo.jp/entry/2020/11/12/182643)、[別アカウント(hyiromori)](https://zenn.dev/hyiromori/articles/hatena-20201112-182643)から引っ越しました

## はじめに

このブログポストは GitHub のラベルのように、背景色をユーザーが自由に決めて、中に表示するテキストの色を計算で導出する、ということを実装する時に調べたことのメモです。

![capture](https://i.gyazo.com/bc937394a678180db13034e0fe38135d.png)

（2020-11-23 追記）
前半はYUVという色空間の輝度情報に変換してしきい値で判断する方法を紹介していますが、こちらはアクセシビリティの観点からあまりオススメできません。
実装する際は「アクセシビリティを考慮して文字色を求めてみる」の章を参考にしていただくのがオススメです。



## 背景色の指定を決める

色の指定は様々ありますが、CSS でよく使うのはRGBの指定だと思います。

今回はRDBに背景色のデータを保存するので、16進数6桁のRGB値に固定すると扱いやすそうなので、背景色はこの指定方法に決めました。

```css
/* 背景色と文字色を16進数6桁のRGB値で指定する例 */
background-color: #000000;
color: #ffffff;
```



## 何を基準に文字色を判断するのか

何も分からなかったので、とりあえずRGBの値それぞれを合計してしきい値で判定すればできたりするのかなー、と思って試してみたんですが、どうもうまくいきません。

簡単に言ってしまえば「明るい色」の時は黒、「暗い色」の時は白と判定するだけなのですが、明るいか暗いかはRGBのままでは判定できないようです。

というわけでいろいろ調べていると、YUVという色表現のうちのY(輝度)を使うと良さそう、というところまでたどり着きました。

[PHP で背景色に対して見えやすい文字色は白か黒かを判別する | Thought is free](https://thk.kanzae.net/net/itc/t7110/)



## RGBをY(輝度)に変換する

Wikipedia を見ると普通に計算式が載っていました。

![capture](https://i.gyazo.com/bae0b63cb7ec30c6bfb15b24130ed0f1.png)
[YUV - Wikipedia](https://ja.wikipedia.org/wiki/YUV)

JavaScript だとこんな感じで求められます。

```javascript
// 背景色(16進数6桁のRGB値)
const backgroudColor = 'abcdef';

// RGBをY(輝度)に変換
const brightness = 
    (parseInt(backgroudColor.substr(0, 2), 16) * 0.299) + // Red
    (parseInt(backgroudColor.substr(2, 2), 16) * 0.587) + // Green 
    (parseInt(backgroudColor.substr(4, 2), 16) * 0.114)   // Blue
```

## しきい値を決める

これに関しては実際に試してみて確認してみました。

- ~~Preview: 背景色をベースに文字色を判定してみる~~
- ~~Gist: 背景色をベースに文字色を判定してみる~~
  

![capture](https://i.gyazo.com/8817c6b6212fd752c8adbbb73ec88ba9.png)

(※ [gistpreview](https://github.com/gistpreview/gistpreview.github.io/)  を使うと Gist のプレビューが簡単にできて便利です)

いくつか試した結果 `140` で全体的に問題なさそうだったので、`140` を境に文字色を変更するようにしました。

```javascript
const brightness = Math.floor((parseInt(red, 16) * 0.299) + (parseInt(green, 16) * 0.587) + (parseInt(blue, 16) * 0.114))
const color = brightness >= 140 ? '000000' : 'FFFFFF'
```

あとはこの結果をスタイルに適用すればOKです！



## アクセシビリティを考慮して文字色を求めてみる（2020-11-23 追記）

コメントで、[アクセシビリティ観点のコメント](https://zenn.dev/hyiromori/articles/hatena-20201112-182643#comment-af0852b1344a1d43d860)を頂きました。
見た目だけで判定していましたが、コントラスト比を考慮して判定したほうがより良い結果が得られそうなので、試してみました。

テストをしたコードを含め、全部掲載するのは量が多いので [Gist](https://gist.github.com/mryhryki/29804334efd00129447878b67bff9772) にまとめました。
詳細を詳しく見たい方はこちらも見てみてください。

今回試したやり方としては、背景色に対して白と黒の文字色のコントラスト比をそれぞれ求めて、より高いコントラスト比のものを採用する、という方法をとってみました。
計算方法は以下の記事を参考視させていただきました。

- [JavascriptでWC3のコントラスト計算式を書いてみる|意識の高い時に雑記](https://lifehackdev.com/ZakkiBlog/articles/detail/web15)
- [色とコントラストの話｜twenty nine｜note](https://note.com/twentynine/n/nd79c8dd275d9)

なお、この検証では色をオブジェクト（例: `{red: 0, green: 128, blue: 255}`）で扱っているのでご注意ください。
（文字列で扱うと色々面倒だったので・・・）

### 相対輝度を求める

W3Cの定義では相対輝度に変換してから、コントラスト比を計算するようです。
まずは相対輝度を求めます。
JavaScript のコードだとこのようになります。

```javascript
// 人間の視覚特性にあった輝度に変換する
const getRGBForCalculateLuminance = (_color) => {
  const color = _color / 255
  if (color <= 0.03928) {
    return color / 12.92;
  } else {
    return Math.pow(((color + 0.055) / 1.055), 2.4);
  }
}

// 相対輝度に変換する
const getRelativeLuminance = (color) => {
  const {red, green, blue} = color
  const R = getRGBForCalculateLuminance(red);
  const G = getRGBForCalculateLuminance(green);
  const B = getRGBForCalculateLuminance(blue);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
```

### コントラスト比を求める

相対輝度を求められるようになったので、２の色（背景色と文字色）からコントラスト比を求めます。
JavaScript のコードだとこのようになります。

```javascript
const getContrastRatio = (color1, color2) => {
  const luminance1 = getRelativeLuminance(color1);
  const luminance2 = getRelativeLuminance(color2);
  const bright = Math.max(luminance1, luminance2);
  const dark = Math.min(luminance1, luminance2);
  return (bright + 0.05) / (dark + 0.05);
}
```

### 白と黒の文字色のどちらが適切かを判定する

コントラスト比を算出できるようになったので、後は白と黒のどちらの文字色がよりコントラスト比が高いかを判定すれば、適切な文字色が分かります。
JavaScript のコードだとこのようになります。


```javascript
const getFontColor = (color) => {
  const darkRatio = getContrastRatio(color, BLACK)
  const lightRatio = getContrastRatio(color, WHITE)
  return lightRatio < darkRatio ? WHITE : BLACK
}
```

### 画面上で確認してみる

実際に画面で試してみました。
たしかにYUVでコントラスト比が低い部分は見やすくなったと思います。

- Preview: [背景色からコントラスト比を考慮して文字色を判定してみる](https://gistpreview.github.io/?29804334efd00129447878b67bff9772/index.html)

【コントラスト比での算出な方法】
![Contrast Ratio](https://i.gyazo.com/9264ca35043e3087cedd3df344e32bf5.png)

【YUVでの算出な方法】
![YUV](https://i.gyazo.com/007c482372e7ca6f7055664054492d67.png")

### コントラスト比で算出する方法まとめ

YUVの話はなくなってしまいましたが、こちらの方が結果としては良さそうですね。
ちなみに、前半部分で紹介した方法だと `3,670,885/16,777,216色` (約21.9%) がコントラスト比4.5未満、最小コントラスト比が `1.58` でした。
アクセシビリティ的にあまり良い方法ではなかったです🙇‍♂️



## おわりに

YUVというのを今回調べて初めて知りましたが、こういう使い方のときに便利ですね。
似たような実装が必要になった際は参考にしてみてください。
また、こういう判定の仕方のほうが良いというのをご存じの方おられましたら、教えていただけると嬉しいです。



## 参考

- [YUV - Wikipedia](https://ja.wikipedia.org/wiki/YUV)
- [PHP で背景色に対して見えやすい文字色は白か黒かを判別する | Thought is free](https://thk.kanzae.net/net/itc/t7110/)
