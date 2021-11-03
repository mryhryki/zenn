# Lambda のカスタムランタイムを試しただけのメモ

## 関数の作成

![image.png](https://i.gyazo.com/7d689865b612bf95bbcf823ad282a4bf.png)

## サンプルソース

![image.png](https://i.gyazo.com/fe5b3b4d679ca9a13d55c23daa34303d.png)

とりあえず Gist にコピー
https://gist.github.com/mryhryki/8e43c52ddfc13307bbd89788e95f799e

## ソースの変更

- `.sample` を取り除く
- `bootstrap` に実行権限を付与 `chmod +x bootstrap`
- `zip lambda.zip *` で Zip ファイルにまとめる
- Zip ファイルをアップロードして Lambda を更新

## 実行

![image.png](https://i.gyazo.com/946b5cdc1e2409427e6c0856ae6e6d81.png)

## 環境変数の確認

実行時にどうやってAWSリソースへのアクセスをしているのか気になったので調べた。
普通に環境変数にAWSアクセスキーがセットされているっぽい。
セッショントークンが含まれている一時的な認証情報のよう。（当たり前か）

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_SESSION_TOKEN

## 参考

- [チュートリアル – カスタムランタイムの公開 - AWS Lambda](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/runtimes-walkthrough.html)
- [AWS Lambda の新機能でサーバーレス・シェルスクリプト！ カスタムランタイムのチュートリアルを動かしてみた #reinvent | DevelopersIO](https://dev.classmethod.jp/articles/tutorial-lambda-custom-runtime-with-shellscript/)