# ngrok の使い方

デザイナーさんに紹介したら「便利！」と高評価だったので、セットアップ〜使い方までをメモ。

## セットアップ

### ngrok の登録

- https://dashboard.ngrok.com/login にアクセスしてログインします。
    - GitHub や Google アカウントを持っているなら「Log in with 〜」のほうが便利かも
    - アカウントがない場合は「Sign up for free!」で登録します。

![capture.png](https://i.gyazo.com/6defe8a0b2e3dd22db49bae7901d60f3.png)



### ターミナルを開く

アプリケーションの「ユーティリティ」→「ターミナル」で開けます。

![capture 1.png](https://i.gyazo.com/6387a6c01fc1570bf17f227eee8a1444.png)

ここでコマンド操作が必要になります。
以下「コマンドを実行します」が出た場合は、書かれているコマンドをターミナル上に貼り付けて Enter キーを押して実行してください。

#### コマンドの実行例

以下のコマンドを実行してください。

```bash
echo "TEST"
```

と書かれている場合は以下のように操作してください。

![capture.gif](https://i.gyazo.com/3fe06fee4836f6c4c09facb3a3813513.gif)



### Homebrew のセットアップ

もし [Homebrew](https://brew.sh/) がインストールされていない場合は、セットアップします。

インストールされているかを確認する場合は、以下のコマンドを実行してください。

```bash
type brew
```

インストールされている場合は、以下のような表示になるはずです。
（全く同じではないかもしれませんが、似たような感じであれば大丈夫です）

```bash
$ type brew
brew は /usr/local/bin/brew です
```

インストールされていない場合は以下のような表示になるはずです。
（全く同じではないかもしれませんが、似たような感じであれば大丈夫です）

```bash
$ type brew
-bash: type: brew: 見つかりません
```

インストールされていなかった場合は、以下のコマンドを実行します。

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```



### 必要なアプリケーションのインストール

ngrok をインストールするため、以下のコマンドを実行します。

```bash
brew cask install ngrok
```

またHTTPサーバーが別途必要なので、自前で立てる方法がわからない場合は以下のコマンドで簡単に使えるHTTPサーバーをインストールするため、以下のコマンドを実行します。

```bash
brew install http-server
```


### ngrok の初期設定

認証用のトークンというのを設定しないと使えないので、そのセットアップをします。

https://dashboard.ngrok.com/get-started/setup にアクセスして「2. Connect your account」にかかれているコマンドをコピーします。
その際、先頭の `./` は不要です。

![capture.png](https://i.gyazo.com/a1fba1580add4a286f48f02005e8c8c6.png)

コピーしたら、ターミナルに貼り付けてコマンドを実行します。

```bash
ngrok authtoken XvxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxKc
```

これで実行する準備ができました。



## 実行

まず、HTTPサーバーを立ち上げるため、以下のコマンドを実行します。

```bash
http-server
```

次に ngrok を立ち上げます。

```bash
ngrok http 8080
```

これで、表示されているURLにアクセスすれば、ローカルの内容をどこからでも見れるようになります。

![capture 1.png](https://i.gyazo.com/e260fd9ea51ec52e254c30ed203464a8.png)

