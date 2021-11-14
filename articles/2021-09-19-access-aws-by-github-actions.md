---
title: "GitHub Actions のIDトークンを使ってAWSリソースにアクセスする"
emoji: "✨"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["AWS","GitHubActions"]
published: true
---

:::message alert
この記事は GitHub から公式にアナウンスされていない機能を使っています。
今後変更されたり使えなくなるなどの可能性がありますのでご注意ください。
:::

# 追記（2021-11-01）

正式にリリースされたようです！🎉🎉🎉

https://www.publickey1.jp/blog/21/github_actionsopenid_connectgithub.html

# 追記（2021-10-13）

Issuer が `https://vstoken.actions.githubusercontent.com` から `https://token.actions.githubusercontent.com` に変更になったようです。

https://twitter.com/toricls/status/1445990439060836355

まだ GitHub から何もアナウンスがされていない機能なのでしょうがないですね。
逆に言えば、リリースに向けて動いているからなのかもしれないですね。


# はじめに

このツイートを見て、どういう風に認証を通しているのかが気になったので、実際に試してみた結果のメモをまとめた記事になります。

https://twitter.com/toricls/status/1438120050167189510

何をやっているのか理解したいので、そのまま試すのではなく、1つずつ順番に紐解いてやっています。
なお、調査の過程はこちらのスクラップに書いています。

https://zenn.dev/mryhryki/scraps/81d85c8e28af88


# 調査した内容の概要

1. GitHub Actions の環境変数の情報からIDトークンを取得する
1. IDトークンからAWSの一時的な認証情報を取得できる設定をする
1. 一時的な認証情報を取得しAWSリソースにアクセスする


# GitHub Actions の環境変数の情報からIDトークンを取得する

まずは GitHub Actions 上でIDトークンを取得する方法を順番に試しました。


## テスト用のワークフローファイル（YAML）

GitHub Actions 上にある環境変数を表示するために、以下の最小限のワークフローファイルを作成しました。

```yaml
name: "test_github_oidc"

on:
  push:
    branches:
      - "test-github-oidc"

jobs:
  test_github_oidc:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - name: Show env
        run: env | grep 'ACTIONS_ID_TOKEN'
```

ポイントは `permissions.id-token: write` の部分です。
これを指定することでIDトークンの取得に必要な情報を環境変数に設定してもらえます。

この `id-token` という項目は、現時点では公式ドキュメントに書かれていません。
これが公式にアナウンスされれば実用的に使えるようになる、というのが現状かと思います。

https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#permissions

