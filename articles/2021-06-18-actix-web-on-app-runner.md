---
title: "\"Actix Web (Rust) を App Runner で動かしたメモ\""
emoji: "📝"
type: "tech"
topics:
  - "Rust"
  - "actixweb"
  - "AWS"
  - "AppRunner"
published: true
canonical: "https://zenn.dev/mryhryki/articles/2021-06-18-actix-web-on-app-runner"
---

# はじめに

最近興味がある Rust を使ってなにか動くものを作りたいな、と思ったので簡単な Web アプリを作ってみたメモです。
ついでに AWS App Runner を使うとコンテナイメージを簡単にWebに公開できると聞いたので、試してみました。



# 作った Web アプリの概要

- エンドポイントは２つ
  - `/` : ただメッセージを返すだけのエンドポイント（動作確認用）
  - `/listbuckets` : S3バケットの一覧をJSONで返すエンドポイント
    - [rusoto](https://github.com/rusoto/rusoto) ではなく[aws-sdk-rust](https://github.com/awslabs/aws-sdk-rust) を使ってます
    - `v0.0.8-alpha` です。まだこれからって感じです。
    - [S3 サポートしたっていうのを発見した](https://twitter.com/mryhryki/status/1400548179829878784) ので使ってみようと思った次第です。
- コンテナイメージを作成
  - [Rust公式イメージ](https://hub.docker.com/_/rust/) (`rust:latest`) を使ってます。
  - 執筆時点では `1.52.1` でした。
    - ```
      $ docker run -it --rm rust:latest rustc --version
      rustc 1.52.1 (9bc8c42bb 2021-05-09)
      ```
- ECS Public にプッシュ
- App Runner で公開

作ったソースコードはこちらに公開しています。

https://github.com/mryhryki/example-actix-web-on-app-runner



## ソースコード (Rust)

[actix-web](https://github.com/actix/actix-web) を使って Web サーバーを立てています。
どこかで速いというのを以前見てたので、とりあえずこちらを使ってみました。

なお [aws-sdk-rust](https://github.com/awslabs/aws-sdk-rust) と [tokio](https://github.com/tokio-rs/tokio) のバージョンを合わせる必要があるようで、仕方なくβ版（`v4.0.0-beta.6`）を使っています。

ソースコードはこんな感じです。

```rust
use actix_web::{get, middleware::Logger, web, App, HttpResponse, HttpServer, Responder};
use auth::default_provider;
use s3::{Config, Region};

#[get("/")]
async fn index(_path: web::Path<()>) -> impl Responder {
    String::from("Hello, Actix Web!")
}

#[get("/listbuckets")]
async fn list_buckets(_path: web::Path<()>) -> impl Responder {
    let config = Config::builder()
        .region(Region::new("us-east-1"))
        .credentials_provider(default_provider())
        .build();
    let resp = s3::Client::from_conf(config).list_buckets().send().await;

    match resp {
        Ok(val) => {
            let list: Vec<String> = val
                .buckets
                .unwrap_or(vec![])
                .iter()
                .map(|bucket| {
                    String::from(bucket.name.as_ref().unwrap_or(&String::from("(ERROR)")))
                })
                .collect();
            HttpResponse::Ok().json(&list)
        }
        Err(err) => {
            println!("{:?}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .service(index)
            .service(list_buckets)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
```

（短いコードですが、なかなか所有権と型に悩まされ苦労しました・・・ ）



## Dockerfile

何の変哲もない、ソースコードをコピーして `cargo build` するだけのシンプルなやつです。

```dockerfile
FROM rust:latest AS builder
WORKDIR /usr/local/example-actix-web-on-app-runner/

COPY ./ ./
RUN cargo build --release

EXPOSE 8080
CMD ./target/release/example-actix-web-on-app-runner
```

（私のやり方が悪いのだと思いますが）Crate をキャッシュしようと思ったら、期待通り動かなかったのでシンプルにしてます。
まぁ、ローカルで動かしてOKだったらビルドするので、一旦テストとしては許容範囲。



## ECR Public の設定

AWS Console から普通にポチポチやって作りました。
最初にパブリックを選択して、リポジトリ名を入れれば後はデフォルトでOKという感じでした。

![ecr_public.png](https://i.gyazo.com/9dc2f3c281ecb4edd200f7c254eb0139.png)

イメージのプッシュも「プッシュコマンドの表示」どおりやれば問題なくプッシュできました。

![ecr_push.png](https://i.gyazo.com/186565ef4f25fae9984065c7502e81a3.png)



## App Runner の設定

こちらも AWS Console からポチポチやって作りました。
特に分かりにくい設定もなかったので、簡単に作れました。

![app_runner.png](https://i.gyazo.com/5ca0bc7904a31750728cbc55b9149d28.png)

以下はデフォルトと変えています。

- テスト用なので、Auto Scaling の最大サイズも1にしました。
- テスト用なので、なるべく早くヘルスチェックを終わらせたいので値を小さめにしています。

設定するとデプロイが始まります。超手軽でした。

完了すると以下のように「RUNNING」という表示になり、デフォルトドメインにあるURLにアクセスできるようになります。

![deployment_successful.png](https://i.gyazo.com/36895f18d4c7bf732f3d8e026dc63e46.png)



## 動作確認

こんな感じで動くことを確認しました。
インフラ構築の手間なくて簡単ですね〜！

```bash
$ curl https://mfnimscavt.us-east-1.awsapprunner.com/
Hello, Actix Web!

$ curl https://mfnimscavt.us-east-1.awsapprunner.com/listbuckets
["xxxxxxxx", "yyyyyyyy", ...]
```



# 困ったところ

## aws-sdk-rust の認証情報の取得

:::message
`v0.0.8-alpha` なのでまだまだ足りないところがあって当然、という前提で読んでください
:::

aws-sdk-rust から AppRunner に割り当てた IAM Role の認証情報を使うことが出来ないようでした。
あまりこのあたりの仕組みに詳しくないですが、EC2のメタデータの取得の実装もまだまだこれからっぽいので、待つ必要がありそうですかね。

[Instance metadata credentials support · Issue #97 · awslabs/aws-sdk-rust](https://github.com/awslabs/aws-sdk-rust/issues/97)

今回は環境変数にAWSアクセスキーを設定して動かしましたが、運用・セキュリティ的にあまり良くないのでこれからに期待です。
（安全のため、バケット一覧を見る権限のみをつけたテスト用のIAMユーザーを作り、テストが終わったらユーザーごと消しました）



## Dockerイメージでヘルスチェックできない場合に何もできない

ミス (typo) して正常に動作しないイメージを上げてデプロイしたら、30分ぐらい `Operation in progress` の状態が続来ました。
特にログにもエラーなども出ておらず、ひたすらロールバックされるのを待っていました。
もしかしたら私が気づいていない何かがあったかもしれませんが、この辺改善されるといいな、と思います。



# おわりに

Rust は学習が難しいと言われていますが、実際難しいというのを実感しました。
ライブラリ関連もまだ成熟してないな、というのもあるかもしれません。（更に今回は alpha, beta 版を使っていたのも大きいかもしれません・・・）
ただコンパイラのチェックがかなり厳しいので、ビルドが通れば後は安心できる感じがします。
もちろん、GCレス、高速、メモリ安全、というメリットも魅力的です。

AWS App Runner は手軽に構築できて、こういったサクッと作ってみたいときには使いやすいサービスだな、と思いました。

今回初めてのことばかりで色々試行錯誤しましたが、こういう手を動かして知らないものを使ってみるというのはとても楽しかったです。
最後に、私も Rust 初心者なので、ここはこう直したほうが良いよ、とかあればコメントなど頂けると嬉しいです。
