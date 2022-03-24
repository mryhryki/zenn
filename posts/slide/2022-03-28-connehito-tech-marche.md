# コネヒト技術目標マルシェ


### もりやひろゆき

2022-03-28

---

## はじめに 

みなさんスクショに矢印とか入れたい時は何を使っていますか？

---

## Skitch

使いやすいけど、エクスポートがめんどい。<br>
（と思ってたけど、今はショートカットキーでコピーができるようになっているかも？）

<img alt="screenshot" src="https://mryhryki.com/file/Wc3JN9tu7pgb5mm47iIenif-YTw8N.jpeg" width="400">

https://evernote.com/intl/jp/products/skitch

---

## Preview (macOS標準)

<img alt="screenshot" src="https://mryhryki.com/file/Wc3JNF9vrzc2Ez2xtAH8sTD636_Zk.png" width="400">

始めるまでのステップが面倒

---

# じゃあ自分でつくろう！

---

# 作りました！


- URL: https://image-markup.vercel.app/
- GitHub: https://github.com/mryhryki/image-markup

---

# Point1: 何を使っているか

[Canvas](https://developer.mozilla.org/ja/docs/Web/HTML/Element/canvas) を使いました。

テックブログにもチラッと書いてます。<br>
https://tech.connehito.com/entry/2022/03/18/093812

---

# Point2: 矢印の描画はどうやっているか

Sin,Cos を使って書いています。<br>
（生まれて初めて役に立った）

https://github.com/mryhryki/image-markup/blob/6e7a4265d2ff7dddaf0854d2559f4f0a646d339d/src/drawer/arrow.ts#L11-L30

---

# おわり

自分が欲しいものを作るのも楽しいね

---

# おまけ

ブラウザでGIF動画に変換できるツールも作ってます。

https://video-to-gif.vercel.app/
