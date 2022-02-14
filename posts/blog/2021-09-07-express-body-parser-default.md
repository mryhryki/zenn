---
title: Express の body-parser のデフォルト値
created_at: 2021-09-07T10:00:00+09:00
---


[Express](https://expressjs.com/) のAPIに大き目のJSONを渡そうとしたら [413 Payload Too Large](https://developer.mozilla.org/ja/docs/Web/HTTP/Status/413) が返ってきたので調べたら、[body-parser](https://www.npmjs.com/package/body-parser) の制限でデフォルト `100KB` になっているためだった。（JSON 以外も `100KB` がデフォルトっぽい）

https://www.npmjs.com/package/body-parser#limit


## 補足

AWS で以下の構成で作っているので、各AWSサービスのどこかの制限に引っかかったのかな、と最初は思って調べていたが、CloudWatch Logs を見るとJSで起きたエラーっぽかったので気づいた。
最初にちゃんとエラーログが出ているかも確認するの大事。

1. [Amazon CloudFront](https://aws.amazon.com/jp/cloudfront/)
2. [Amazon API Gateway](https://aws.amazon.com/jp/apigateway/) ([HTTP API](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/http-api.html))
3. [AWS Lambda](https://aws.amazon.com/jp/lambda/)
4. (Lambda 内で) [@vendia/serverless-express](https://www.npmjs.com/package/@vendia/serverless-express)
5. (Lambda 内で) [Express](https://expressjs.com/)
