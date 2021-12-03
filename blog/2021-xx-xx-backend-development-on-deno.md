# Deno を使って手軽に HTTP サーバーをインターネットへ公開する

## はじめに

開発している時に HTTP サーバーを https でインターネットに公開したい、そんなことがあります。
例えば　[App Store Server Notifications](https://developer.apple.com/documentation/appstoreservernotifications)　を開発する際は、以下のような開発用サーバーを用意しました。

- インターネットに公開してリクエスト受け付ける
- ペイロードの中身を全部ログに出して中身を見る
- レスポンスを 200 にしたり 500 にしたりして挙動を確認する

その時は　[express](https://expressjs.com/)　を使った適当なプロジェクトを作って、[ngrok](https://ngrok.com/) を使ってインターネットに公開してテストしました。
しかし、この方法だとローカルPCを立ちっぱなしで上げておかねばならず、サーバーを落とさないように色々気を使わないといけないので、ちょっと面倒です。

そこで、今回は Deno を使って手軽に HTTP サーバーをインターネットへ公開する方法を試してみたいと思います

## Deno を使って HTTP サーバーを作る

## Deno Deploy で公開

## おまけ1： Docker

## おまけ2: AWS App Runner

## 参考

- [DenoのハイパフォーマンスなWebフレームワーク - astamuse Lab](https://lab.astamuse.co.jp/entry/deno-x-request-per-second)
