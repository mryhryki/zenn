---
title: FireFox Tips
---

## はじめに

FireFox を使ったりして見ているけど、ちょいちょい面倒な部分があったりするので、それを解消する Tips をまとめています。


## Tabキーでリンクも移動できるようにする。

ページ内のリンクもTabで移動したい。
（テキスト入力とかは普通にできるけど、リンクはできなかった）

ここのチェックボックスにチェックを入れればできた。

![image.png](https://i.gyazo.com/065336cc177a1b1e776e653f59a10b18.png)



## Basic認証の確認を出さない方法

開発の効率が下がるので。

![image.png](https://i.gyazo.com/b25009498c4faa065eec5e3e94e67a36.png)

`network.http.phishy-userpass-length` に `255` を設定する。

![capture.png](https://i.gyazo.com/12bb670721d07519d381c045a21e2377.png)

Link: https://stackoverflow.com/questions/2848287/using-in-url-basic-authentication-in-firefox