![image.png](https://i.gyazo.com/7d5edab01fed6b298185cae9354bf09e.png)


## GitHub Actions での実行結果

実行すると以下の２つの環境変数が出力されます。

- `ACTIONS_ID_TOKEN_REQUEST_TOKEN`: IDトークンを取得するためのトークン
- `ACTIONS_ID_TOKEN_REQUEST_URL`: IDトークンを取得するためのリクエストURL

![image.png](https://i.gyazo.com/f1d4517a2d5c17ffa4991f77ae5a6e5d.png)

２段構えになっているのは、全部の実行でIDトークンが必要になるわけではないので、無駄に発行しないためとかかなと想像しています。
（私は当初IDトークンそのものが環境変数に入っていると思っていたので、ちょっとハマりました）


## IDトークンの取得

GitHub Actions 内で以下のように `curl` コマンドを実行するとIDトークンが取得できます。

```bash
$ curl --silent -H "Authorization: bearer ${ACTIONS_ID_TOKEN_REQUEST_TOKEN}" "${ACTIONS_ID_TOKEN_REQUEST_URL}"
{
  "count": 1390,
  "value": "eyJ0e...AB3w"
}
```

`value` がIDトークンになります。（値はマスクしています）



# IDトークンからAWSの一時的な認証情報を取得できる設定をする

IDトークンさえ取得できてしまえば、既存のAWSの機能を使ってAWSの一時的な認証情報を取得できます。
具体的な作業としては OpenID Connect のプロバイダを設定し、IAMロールを作成します。

AWSコンソールで設定したので、キャプチャをベースで簡単に説明します。


## 1. 新しいプロバイダの設定

![image.png](https://i.gyazo.com/ada1d05087b27a3c207cdd1d412ca7b4.png)

- プロバイダの URL: ~~`https://vstoken.actions.githubusercontent.com`~~
  - `https://token.actions.githubusercontent.com` に変わりました（2021-10-13 追記）
- 対象者: `https://github.com/(OWNER)/(REPO_NAME)`

![image.png](https://i.gyazo.com/c8f2aadff329b7175914731ae8ecf51e.png)

これは「GitHub から対象のリポジトリに向けたIDトークンを信頼する」といった意味合いになります。
他のリポジトリ向けに発行されたIDトークンでは使うことができないので安心ですね。


## 2. ロールの作成

プロバイダの情報が選べるようになっているので、以下のように選択します。

![image.png](https://i.gyazo.com/6980dd03e5ade877d8f5d0e4de4d15f4.png)


## 3. 権限の設定

それぞれの要件に応じた最小限の権限を設定します。
今回は list-bucket でもやってみようかと思うので AmazonS3ReadOnlyAccess を選択してみました。

![image.png](https://i.gyazo.com/2ab5b6cdaf57f205cffa75d0d26b0459.png)


## 4. 作成

![image.png](https://i.gyazo.com/9590e57c8829908c63b553dd93aa47d0.png)


## 補足

[こちらの記事](https://awsteele.com/blog/2021/09/15/aws-federation-comes-to-github-actions.html)の CloudFormation の定義の以下の部分に当たる作業です。

![capture.png](https://i.gyazo.com/5b40af2ef2359ef26bff910c74811afd.png)

これで、GitHub から発行されたIDトークンを使って、AWSにアクセスするための設定ができました。


# 一時的な認証情報を取得しAWSリソースにアクセスする

あとは実際にアクセスする処理を書いていきます。

## 一時的な認証情報を取得する方法

調べてみたところ `AssumeRoleWithWebIdentity` というAPIでIDトークンからAWSの一時的な認証情報を取得できるようです。

https://docs.aws.amazon.com/ja_jp/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html

AWS CLI のヘルプはこちらです。

https://docs.aws.amazon.com/cli/latest/reference/sts/assume-role-with-web-identity.html

あるいは CLI のヘルプでも見られます。

```bash
$ aws sts assume-role-with-web-identity help
```

（ちなみに STS のヘルプを見ている時に見つけました）

```bash
$ aws sts help
```

## AWS CLI でAWSの一時的な認証情報を取得する

CLI を使って取得する場合は以下のようなコマンドで取得できます。
(※一部マスクしてます)

```bash
$ aws sts assume-role-with-web-identity \
  --role-arn 'arn:aws:iam::000000000000:role/GitHub_OIDC_test' \
  --role-session-name 'SESSION_NAME' \
  --web-identity-token 'eyJ0...ds5BA'

{
  "Credentials": {
    "AccessKeyId": "AS...FP",
    "SecretAccessKey": "Td...xD",
    "SessionToken": "IQ...PA",
    "Expiration": "2021-09-18T03:03:56Z"
  },
  "SubjectFromWebIdentityToken": "repo:mryhryki/*****:ref:refs/heads/test-github-oidc",
  "AssumedRoleUser": {
    "AssumedRoleId": "ARXXXXXXXXXXXXXXXXXTS:SESSION_NAME",
    "Arn": "arn:aws:sts::000000000000:assumed-role/GitHub_OIDC_test/SESSION_NAME"
  },
  "Provider": "arn:aws:iam::000000000000:oidc-provider/vstoken.actions.githubusercontent.com",
  "Audience": "https://github.com/mryhryki/*****"
}
```

- `--role-arn` は先程作ったIAMロールのARNを指定します。
- `--web-identity-token` はIDトークンを指定します。
- `--role-session-name` はセッションを識別できる情報を入れます。（分かれば何でも良さそう）


## GitHub Actions 上で実行する

最終的にこのようなワークフローを作って実行してみました。
（ほとんどシェルスクリプト・・・）

```yaml
name: "test_github_oidc"

on:
  push:
    branches:
      - "test-github-oidc"

jobs:
  test_github_oidc:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - run: |
          export AWS_DEFAULT_REGION="ap-northeast-1"
          ID_TOKEN="$(curl --silent -H "Authorization: bearer ${ACTIONS_ID_TOKEN_REQUEST_TOKEN}" "${ACTIONS_ID_TOKEN_REQUEST_URL}" | jq -r '.value')"
          ACCESS_KEY_JSON="$(aws sts assume-role-with-web-identity --role-arn "arn:aws:iam::000000000000:role/GitHub_OIDC_test" --role-session-name "${GITHUB_RUN_ID}" --web-identity-token "${ID_TOKEN}" --output json)"
          export AWS_ACCESS_KEY_ID="$(echo "${ACCESS_KEY_JSON}" | jq -r '.Credentials.AccessKeyId')"
          export AWS_SECRET_ACCESS_KEY="$(echo "${ACCESS_KEY_JSON}" | jq -r '.Credentials.SecretAccessKey')"
          export AWS_SESSION_TOKEN="$(echo "${ACCESS_KEY_JSON}" | jq -r '.Credentials.SessionToken')"
          aws s3 ls
```

実行すると、無事S3バケットの一覧が取得できました！🎉

![image.png](https://i.gyazo.com/b7be8f83ef8cb90c42ef27f004a3dec9.png)

### 補足

[こちらの記事](https://awsteele.com/blog/2021/09/15/aws-federation-comes-to-github-actions.html)では `$AWS_WEB_IDENTITY_TOKEN_FILE` のパスにIDトークンを入れているので何やってるんだろうと思ったんですが、IDトークンを入れたファイルのパスを `$AWS_WEB_IDENTITY_TOKEN_FILE` （と `AWS_ROLE_ARN`）に指定しておくと自動的に取得してくれる仕組みがCLIあるんですね。
全然知らなかった・・・。

> It works because the AWS SDKs (and AWS CLI) support using the AWS_WEB_IDENTITY_TOKEN_FILE and AWS_ROLE_ARN environment variables since AWS EKS needed this.

EKSもこの機能を使っているのかぁ。

ドキュメントも見つけました。

https://docs.aws.amazon.com/cli/latest/topic/config-vars.html#assume-role-with-web-identity

![image.png](https://i.gyazo.com/16264a5807209298ec51327915be231b.png)


## まとめ

GitHub Actions からセキュアにAWSにアクセスできる、本当に嬉しい機能で、早く公式にアナウンスされないかな〜、という気持ちになりました。
GitHub が発行したIDトークンで、AWSの一時的な認証情報を取得できるというシンプルさも好印象です。


# 参考リンク

- [AWS federation comes to GitHub Actions | Aidan Steele’s blog (usually about AWS)](https://awsteele.com/blog/2021/09/15/aws-federation-comes-to-github-actions.html)
  - 最初に見つけた方の記事のようです。（[Tweet](https://twitter.com/__steele/status/1437984026145427461)）
- [GitHub ActionsでAWSの永続的なクレデンシャルを渡すことなくIAM Roleが利用できるようになったようです | DevelopersIO](https://dev.classmethod.jp/articles/github-actions-without-permanent-credential/)
- [takanabe/github-actions-oidc-test](https://github.com/takanabe/github-actions-oidc-test)
  - [Tweet](https://twitter.com/takanabe_w/status/1438489617892732928?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1438804367134494720%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fzenn.dev%2F)
- [GitHub ActionsのOIDC id tokenでGCPにアクセスしてみた - ryotarai's blog](https://ryotarai.hatenablog.com/entry/github-acitons-id-token-gcp)
  - AWS 専用とかではないので、同様なことは GCP でもできるようですね。（GCP はほとんど知らないので詳しくはわかりません）
