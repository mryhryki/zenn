# ブラウザの機能だけでシンプルなメモアプリを作ってみた。

## TL;DR

* 自分に欲しいだけ機能を備えたシンプルなメモアプリを作りたくなった
* インストールとかしたくないので、Webアプリとして作った
* サーバーとかに保存すると管理が面倒なので、ブラウザの機能だけで作った
* 完成したのが[こちら](https://hyiromori.com/memo/)
* ソースコードは[こちら](https://github.com/hyiromori/memo)

## 使った技術

* ビルド関連
    * `Webpack`
    * `TypeScript`
    * `React`
* [WebStorage](https://developer.mozilla.org/ja/docs/Web/API/Web_Storage_API)
    * [LocalStorage](https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage)
    * [IndexedDB](https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API)
* その他
    * [QRコードライブラリ](https://www.npmjs.com/package/qrcode)

## どんなアプリを目指したのか？

* 軽量で早く動く
* メモをサッと編集して、自動保存したり履歴で元に戻せる（長文を編集するようなものではない）
*

## TODO

* Windows対応
    * たぶん改行コードがCRLFなので、改行すると２文字としてカウントされそう
    * Windows端末持ってないから検証できないけど


