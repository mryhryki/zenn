# HTTP ステータスコード

> "HTTP を使うアプリケーションは、最も適用可能なステータスコードを使うようにエラーを定義すべきで、 疑わしい場合は一般的なステータスコード (200, 400, 500) を惜しみなく使うべきです" https://httpwg.org/http-extensions/draft-ietf-httpbis-bcp56bis.html#section-4.6 わかるわ ........

https://twitter.com/voluntas/status/1356215499965616129

わかるわ....
迷うからステータスコードは200に統一する、とか結構やりにくい。
個人的な経験だと、GraphQL はエンドポイントもステータスコードも固定されているから、DevTools でエラーになっているリクエストが一つ一つ見ないとわからん。

原文はこちら。

> Instead, applications using HTTP should define their errors to use the most applicable status code, making generous use of the general status codes (200, 400 and 500) when in doubt. Importantly, they should not specify a one-to-one relationship between status codes and application errors, thereby avoiding the exhaustion issue outlined above.

https://httpwg.org/http-extensions/draft-ietf-httpbis-bcp56bis.html#section-4.6-4
