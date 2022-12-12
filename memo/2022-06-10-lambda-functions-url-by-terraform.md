---
title: Terraform で Lambda Function URLs をデプロイする
---

## はじめに

Lambda Function URLs を Terraform でデプロイした時にちょっとハマってしまったので、ブログに書き残しておきます。

Lambda Function URLs については、以下のリンクを参照いただければだいたい分かると思います。

- [Lambda 関数 URL - AWS Lambda](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-urls.html)
- [[新機能] AWS Lambda Function URLで簡単にLambda関数を実行する - NRIネットコムBlog](https://tech.nri-net.com/entry/lambda_url)
- [Lambda 関数に個別の URL を設定できる AWS Lambda Function URLs を試す - michimani.net](https://michimani.net/post/aws-ger-started-lambda-functions-urls/)
- [新機能AWS Lambda Function URLsをServerlessFrameworkで対応😎メリットデメリットも語ります🚀 | Ragate ブログ](https://www.ragate.co.jp/blog/articles/12061)

## Lambda デプロイの Terraform コードの全体像

関数名を `app` とし、Node.js 16.x 環境で、Zip ファイルで関数コードをデプロイする場合のコード例です。

ちなみに今までは Docker イメージで使ってみていたのですが、M1 Mac (Arm64) と Intel (x86_64) で開発環境とCI環境の整合を取ろうとすると色々面倒になってきたので、Zip に戻しました。

```
resource "aws_lambda_function" "app" {
  architectures = ["arm64"]
  filename      = "./files/lambda/lambda.zip"
  function_name = "app"
  handler       = "index.handler"
  memory_size   = 320
  package_type  = "Zip"
  role          = aws_iam_role.app_lambda.arn
  runtime       = "nodejs16.x"
  timeout       = 60
}

resource "aws_lambda_permission" "app-with-event-bridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.app.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.scheduled_job.arn
}

resource "aws_lambda_function_url" "app" {
  function_name      = aws_lambda_function.app.function_name
  authorization_type = "NONE"
}

resource "aws_lambda_permission" "app-with-function-url" {
  statement_id           = "FunctionURLAllowPublicAccess"
  function_url_auth_type = "NONE"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.app.function_name
  principal              = "*"
}

resource "aws_iam_role_policy_attachment" "app_lambda" {
  role       = aws_iam_role.app_lambda.name
  policy_arn = aws_iam_policy.app_lambda.arn
}

resource "aws_iam_role" "app_lambda" {
  name = "app-lambda"
  assume_role_policy = jsonencode({
    "Version" = "2012-10-17",
    "Statement" = [
      {
        "Effect" = "Allow",
        "Action" = [
          "sts:AssumeRole",
        ],
        "Principal" = {
          "Service" = "lambda.amazonaws.com"
        }
        Sid = ""
      }
    ]
  })
}

resource "aws_iam_policy" "app_lambda" {
  name = "app-lambda"
  path = "/"
  policy = jsonencode({
    // (略)
  })
}

```

ポイントは `aws_lambda_function_url` と (Lambda Function URLs に関する) `aws_lambda_permission` の追加です。
この追加で AWS Lambda で Lambda Function URLs を使えるようになります。

## ハマったところ

`aws_lambda_permission` が必要で、かつ `function_url_auth_type = "NONE"` を指定しないといけない、というところでした。
ちゃんと読んでいないのも良くないんですが、Terraform のドキュメントにサンプルにはなく、以下の記述しかないのでわかりにくいんですよね。

> `function_url_auth_type` - (Optional) Lambda Function URLs [authentication type](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html). Valid values are: `AWS_IAM` or `NONE`.
> https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission#function_url_auth_type

`function_url_auth_type = "NONE"` なしで `aws_lambda_permission` を作成しようとすると以下のようにエラーが出てしまいます。

```
│ Error: adding Lambda Permission (app/FunctionURLAllowPublicAccess): InvalidParameterValueException: This policy could enable public access to your lambda function as it allows all Principals (*) to perform lambda:InvokeFunctionUrl action. You must specify lambda:FunctionUrlAuthType condition if intend to enable public access
│ {
│   RespMetadata: {
│     StatusCode: 400,
│     RequestID: "1e24b532-ebae-472c-a03a-d2d53b6b56fa"
│   },
│   Message_: "This policy could enable public access to your lambda function as it allows all Principals (*) to perform lambda:InvokeFunctionUrl action. You must specify lambda:FunctionUrlAuthType condition if intend to enable public access",
│   Type: "User"
│ }
```

`Condition` を指定しろ、というのはわかるんですが [aws_lambda_permission](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) を見ても `condition` についての記述がないんですよね・・・。

エラーメッセージを見てわからないならエラーメッセージで検索だ！、と思って検索してみると、ドンピシャの GitHub Issue がありました。
特に [このコメント](https://github.com/hashicorp/terraform-provider-aws/issues/24325#issuecomment-1111665172) と全く同じ状況でした。

で、その下にはこう書かれていました。

> The provider will add a default "FunctionURLAllowPublicAccess" resource policy when a function url is created with auth type "NONE". It should work for your use case.
> https://github.com/hashicorp/terraform-provider-aws/issues/24325

なるほど、`function_url_auth_type = "NONE"` を指定すると、自動でパーミッションが作られるのか・・・。
Terraform にしては、自動でパーミッション作られるというのは珍しいですね。初めてみたかも。

こういう自動で実行される系は、なかなか気づきにくいですし、AWS からのエラーの対応もしづらいので、考えものですね。
とはいえ、一旦これで解決できました。

### 補足: AWSコンソールで設定すると自動で作られる

AWS コンソールで Lambda Function URLs を設定すると、自動でパーミッションも設定されます。
Lambda Function URLs が登場したときは AWS コンソールで設定し、`aws_lambda_permission` を `terraform import` していなかったので今回のエラーになったようです。

![Capture of AWS Console](https://mryhryki.com/file/VA5BBR7ydjo0hild_5CaVceoXDKHQiOvUcqv0TSkBKwUIRtG.png)

今回 Docker から Zip に戻した時に作り直したので、ここでハマってしまったようです。

## おわりに

なかなか Lambda を Terraform でデプロイすることは少ないかもしれませんが、同じようにハマった方（未来の自分も含めて）の助けになれば幸いです。
ちなみに、私も以前は [Serverless Framework](https://www.serverless.com/) を使っていましたが、AWS の理解を深めるために Terraform を使って全部のリソースを作るようにしています。
