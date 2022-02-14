# First-Party Sets


## First-Party Sets とは

Cross Origin であっても、First Party として扱うための方法のよう。
2021年9月時点で、まだ提案されている機能なので、Web標準とかではないです。

例えば `https://example.com/.well-known/first-party-set` のようなパスに、First Party として扱いたいドメイン全部にJSONファイルを配置配置する。
ブラウザはその情報を見て、Cross Origin であっても First Party と判断するらしい。


## Google の解説記事

英語です。

[First-Party Sets and the SameParty attribute - Chrome Developers](https://developer.chrome.com/blog/first-party-sets-sameparty/)


## Mozilla

Mozilla は harmful (有害) との立場を示しているようです。

https://mozilla.github.io/standards-positions/#first-party-sets
![capture.png](https://i.gyazo.com/65525071f77538ecfa964153b430df81.png)


## 感想

便利な面は確かにあるとは思うけど、セキュリティや仕様の複雑さを考えると、私は反対の立場です。
ドメイン的には Cross Origin だけど、実は First Party 扱いだったなんていうのはすごい厄介になりそう。
それに、知らないと全然わからない挙動になりそうなので、そういう意味でも避けたい。

Cross Origin といえば [CORS (Cross Origin Resource Sharing)](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS) だけど、更に前提として考えないといけないことが増えるのか・・・、と思うと辛いなぁ。


## 関連

- W3C内の議論: [privacycg/first-party-sets](https://github.com/privacycg/first-party-sets)
    - [Proposed Work Item: First-Party Sets · Issue #17 · privacycg/proposals](https://github.com/privacycg/proposals/issues/17) から privacycg/first-party-sets に引き継がれた。
    - すごい長い議論になってます。
- [First-Party Setsについて](https://zenn.dev/tayusa/articles/efa8aa75ad5519)
- [First-Party Setsでドメインを超えてCookieを共有する - Qiita](https://qiita.com/rana_kualu/items/13a77f76257767a23643)
