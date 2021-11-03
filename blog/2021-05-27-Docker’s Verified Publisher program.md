# Docker’s Verified Publisher program

> Docker Hub の公式イメージたちがもうすぐ Amazon ECR Public からもダウンロードできるようになります！

https://twitter.com/toricls/status/1397953753504833537

調べてみたところ "Docker’s Verified Publisher program" という、Docker がイメージのパブリッシャー（配布者）を認証するプログラムがあるみたい。
その中でも AWS と Mirantis は Docker 公式イメージを配布する予定という話っぽい。

[Docker Expands Trusted Content Offerings for Developers | Docker](https://www.docker.com/press-release/docker-expands-trusted-content-offerings)

もともと勝手に配布することは禁止されていたけど、今回 Docker が認証したところは配布してOK、ってイメージなのかな。

> メモ
> 
> Docker 公式イメージは Docker の知的財産です。 事前の許諾なしに Docker 公式イメージを配布することは、Docker 利用規約 に違反する可能性があります。

[Docker Hub 上の公式イメージ | Docker ドキュメント](https://matsuand.github.io/docs.docker.jp.onthefly/docker-hub/official_images/)

AWS だと匿名でも500GB/月を無料で転送できるから、現状の DockerHub よりもかなり制限が緩和されて良さそう。

> AWS 無料利用枠の一部として、Amazon ECR の新規のお客様は、プライベートリポジトリ用に 1 年間 500 MB のストレージをご利用いただけます。
>
> 新規または既存のお客様は、Amazon ECR は、パブリックリポジトリ用に 50 GB の月間無料ストレージをご利用いただけます。
>
> 毎月 500 GB のデータをパブリックリポジトリから匿名で (AWS アカウントを使用せずに) インターネットに無料で転送できます。
>
> AWS アカウントにサインアップするか、既存の AWS アカウントで ECR に認証すると、毎月 5 TB のデータをパブリックリポジトリから無料でインターネットに転送できます。
>
> また、パブリックリポジトリから任意の AWS リージョンの AWS コンピューティングリソースへデータを転送すると、無制限の帯域幅を無料でご利用いただけます。

[料金 - Amazon ECR | AWS](https://aws.amazon.com/jp/ecr/pricing/)