---
title: Canvas を使って画像をリサイズする
canonical: https://tech.connehito.com/entry/2022/03/18/093812
---

## はじめに

こんにちは！ フロントエンドエンジニアの [もりや](https://mryhryki.com/) です。

今回はママリのアプリ内で使われている WebView で、画像をリサイズする処理を Canvas で実装した事例を紹介します。


## 画像のリサイズが必要な理由

昨今のスマホのカメラで撮った画像は数MB程度と大きく、アップロードに時間がかかったり、そもそもサーバー側で何MBまでの画像を許容するかなど課題もあります。
また iOS/Android のママリアプリでも、おそらく同様の理由からリサイズをしてアップロードするようになっていました。
そのため、WebView でもアップロード前に画像をリサイズする処理を入れ、快適かつ安全にアップロードできるようにしました。

ライブラリなどもあると思いますが、今回のようにシンプルなリサイズ用途であれば Canvas のみで十分可能と判断し実装してみました。


## Canvas とは

> Canvas API は JavaScript と HTML の &lt;canvas&gt; 要素によってグラフィックを描く方法を提供します。他にも、アニメーション、ゲームのグラフィック、データの可視化、写真加工、リアルタイム動画処理などに使用することができます。
> https://developer.mozilla.org/ja/docs/Web/API/Canvas_API

つまり、グラフィックに関する様々なことができる [Web API](https://developer.mozilla.org/ja/docs/Web/API) です。

サポートされているブラウザも96%以上とかなり多く、ほとんどの環境で使えると思います。

![Can I Use Canvas](https://mryhryki.com/file/Wc398qxIxQ4mZXjBnx-HAYnkOsDUl.jpeg)
https://caniuse.com/canvas


## Canvas を使ったリサイズの実装

今回実装したリサイズ処理を、実装例を使いながら解説します。
（コード全体を見たい場合は「コード例」の章まで飛ばしてください）

なお、今回はコードをシンプルにするため幅 (`width`) だけを指定してリサイズするような処理にしています。


### 1. Context の取得

Canvas に描画するために必要な [CanvasRenderingContext2D](https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D) を取得します。

```typescript
const context = document.createElement('canvas').getContext('2d')
```

ちなみに `2d` の他に `webgl`, `webgl2`, `bitmaprenderer` といった値も[指定できるようです](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext#parameters)。
（私は使用したことがないので、説明は省略します）


### 2. 画像サイズの取得

リサイズ後のサイズを計算するために、[Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image) を使用して変換対象の画像のサイズを取得します。

```typescript
const image: HTMLImageElement = await new Promise((resolve, reject) => {
  const image = new Image()
  image.addEventListener('load', () => resolve(image))
  image.addEventListener('error', reject)
  image.src = URL.createObjectURL(imageData)
})
const { naturalHeight: beforeHeight, naturalWidth: beforeWidth } = image
console.log("H%ixW%i", beforeHeight, beforeWidth) // => H800xW600
```

画像のロード後でしかサイズが取得できないので、コールバックを使いつつ `Promise` でラップするような感じにしています。

ちなみに `new Image()` で引数を指定しない場合は、`naturalHeight`, `naturalWidth` でも `height`, `width` でも同じ値になるようです。

> CSS pixels are reflected through the properties HTMLImageElement.naturalWidth and HTMLImageElement.naturalHeight.
> If no size is specified in the constructor both pairs of properties have the same values.
>
> https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image#usage_note


### 3. 変換後のサイズを計算

今回は幅 (`width`) のみを指定する方法にしているので、比率を保ちつつリサイズできる高さを計算して出します。

```typescript
const afterWidth: number = width
const afterHeight: number = Math.floor(beforeHeight * (afterWidth / beforeWidth))
```


### 4. Canvas にリサイズ後のサイズで画像を描画

まず Canvas のサイズをリサイズ後の大きさにします。

```typescript
context.canvas.width = afterWidth
context.canvas.height = afterHeight
```

そして、画像をキャンバス上に描画します。

```typescript
context.drawImage(image, 0, 0, beforeWidth, beforeHeight, 0, 0, afterWidth, afterHeight)
```

引数を9個指定した場合は、以下のような内容になります。

> ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
>
> https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

- 元画像のデータ (`image`)
- 元画像データの描画開始座標 (`sx`, `sy`)
- 元画像のサイズ（`sWidth`, `sHeight`)
- キャンバスへの描画開始座標 (`dx`, `dy`)
- キャンバスへの描画サイズ (`dWidth`, `dHeight`)

という感じになります。
元画像全体を、キャンバスのサイズピッタリに描画するというような意味合いになります。
これが実質リサイズ処理になります。


### 5. Canvas の内容を JPEG で出力

最後に Canvas の内容をJPEGとして出力します。

```typescript
const jpegData = await new Promise((resolve) => {
  context.canvas.toBlob(resolve, `image/jpeg`, 0.9)
})
```

こちらもコールバックしか使えないので、`Promise` でラップするような感じにしています。

ちなみに `image/jpeg` 以外にも `image/png` や `image/webp` なども使えるようです。



## コード例

これらのコードをまとめた関数の実装例を紹介します。
（ママリで実際に使っているコードと全く同じではないので悪しからず）

```typescript
export const resizeImage = async (imageData: Blob, width: number): Promise<Blob | null> => {
  try {
    const context = document.createElement('canvas').getContext('2d')
    if (context == null) {
      return null
    }

    // 画像のサイズを取得
    const image: HTMLImageElement = await new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', reject)
      image.src = URL.createObjectURL(imageData)
    })
    const { naturalHeight: beforeHeight, naturalWidth: beforeWidth } = image

    // 変換後の高さと幅を算出
    const afterWidth: number = width
    const afterHeight: number = Math.floor(beforeHeight * (afterWidth / beforeWidth))

    // Canvas 上に描画
    context.canvas.width = afterWidth
    context.canvas.height = afterHeight
    context.drawImage(image, 0, 0, beforeWidth, beforeHeight, 0, 0, afterWidth, afterHeight)

    // JPEGデータにして返す
    return await new Promise((resolve) => {
      context.canvas.toBlob(resolve, `image/jpeg`, 0.9)
    })
  } catch (err) {
    console.error(err)
    return null
  }
}
```

### サンプルページ

上記のコードを使って、簡単に試せるページを用意してみましたので、興味がある方はお試しください。

https://mryhryki.com/experiment/resize-on-canvas.html

[![preview](https://user-images.githubusercontent.com/12733897/158285134-47c8a6b0-681f-44c1-a357-c5255da399ed.gif)](https://mryhryki.com/file/Wc3F9uV6jDPp6UsWkj7PPSCsSGZYS.gif)

（猫画像はこちらのフリー素材を使用しました）
https://pixabay.com/ja/photos/%e7%8c%ab-%e8%8a%b1-%e5%ad%90%e7%8c%ab-%e7%9f%b3-%e3%83%9a%e3%83%83%e3%83%88-2536662/

## おわりに

ブラウザの機能だけをつかって、シンプルに画像のリサイズ処理を実装することができました。
実は、個人的に [Skitch の代替として使っている Web App](https://image-markup.vercel.app/) を作った経験が生きた感じで、割とすんなりと実装ができました。
なんでも色々やって見るものですね。


## PR

コネヒトではエンジニアを募集しています！

[https://hrmos.co/pages/connehito/jobs/00e:embed:cite]
