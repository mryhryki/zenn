---
title: "個人でやっている AWS IAM の運用"
emoji: "🚚"
type: "tech"
topics:
  - "AWS"
  - "IAM"
published: true
canonical: "https://zenn.dev/mryhryki/articles/2020-09-24-hatena-aws-iam"
---

※この記事は[Qiita](https://qiita.com/mryhryki/items/668c3fbe1312b8909264)、[はてなブログ](https://hyiromori.hateblo.jp/entry/2020/09/24/083751)、[別アカウント(hyiromori)](https://zenn.dev/hyiromori/articles/hatena-20200924-083751)から引っ越しました

## はじめに

私は個人開発でAWSを使っています。
クラウドサービスが出たおかげで、自宅サーバーやVPSを借りたりしなくても、手軽に色々なものが安価に試せるようになり、非常に便利になりました。
その反面、アカウントを乗っ取られた場合、高額な請求がくる危険性があります。
「AWS アカウント 乗っ取り」とかで調べれば事例がたくさん出てきます。

心配性な私は、なるべく危険を排除して、セキュアにIAMを運用しようと努力しています。
その内容をまとめて見ようと思いこの記事を書きました。

こういう風にしたらよりセキュアになるよ、とか、ここはこういった危険性があるかも、という点があれば、優しくコメントで指摘いただけると嬉しいです。

IAMがよく分からん、という方は以下の記事などを読まれると良いかと思います。

- [AWS初心者にIAM Policy/User/Roleについてざっくり説明する ｜ Developers.IO](https://dev.classmethod.jp/cloud/aws/iam-policy-user-role-for-primary-of-aws/)

## 前提

* 個人レベルでの管理の話です。
* IAMのみを対象にしています。IAM以外のサービスを使ったセキュリティ（例: GuardDutyなど）や、AWS上に構築したサービスのセキュリティは、対象外とします。
* macOS での実行を前提にしています。
* 私はフロントエンドエンジニアをメインに仕事してます。

## 使用するツール

### [AWSマネジメントコンソール](https://docs.aws.amazon.com/ja_jp/awsconsolehelpdocs/latest/gsg/getting-started.html)

AWSを使っているなら知らない人はいないと思いますが、AWSをブラウザ上から色々操作できるツールです。

### [aws-vault](https://github.com/99designs/aws-vault)

AWSのアクセスキーをセキュアに管理し、便利に扱う機能があります。
macOSなら[Homebrew](https://brew.sh/index_ja)で簡単にインストールできます。
以下のコマンドでインストールできるはずです。

```bash
# Homebrewのインストール
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# aws-vaultのインストール
$ brew cask install aws-vault

# インストールされたかの確認
$ aws-vault --version
v5.1.2
```

## [IAMベストプラクティス](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/best-practices.html)

AWSの公式ドキュメントにある、IAMでやっておくべき推奨事項です。
これを守ればひとまずOKという感じです。
この記事は、このIAMベストプラクティスを踏まえた上で、どう運用するか、という観点で書いています。
読んだことがない方は、こちらの記事を読む前にぜひ一読ください。

ここから具体的な運用についての説明します。

## ルートユーザーの保護

ルートユーザーは、アカウント内のリソースすべてにフルアクセスでき、非常に強い権限を持つ上、何も制限をかけることができないので、厳重に保護します。

ルートユーザーは、ミスなどで管理用のIAMユーザーが使用できなくなった場合などに使用する最終手段と私は位置づけおり、ほとんど使うことはありません。

### 強固なパスワードを使用する

言うまでもないことですが、他では使用していない、できる限りランダムな長い文字列でパスワードを設定します。

### MFAを有効にする

こちらも当然ではありますが、多要素認証(MFA)を有効にして、よりルートアカウントをセキュアにしてください。

AWSマネジメントコンソールのIAMのトップ画面にも有効になっているかどうかがいつも表示されてます。

![c2cfbf62-fc7c-31ef-ff1c-efc40ecc77a9.png](https://i.gyazo.com/19ba6030f856cf91f8319cb96c1f7afd.png)

### アクセスキーは作らない

非常に強い権限を持つルートユーザーのアクセスキーは作りません。
ないものは流出もしないので安全です。

必要に応じて最小権限を持つIAMユーザーを作り、アクセスキーを発行します。

## IAMユーザーの作成

### 使用する単位ごとにIAMユーザーを作成

私の場合は、使用する端末ごとにIAMユーザーを作成しています。
（個人の運用なので他の人はいませんが、組織なら当然各人にIAMユーザーを作りましょう）

また、CIについてもリポジトリごとにユーザーを作成しています。
ちなみに [GitHub Actions](https://github.co.jp/features/actions) を使っています。

### IAMユーザーには権限を付与しない

IAMユーザーは個別に権限を **割り当てません**。
IAMユーザーは、後述のIAMグループに所属させるためです。
IAMベストプラクティスにもありますが、グループの方が権限の管理が容易ですし、個別に権限を付与するのは抜け漏れが発生しやすいです。

### IAMユーザーのパスワードは作成しない

IAMユーザーはパスワードを作成作成しないようにします。
ないものは流出もしないので安全です。

![ec62f8fc-222f-44ea-a256-f49ef4e683ea.png](https://i.gyazo.com/ff0c94f2c2ebd4ad195bb4f8ae05d482.png)

パスワードがないとAWSマネジメントコンソール使えないじゃん、と思うかもしれませんが、[STSの機能](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_providers_enable-console-custom-url.html)を使ってアクセスキーだけでAWSコンソールにアクセスすることが可能です。
詳細な仕組みまでは知らないのですが、aws-vault を使うと容易に実行できます。後述します。

## IAMグループの作成とIAMユーザーの追加

### IAMグループの作成

必要なグループを定義して、そこにIAMユーザーを所属させます。
私の場合は、開発者グループとCI用グループを作成しています。

開発者グループには、自身のIAMユーザーに対して、情報を閲覧する権限と、アクセスキーをローテーション（作成/削除）する権限しか付与していません。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateAccessKey",
                "iam:DeleteAccessKey",
                "iam:GetUser"
            ],
            "Resource": [
                "arn:aws:iam::123456789012:user/${aws:username}"
            ]
        }
    ]
}
```

ほとんど何もできないので、万一アクセスキーが流出したとしても安心感があります。
こんな権限じゃ何にも使えないじゃん、と思うかもしれませんが、IAMロールにAssumeRoleをすることで、その権限を実行できるようになります。詳しくは後述します。

CI用グループは、個別のケースでCIが使う権限を必要最小限にとどめて設定します。
私の場合は殆ど同じような用途で、権限も似ているので、１つのグループにしていますが、色々な用途がある場合は、用途に応じてCIも複数のグループにしたほうが良いかもしれません。
この辺はケースバイケースだと思います。

## IAMロールの作成

### 場面に応じて必要な権限を持つIAMロールを作成

私の場合は、普段使用する「閲覧権限＋S3へのアップロードなど」の権限と、AdministratorAccessを付与した管理者権限の２つを作っています。

![a545447b-45cf-48b4-43b1-0c418194f1a3.png](https://i.gyazo.com/7ce5cc28c6eb6a16c6d1f7146cfa614b.png)
（管理者権限を持つIAMロールの例）

管理者権限だと最小限じゃないので、個人的には理想と違うんですが、ちょっと新しいことを試そうとしたりするたびに、いちいち権限を調整しないといけないのは実用面で辛いので、現実解として管理者権限を持つユーザーは必要かな、と思っています。
そもそも個人のAWSアカウントで色々なサービスを試してみたい、ということで使っているので、それを阻害するのは避けたいです。

ただし、いつでも管理者権限を使うのではなく、デプロイ時などの特定の場合のみに使用し、普段は権限を制限しているロールで作業するように、私の中のルールで使い分けています。

### 信頼関係の設定

AssumeRoleを行うための設定を行います。
AssumeRoleはこのケースの場合、許可されたIAMユーザーがIAMロールの権限を一時的に使用できるようになる、というイメージで一旦理解してもらえると良いかと思います。

詳しくは、以下の記事が参考になります。
[IAMロール徹底理解 〜 AssumeRoleの正体 ｜ Developers\.IO](https://dev.classmethod.jp/cloud/aws/iam-role-and-assumerole/)

指定した状況だと、こういう表示になります。
この場合 `home` と `work` というユーザーがAssumeRoleを許可されています。

![406d6b2a-faaa-a455-43ee-1c34bbba3ca3.png](https://i.gyazo.com/1ee96b95e442b4b2c4c582205285b3cc.png)

JSONの指定はこんな感じです。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::123456789012:user/work",
          "arn:aws:iam::123456789012:user/home"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

ちなみに、万一AssumeRoleで取得したアクセスキーが流出したとしても、有効期限付きなので少しだけ安心感があります。

## aws-vault

このツールを使うことでセキュアに色々なことができるようになります。

こちらの記事が詳細に書かれているので、正直こちらの記事を読めばだいたい分かると思います。ぜひ読んでみてください。
[aws\-vault でアクセスキーを安全に \- Septeni Engineer's Blog](https://labs.septeni.co.jp/entry/2018/01/12/113000)

以下、自分が使っている範囲で解説します。

### 環境変数の設定

そのままでも使えますが、私が設定している環境変数を紹介します。

```bash
# ログインKeyChainを使用するように変更
# パスワードを求められる頻度が格段に減る
# （これを設定しない場合、15分経過すると再度パスワードを求められる）
export AWS_VAULT_KEYCHAIN_NAME="login"

# AssumeRoleを１時間まで可能にする（１時間が最大、デフォルト15分）
export AWS_ASSUME_ROLE_TTL="1h"
```

[リポジトリのドキュメント](https://github.com/99designs/aws-vault/blob/master/USAGE.md#environment-variables)に他の環境変数も書かれています。

### 設定

初回はアクセスキーを設定する必要があるので、AWSマネジメントコンソールで対象のIAMユーザーのアクセスキーを発行します。

![6edb1b15-c71f-6e5e-2c8f-f0de8127f7b6.png](https://i.gyazo.com/54baf1f6f16672c32966282a802933a2.png)

続いて以下のコマンドでアクセスキーを設定します。
`myprofile` はプロファイル名で任意の名前です。わかりやすい名前にしましょう。

```bash
$ aws-vault add myprofile
Enter Access Key ID: AKI******************
Enter Secret Access Key: XA1kev******************
Added credentials to profile "myprofile" in vault
```

これで、アクセスキーを保存できました。
aws-vaultはmacOSの場合は[KeyChain](https://support.apple.com/ja-jp/guide/keychain-access/kyca1083/mac)に保存されます。
平文でファイルに保存するよりも安心感がありますね。

### アクセスキーのローテーション

IAMベストプラクティスでも「認証情報を定期的にローテーションする」と書かれている通り、アクセスキーは頻繁に更新することをおすすめします。

とは言え普通にやるのは面倒なのでなかなかやりませんが、aws-vault ならコマンド一発でローテーションができます！

```bash
$ aws-vault rotate -n myprofile
Rotating credentials stored for profile 'myprofile' using master credentials (takes 10-20 seconds)
Creating a new access key
Created new access key ****************B3K5
Deleting old access key ****************A53D
Deleted old access key ****************A53D
Finished rotating access key
```

これだけで、アクセスキーをローテーションできました！
内部では、アクセスキーを新しく発行して、古いキーを削除しているだけですね。

IAMユーザーは、制約としてアクセスキーは２つまでしか同時に発行できません。
なので、アクセスキーを２つ発行している場合はエラーになるので、どちらかを消しましょう。
上限が２つなのは、このようにローテーションするためのものだと思われます。

余談：昔は `-n (--no-session)` をつけなくても動作したんですが `v5.1.2` で実行するとエラーが出るんですよね。[Issue](https://github.com/99designs/aws-vault/issues/485)も `v5.1.2` では再現しなくなってクローズされた、とあるんですが、私の環境では再現しました。オプション1つつければ解決するんで、大きな問題ではないですが。

### セッショントークンを含んだ一時的なアクセスキーの取得

```bash
$ aws-vault exec myprofile -- env | grep "AWS_"
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_SESSION_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

`aws-vault exec <profile_name> -- <コマンド>` で実行すると、AWSの実行に必要な認証情報が環境変数に設定された状態でコマンドが実行できます。
このアクセスキーは有効期限があるので、少しだけ安心感があります。

### AssumeRoleの設定

IAMロールに対してAssumeRoleする設定を行います。
`~/.aws/config` に対して以下のように記述するとaws-vaultが自動的にAssumeRoleしてくれるようになります。

```
[profile admin]
source_profile=myprofile
role_arn=arn:aws:iam::123456789012:role/AdminRole
```

`source_profile` はAssumeRole対象のプロファイル名（この例だと `myprofile`）を指定し `role_arn` はAssumeRoleしたいIAMロールの **ARN** を指定します。
実行時は以下のように実行します。

```bash
$ aws-vault exec admin -- <コマンド>
```

これで、AdminRoleに設定されている権限でコマンドが実行できるようになります。

ちなみに、MFAの設定もできます。
自分も設定してみたのですが、個人で使っている分にはリスクより手間のほうが大きいと感じているので今は使っていません。
設定されたい方は[公式ドキュメントのこの辺り](https://github.com/99designs/aws-vault#roles-and-mfa)を参考にされると良いかと思います。

なお、AssumeRoleの設定は、アクセスキーと一緒に漏れるとIAMロールの権限内で諸々実行可能になってしまうので、なるべく流出しないようにしたほうが良いと思います。
私はAWSアカウントもなるべく漏れないように気を使い、ロール名も推測できないように実際は乱数を付与して運用しています。

### AWSマネジメントコンソールへのログイン

CLIからAWSマネジメントコンソールにログインできます。

```bash
$ aws-vault login myprofile
# ブラウザでAWSマネジメントコンソールが開きます

$ aws-vault login admin
# IAMロールの権限でAWSマネジメントコンソールが開くことも可能です
```

いちいちパスワードを打つ必要がないので便利です！

## ざっくりまとめ

* ルートユーザーはなるべくセキュリティを強固にして使わない
* IAMユーザーはパスワードがないので、そもそも流出しない
* aws-vaultを使用するとアクセスキーはKeyChainにあるので容易には盗まれない
* IAMユーザーのアクセスキーは流出しても権限がほとんどない
* aws-vaultで実行すると、通常は有効期限付きのアクセスキーで実行される
* 万一IAMユーザーのアクセスキーが流出しても、AssumeRoleの情報が分からない限り何もできない

## おわりに

セキュリティに終わりはないので、ここに書いてある内容を実施しても100%安全と言うわけではないですが、私は大分安心してAWSが使えるようになりました。
アクセスキーはAWSを使う上で重要になってくるので、なるべくセキュアに扱いたいものです。

今回は対象外としましたが、AWSの他のサービス（GuardDutyやConfigなど）も併用するとよりセキュアになるので、設定することをおすすめします。
[Developers.IO](https://dev.classmethod.jp/)はよくお世話になっています。

[【初心者向け】AWSの脅威検知サービスAmazon GuardDutyのよく分かる解説と情報まとめ ｜ Developers\.IO](https://dev.classmethod.jp/cloud/aws/guardduty-summary/)
[AWS Configはとりあえず有効にしよう ｜ Developers\.IO](https://dev.classmethod.jp/cloud/aws/aws-config-start/)

冒頭にも書きましたが、こういう風にしたらよりセキュアになるよ、とか、ここはこういった危険性があるかも、という点があれば、優しくコメントで指摘いただけると嬉しいです。

