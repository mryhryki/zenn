# CloudFront Functions

CDNのエッジサーバーでコードを実行できるようになったらしい。
Lambda@Edge に比べてよりユーザーに近いところで実行できるので、より高速に実行ができるよう。

ただし、制限が厳しく、特に実行時間1ms未満ところをみるにリクエストの一部を書き換えたりするとかぐらいにしか使えなさそう。

- パスの書き換えとかを高速に行いたいときは `CloudFront Functions`
- 比較的重めの処理を行いたい場合は `Lambda@Edge`

という感じの使い分けをしていく感じになるのかな。

## 参考

- [Amazon CloudFront announces CloudFront Functions, a lightweight edge compute capability](https://aws.amazon.com/jp/about-aws/whats-new/2021/05/cloudfront-functions/)
- [エッジで爆速コード実行！CloudFront Functionsがリリースされました！ | DevelopersIO](https://dev.classmethod.jp/articles/amazon-cloudfront-functions-release/)
- [CloudFront Functions を使ってみた](https://zenn.dev/yh1224/articles/xq2kvl7vv1ygl8c4z)
- [AWS、エッジにおけるJavaScript実行環境に本格参入。Cloudflare WorkersやDeno Deployなどと競合へ － Publickey](https://www.publickey1.jp/blog/21/awsjavascriptcloudflare_workersdeno_deploy.html)

---

2021-05-14 追記

> すべてのリクエストで実行できる軽量の CloudFront CDN カスタマイズに最適で、HTTP ヘッダー操作、URL の書き換え/リダイレクト、キャッシュキーの正規化などの大規模でレイテンシーに敏感な操作を可能にします。

やはりその辺の軽い処理で使う想定っぽいな。

[Amazon CloudFront が軽量エッジコンピューティング機能である CloudFront Functions を発表](https://aws.amazon.com/jp/about-aws/whats-new/2021/05/cloudfront-functions/)