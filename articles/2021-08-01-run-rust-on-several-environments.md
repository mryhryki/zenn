---
title: "Rust のコードをいろいろな環境で動かしてみたメモ"
emoji: "📝"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Rust","WebAssembly","AWSLambda"]
published: false
---

# はじめに

最近学習している Rust はいろいろな環境で動せるので、いくつかの環境で実行できるか試してみた結果をまとめたメモです。


# Rust のソースコード

ベースとして使った Rust のソースコードは、以下のようにランダムな文字列を返すだけの関数です。
（ビルドのために変更が必要になるものもあるので、あくまでこれをベースにしてやった、という感じです）

```rust
use rand::{thread_rng, Rng};
use rand::distributions::Alphanumeric;

fn random() -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(30)
        .map(char::from)
        .collect()
}

fn main() {
    println!("Random: {}", random());
}
```

なお、こちらのサンプルコードを参考にしています。

https://rust-lang-nursery.github.io/rust-cookbook/algorithms/randomness.html#create-random-passwords-from-a-set-of-alphanumeric-characters


# 実行環境

以下の環境で実行しています。

```bash
$ sw_vers
ProductName:    macOS
ProductVersion: 11.5.1
BuildVersion:   20G80

$ cargo --version
cargo 1.54.0 (5ae8d74b3 2021-06-22)

$ rustup --version
rustup 1.24.3 (ce5817a94 2021-05-31)

$ rustc --version
rustc 1.54.0 (a178d0322 2021-07-26)
```


# 1. CLI

これはよくある使い方ですね。
普通に `cargo build` すればOKです。

```bash
$ cargo build --release
```

以下のコマンドで実行可能。

```bash
$ ./target/release/gen_rand 
Random: QqdElRD0gD8pTH6hLuCqPeOchXEVxB
```

# 2. WebAssembly

WebAssembly (wasm) はブラウザで実行できる、ネイティブに近いパフォーマンスで動作する方法です。

https://developer.mozilla.org/ja/docs/WebAssembly

https://webassembly.org/docs/web/

> Unsurprisingly, one of WebAssembly’s primary purposes is to run on the Web, for example embedded in Web browsers (though this is not its only purpose).

MDNのドキュメントにいい感じのチュートリアルがあったので、こちらをベースに試してみました。
https://developer.mozilla.org/ja/docs/WebAssembly/Rust_to_wasm


## wasm-pack のインストール

npm に公開するためのパッケージを作るための作業を手軽にしてくれるようなイメージのツールです。
https://crates.io/crates/wasm-pack

```bash
$ cargo install wasm-pack
```


## Cargo.toml の変更

