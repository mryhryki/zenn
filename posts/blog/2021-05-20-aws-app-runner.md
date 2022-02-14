# AWS App Runner

> App Runner は Docker コンテナイメージまたはソースコード(Python、Node.js)から AWS にウェブアプリケーションをデプロイするためのサービスです。非常に強力に抽象化されており、開発者はインフラストラクチャーのことをほぼ意識せず Auto Scaling 可能なアーキテクチャをデプロイする事ができます。Cloud Run、Google App Engine、Heroku あたりと競合しそうなサービスです。

[App Runnerの登場とAmplify ConsoleのSSR対応でVPCレスなAWSアーキテクチャを夢見た話](https://zenn.dev/intercept6/articles/4016e9d61ab36761685d)

ほう、気になる。


## 公式ブログ

[AWS App Runner のご紹介 | Amazon Web Services ブログ](https://aws.amazon.com/jp/blogs/news/introducing-aws-app-runner/)

すごい良さそう！


## Classmethod 

[新サービスAWS App Runnerがローンチされたので試してみた | DevelopersIO](https://dev.classmethod.jp/articles/release-aws-app-runner/)

既にやってみたブログもあった。


## 料金

[AWS App Runner Pricing – Fully managed container application service – Amazon Web Services](https://aws.amazon.com/jp/apprunner/pricing/)

従量課金体系。
最小コストがこれぐらいか。
自分用のアプリでは使わない気がするけど、運用コストやロードバランシングとかコミコミでこの値段だとすごい良いと思う。

![capture.png](https://i.gyazo.com/6cf7918de931b1bf0d2c2c3208f40721.png)