---
title: AWS CodeBuild を使った検証環境へのデプロイ改善
created_at: 2020-07-30T10:00:00+09:00
canonical: https://tech.connehito.com/entry/2020/07/30/173600
---

こんにちは！ フロントエンドエンジニアの[もりや](https://mryhryki.com/)です。

コロナの影響でコネヒトも３月からフルリモート体制が始まり、早４ヶ月が過ぎました。
流行に乗り遅れがちな私は、今になって自宅のリモートワーク環境を整えようと動き始めています。
まずは[ローテーブル](https://www.muji.com/jp/ja/store/cmdty/detail/4550002460785)を卒業しよう・・・。

さて、今回はそんなフルリモート下で発生した課題の１つを [CodeBuild](https://aws.amazon.com/jp/codebuild/) を使って解決したので紹介させていただきます。



## コネヒトにおける検証環境のデプロイ方法について

コネヒトでは、本番リリース前のチェックや開発時にAWS環境で動作確認に使う検証環境を用意しています。

この検証環境にデプロイするには以下の２つの方法がありました。

1. `master` ブランチにPRをマージする（本番リリース前に動作確認するため）
2. 開発PCから直接デプロイする（開発時に検証環境で動作確認したい時など）

`2.` の方法をコネヒトでは「ローカルデプロイ」と呼んでいます。
このローカルデプロイを今回 `CodeBuild` を使って改善しました。



## ローカルデプロイの問題点

主に以下の２つが問題点としてあげていました。

1. ローカル環境に依存しているので `Docker` のバージョンなど、差異が出てしまう場合がある
2. リモートワークの際に、各家庭のネット回線によって Docker プッシュに時間がかかる場合がある

特にコロナでフルリモート環境になって `2.` が深刻な問題となりました。
自宅の通信速度が遅い場合、開発業務に影響が出るレベルの方もいました。

![image.png](https://i.gyazo.com/ae00d214185414f8638114b455ea5dce.png)

Docker プッシュ中に Zoom のミーティングの時間が来たので泣く泣く中断して、ミーティング後に再実行・・・、なんて最悪ですね。

これらの問題を改善するために、`CodeBuild` を使って検証環境へのデプロイを安定して行えるようにしました。



## CodeBuild の選定理由

以下のような理由で `CodeBuild` を選びました。

1. ママリはAWSで動いているので、`CodeBuild` との親和性も高い
2. CLI/SDK などを使ってAPIですべての操作が可能（`CodeBuild` に限らずAWS全体に言える話ですが）
3. コネヒトの一部のプロジェクトで使用実績があった
4. 比較的安い従量課金で、並列度に制限がない

ちなみに無料枠で月100分（`build.general1.small` のみ）はずっと無料で使えるので、試しに使ってみても良いかもしれません。



## 名前をつける

もともと「ローカルデプロイ」という名前でしたが、`CodeBuild` を使った場合は違和感のある名前なので、まずは名前をつけることにしました。

Slack で名前を募集したところ、たくさんの案が出てきました。
ありがたや～。

![slack.png](https://i.gyazo.com/c5fdd21ab1285b8b79dbabfdd1749c63.png)

色々案が出ましたが、最終的に「ブランチデプロイ」に決まりました。
主に開発時に使い、開発時はブランチを作りそこからデプロイするので、イメージに近くて分かりやすい名前ということで決めました。



## ブランチデプロイの仕組み

コネヒトのサービスは主に [ECS](https://aws.amazon.com/jp/ecs/) で動いており、 Docker イメージは [ECR](https://aws.amazon.com/jp/ecr/) に保存しています。
このような流れで動いています。

![f:id:hyirm:20200729171800p:plain](https://cdn-ak.f.st-hatena.com/images/fotolife/h/hyirm/20200729/20200729171800.png)


## CodeBuild 用の設定ファイルを作成

まず `CodeBuild` が実行時に参照する YAML の設定ファイルを作成して、リポジトリ内にコミットします。
こんな感じの YAML ファイルを用意しました。

```yaml
version: 0.2

env:
  variables:
    DOCKER_BUILDKIT: "1" # Ref: https://tech.connehito.com/entry/2019/06/17/180404
  parameter-store:
    GITHUB_ACCESS_TOKEN: "/xxxxxxxxxxxx/GITHUB_ACCESS_TOKEN"

phases:
  build:
    commands:
      - /bin/bash .codebuild/dev_deploy.sh
```

実際のデプロイ処理は `dev_deploy.sh` というスクリプトにまとめて、設定ファイルはシンプルになるようにしています。
`dev_deploy.sh` の中身は省略しますが、主に Docker ビルド＆プッシュと [ecs-deploy](https://github.com/silinternational/ecs-deploy) を使ってECSにデプロイする処理をしています。

ビルド時には [GitHub のトークン](https://docs.github.com/ja/github/authenticating-to-github/creating-a-personal-access-token) が必要なのですが、今回は [パラメータストア](https://aws.amazon.com/jp/systems-manager/features/#Parameter_Store) に設定して、`parameter-store:` でキー名を設定するだけで自動的に環境変数に設定してくれます。
この辺りは同じAWSサービスならではの便利さですね。



## CodeBuild のプロジェクト設定

[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/change-project.html#change-project-console)などを参考にAWSコンソールで設定しました。

特筆すべき設定はありません。
強いて言えば、自動実行はしないのでウェブフックイベントの設定はしないことぐらいでしょうか。
（CIだとプッシュなどのタイミングで自動実行する場合が多いと思いますが、今回はユーザーからのリクエストがあって動く仕組みなので）

![codebuild.png](https://i.gyazo.com/d1581c9fe0e13fa97d191fba5177f7dd.png)




## CodeBuild を起動するシェルスクリプトの作成

AWS CLI を使って簡単にブランチデプロイが実行できるように、以下のようなシェルスクリプトを作成しました。

```sh
#!/usr/bin/env bash
set -e

readonly GIT_ROOT="$(git rev-parse --show-toplevel)"

readonly REPOSITORY_NAME="（リポジトリ名）"
readonly PROJECT_NAME="（CodeBuildのプロジェクト名）"
readonly DEPLOY_TARGET="${1:-"HEAD"}"

readonly DEPLOY_COMMIT_HASH="$(git rev-parse "${DEPLOY_TARGET}")"
readonly DEPLOY_COMMIT_LOG="$(git log "${DEPLOY_COMMIT_HASH}" --max-count=1)"

# GitHub API を使って GitHub にコミットがプッシュ済みかをチェックする
if [[ "${GITHUB_ACCESS_TOKEN}" != "" ]]; then
  HTTP_STATUS_CODE="$(curl -H "Authorization: token ${GITHUB_ACCESS_TOKEN}" -o /dev/null -w '%{http_code}\n' -s \
                     "https://api.github.com/repos/Connehito/${REPOSITORY_NAME}/git/commits/${DEPLOY_COMMIT_HASH}")"
  if [[ "${HTTP_STATUS_CODE}" == "200" ]]; then
    printf "\e[34mINFO: GitHubにコミットが存在することが確認できました。\e[0m\n"
  else
    printf "\e[31mERROR: GitHubにコミットが存在するかをチェックしたところ、ステータスコード(${HTTP_STATUS_CODE})が返却されたためブランチデプロイを中止します。\e[0m\n" >&2
    exit 2
  fi
else
  printf "\e[31mWARNING: 環境変数 'GITHUB_ACCESS_TOKEN' が設定されていないため、GitHubにコミットが存在するかのチェックをスキップします。\e[0m\n"
fi

printf "\nこのコミットでブランチデプロイを実行しますか？\n-----\n%s\n\n-----\n" "${DEPLOY_COMMIT_LOG}"
printf "実行する場合は \e[34m'yes'\e[0m と入力してください: "
read ANSWER

if [[ "${ANSWER}" != "yes" ]]; then
  echo "ブランチデプロイを中止します。"
  exit 1
fi

echo "ブランチデプロイを開始します。"
aws codebuild start-build \
    --project-name "${PROJECT_NAME}" \
    --source-version "${DEPLOY_COMMIT_HASH}" \
    --output json
echo "ブランチデプロイを開始しました。実行結果はログを確認してください。"
```

ざっくりいうと、こんな流れで処理を進めています。

1. 引数からコミットハッシュを取得
  - `git rev-parse` を使ってコミットハッシュを取得しています。
  - ブランチやタグ、省略されたコミットハッシュでも参照できます。
  - `"${1:-"HEAD"}"` で第１引数に指定がない場合は `HEAD` からコミットハッシュを取得します。
2. `GitHub API` を使ってコミットハッシュが `GitHub` に存在しているか確認
  - これで `CodeBuild` 実行後に「コミットをプッシュし忘れた〜」と気づくトラブルを防いでいます。
  - 開発時に必要になるので、コネヒトでサーバー開発に携わるエンジニアは `GITHUB_ACCESS_TOKEN` という環境変数をセットしています。
  - 一応、環境変数が無くてもワーニングだけ出して実行はできるようにしています。
3. ブランチデプロイを実行してよいかユーザーに確認
  - `terraform` に倣って、ユーザーが `yes` を入力しなければ実行されないようにしています。
  - コミットログも表示して、想定していたものに間違いないかを確認できるようにしています。
4. `AWS CLI` を使って `CodeBuild` でのビルド＆デプロイを実行。
  - ちなみに `AWS CLI` は `v1`, `v2` がありますが、どちらのバージョンも同じコマンド体系なのでどちらでも実行できます。（下記参照）

`AWS CLI v1` の場合

```sh
$ aws --version
aws-cli/1.18.90 Python/3.8.4 Darwin/19.5.0 botocore/1.17.13

$ aws codebuild start-build help

NAME
       start-build -

DESCRIPTION
       Starts running a build.

       See also: AWS API Documentation

       See 'aws help' for descriptions of global parameters.

SYNOPSIS
            start-build
          --project-name <value>
          [--secondary-sources-override <value>]
          [--secondary-sources-version-override <value>]
          [--source-version <value>]
# (以下略)
```

`AWS CLI v2` の場合

```sh
$ aws --version
aws-cli/2.0.24 Python/3.7.3 Linux/4.19.76-linuxkit botocore/2.0.0dev28

$ aws codebuild start-build help

NAME
       start-build -

DESCRIPTION
       Starts running a build.

       See also: AWS API Documentation

       See 'aws help' for descriptions of global parameters.

SYNOPSIS
            start-build
          --project-name <value>
          [--secondary-sources-override <value>]
          [--secondary-sources-version-override <value>]
          [--source-version <value>]
# (以下略)
```

少なくとも今回使っている範囲では同じコマンドで実行できることがわかります。

## 動かしてみる

先程作ったシェルスクリプトを実行するとこんな感じになります。
[AWSへの認証情報がセットされた状態](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-precedence) で以下のコマンドを実行します。

```sh
$ ./branch-deploy.sh "(ブランチ名、コミットハッシュなど)"
```

こんな感じで表示されます。

![image.png](https://i.gyazo.com/87abbcd88026a4c29d6487d16080b099.png)

後は `CodeBuild` の実行を待つだけです。

ちなみにコネヒトでは `CodeBuild` を実行すると、自動で Slack 通知が来る共通の仕組みがあるので、通知関連は今回実装しませんでした。

![slack_notification.png](https://i.gyazo.com/9be4d3461a51a222878b66b876852a29.png)

*※ Slack で通知されます （ちなみに社内では検証環境を「dev」とか「dev 環境」と呼んでいます）*

`CloudWatch Events` で `CodeBuild` のイベントを `Lambda` に送って `Slack` に通知しています。

このような感じで実行すれば非同期で動くので、ネット回線やPCの負荷を気にせず検証環境へのデプロイが安定して行えるようになりました。

## おわりに

今回は好きなタイミングで任意のコミットを `CodeBuild` を使ってデプロイする、ということをやりました。
IAM の権限周りで少しハマりましたが、設定は難しくなくサクッとできるので、こういった活用もありだな〜、と思いました。

最後に、コネヒトでは開発環境の改善にもチャレンジしたいエンジニアを募集中です！

[https://www.wantedly.com/projects/447401:embed:cite]