`wasm-bindgen` という wasm と JavaScript のやり取りがしやすくなる Crate を追加しています。
また `rand` で使われている `getrandom` という Crate を wasm に変換する際は `features = ["js"]` の指定が必要になると[ドキュメントに書かれていた](https://docs.rs/getrandom/0.2.3/getrandom/#webassembly-support)ので、追加しています。

```diff
+ [lib]
+ crate-type = ["cdylib"]
  
  [dependencies]
  rand = "0.8.4"
+ getrandom = { version = "0.2", features = ["js"] }
+ wasm-bindgen = "0.2"
```


## ソースコードの変更

`main.rs` を `lib.rs` に変更して、ソースコードも以下のように変更しました。

```diff
+ extern crate wasm_bindgen;
+ 
+ use wasm_bindgen::prelude::*;
  use rand::{thread_rng, Rng};
  use rand::distributions::Alphanumeric;
  // (略) 
          .collect()
  }
  
- fn main() {
-     println!("Random: {}", random());
+ #[wasm_bindgen]
+ pub fn gen_rand() -> String {
+     random()
  }
```


## ビルド

`cargo` ではなく `wasm-pack` を使ってビルドします。

```bash
$ wasm-pack build --scope "(scope_name)"
```

ビルド結果は `target` ではなく `pkg` ディレクトリに出力されます。
wasm ファイルやエントリーポイントとなるJSファイル、TypeScriptの型定義ファイル ( `.d.ts` ) などが出力されています。
また `package.json` など、npm への公開に必要な情報なども含まれています。


## npm パッケージの作成

以下のコマンドで npm 用のパッケージを作成します。
（MDN のチュートリアルでは npm へ公開していますが、そこまでやる必要もないかな、と思ったので今回はローカルに置いたファイルを使うようにしてみました）

```bash
$ cd pkg
$ npm pack
```

## JSビルドの環境構築

`webpack` でJSをビルドする環境を作りました。

### package.json

```json
{
  "scripts": {
    "start": "webpack serve",
    "build": "webpack",
    "serve": "serve public/"
  },
  "dependencies": {
    "@mryhryki/gen_rand": "file:../pkg/mryhryki-gen_rand-0.1.0.tgz",
    "webpack": "^5.47.1",
    "webpack-cli": "^4.7.2",
    "webpack-dev-server": "^3.11.2"
  }
}
```

先に生成していた npm 用のパッケージは、以下のコマンドで `package.json` に追加しました。

```bash
$ npm i ../pkg/mryhryki-gen_rand-0.1.0.tgz
```

### webpack.config.js

`webpack5` だと `experiments.asyncWebAssembly = true` をセットしないと wasm のビルドができないようです。
（無しで実行するとエラーになったので追加しました）

```javascript
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index.js',
  },
  experiments: {
    asyncWebAssembly: true
  },
  devServer: {
    contentBase: 'public/',
    open: true,
  },
}
```

### HTML と JavaScript

以下のようにシンプルな HTML と JavaScript ファイルを用意しました。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Web Assembly Test</title>
</head>
<body>
  <h1>Web Assembly Test</h1>
  <div>
    <button id="$generate">Generate Random Text</button>
  </div>
  <div style="margin-top: 16px;">
    <textarea id="$result" style="width: 480px; max-width: 96vw; min-height: 320px;"></textarea>
  </div>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
import {gen_rand as genRand} from '@mryhryki/gen_rand'

const generateButton = document.getElementById('$generate')
const resultElement = document.getElementById('$result')
generateButton.addEventListener('click', () => {
  const random = genRand();
  resultElement.value = `${resultElement.value}${random}\n`;
})
```

### ブラウザでの実行

`webpack-dev-server` を起動して、ブラウザで実行すると以下のように動作しました。

![capture.gif](https://i.gyazo.com/36ab0cbfbfd15450b16dbbfebf3c92dc.gif)

`wasm-pack` や `wasm-bindgen` などのツールがちゃんと動いてくれるおかげで、思ってたいたよりずっと簡単にできました。
あとMDNのドキュメントも丁寧で非常にわかりやすかったです。



# 3. Wasmer

Wasmer は WebAssembly をブラウザ以外で動作できる実行環境です。
https://wasmer.io/

WebAssembly は、ブラウザ以外で実行されることも想定されているようです。
https://webassembly.org/docs/non-web/

こちらの記事も参考になります。
https://zenn.dev/koduki/articles/f1b342079788be


## インストール

こちらのドキュメントに従ってインストールします。
https://docs.wasmer.io/ecosystem/wasmer/getting-started

```bash
$ curl https://get.wasmer.io -sSfL | sh

# パスを通す
$ export WASMER_DIR="${HOME}/.wasmer"
$ export PATH="${WASMER_DIR}/bin:${PATH}"
```

バージョンは `2.0.0` です。

```bash
$ wasmer --version
wasmer 2.0.0
```


## wasm 向けにビルド

最初に以下のコマンドで wasm 向けにビルドできるように設定します。

```bash
$ rustup target add wasm32-wasi
```

以下のコマンドでビルドできます。

```
$ cargo build --release --target wasm32-wasi
```


## 実行

出力されたwasm 用のバイナリを `wasmer` コマンドに渡せば実行できます

```bash
$ wasmer run target/wasm32-wasi/release/gen_rand.wasm 
Random: Bq1xx81UHB8ljCzRxql7XC5FhMzTIf
```



# 4. AWS Lambda

私が個人的によく使っているので、AWS Lambda での実行も試してみました。


## セットアップ

[lambda_runtime](https://github.com/awslabs/aws-lambda-rust-runtime/blob/c01811a33d33a89d0c55c3c9e90916832f1f7ca8/README.md#aws-cli) のリポジトリの README に従ってセットアップしました。
細かいところは省略して、コマンドだけ載せておきます。

```bash
$ rustup target add x86_64-unknown-linux-musl
$ brew install filosottile/musl-cross/musl-cross
$ mkdir .cargo
$ echo $'[target.x86_64-unknown-linux-musl]\nlinker = "x86_64-linux-musl-gcc"' > .cargo/config
```


## Cargo.toml の変更

実行に必要な Crate を追加しました。

```diff
  [dependencies]
+ lambda_runtime = "0.3.0"
  rand = "0.8.4"
+ serde = "1.0.126"
+ tokio = "1.9.0"
```


## main.rs の変更

AWS Lambda 向けに以下のようにソースコードを変更しました。

```diff
+ use lambda_runtime::{handler_fn, Context, Error};
+ use serde::{Deserialize, Serialize};
  use rand::{thread_rng, Rng};
  use rand::distributions::Alphanumeric;
  
+ #[derive(Deserialize)]
+ struct Request {}
+ 
+ #[derive(Serialize)]
+ struct Response {
+     random: String,
+ }
+ 
  fn random() -> String {
      thread_rng()
          .sample_iter(&Alphanumeric)
  //...
          .collect()
  }
  
- fn main() {
-     println!("Random: {}", random());
+ #[tokio::main]
+ async fn main() -> Result<(), Error> {
+     let func = handler_fn(handler);
+     lambda_runtime::run(func).await?;
+     Ok(())
+ }
+ 
+ pub(crate) async fn handler(_: Request, _: Context) -> Result<Response, Error> {
+     let resp = Response { random: random() };
+     Ok(resp)
  }
```


## Linux 向けにビルドする

オプションを変えて `cargo build` を実行して、Linux 向けのバイナリを生成します。

```bash
$ cargo build --release --target x86_64-unknown-linux-musl
```

## 生成したバイナリをZipファイルにまとめる

以下のコマンドで生成したバイナリを AWS Lambda 向けの Zip ファイルにします。

```bash
cp "target/x86_64-unknown-linux-musl/release/gen_rand" "./bootstrap"
zip "lambda.zip" "bootstrap"
```

※ `bootstreap` 以外の名前にしたり、Zip ファイル作成時のパスを上記以外にすると、Lambda 実行時にエラーになる場合があります。

## AWS Lambda 関数の作成

AWS CLI を使って作成しました。

```bash
$ aws lambda create-function --function-name gen_rand \
  --handler "gen_rand.handler" \
  --zip-file "fileb://./lambda.zip" \
  --runtime provided \
  --role "arn:aws:iam::000000000000:role/IAM_ROLE_NAME" \
  --environment "Variables={RUST_BACKTRACE=1}" \
  --tracing-config "Mode=Active"
```

更新する場合はこちら。

```bash
$aws lambda update-function-code --function-name gen_rand \
   --zip-file "fileb://./lambda.zip"
```

## AWS Lambda の実行

こちらも AWS CLI 経由で実行しました。

```bash
$ aws lambda invoke --function-name gen_rand --payload '{}' "output.json"
$ cat output.json
{"random":"iomW3yjQwtLZbbfdvvbr3eHjhCKBMq"}
```
