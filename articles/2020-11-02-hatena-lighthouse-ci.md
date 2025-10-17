---
title: "Lighthouse CI と Heroku でウェブページのスコアを継続的に測定して推移を見る"
emoji: "🚚"
type: "tech"
topics:
  - "Web"
  - "Lighthouse"
  - "CI"
  - "Heroku"
published: true
canonical: "https://zenn.dev/mryhryki/articles/2020-11-02-hatena-lighthouse-ci"
---

※この記事は[はてなブログ](https://hyiromori.hateblo.jp/entry/2020/11/02/LHCI)、[別アカウント(hyiromori)](https://zenn.dev/hyiromori/articles/hatena-20201102-124230)から引っ越しました

## はじめに

ウェブページの品質測定を行う際に [Lighthouse](https://github.com/GoogleChrome/lighthouse) を使うケースは多いと思います。
ウェブページのパフォーマンスやアクセシビリティ、SEOなどのスコアを算出して数値化できる便利なツールですね。

https://developers.google.com/web/tools/lighthouse?hl=ja

しかし毎回手動実行するのは面倒ですし、継続的に計測して問題点を発見したり推移を見たりするには工夫が必要です。

そこで、Ligthouse CI で CI 実行時にスコアを計測し、Lighthouse CI Server を Heroku で動かしてそこでスコアを蓄積することで推移を見れるようにしてみたいと思います。

https://github.com/GoogleChrome/lighthouse-ci

### 2020-11-21 追記

[コネヒトマルシェオンライン](https://connehito.connpass.com/event/193896/) のLTで話しました。
その際の資料も添付しておきます。

[speakerdeck](https://speakerdeck.com/mryhryki/lighthouse-ci)



## この記事の目標

- Lighthouse を GitHub にプッシュする度に CI (GitHub Actions) で実行する
- 実行結果を蓄積して、履歴を確認できるようにする



## 事前に用意するもの

- Lighthouse CI で計測したい GitHub リポジトリ
- Heroku アカウントとセットアップ済みの [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)



## Lighthouse CI (LHCI) を CI (GitHub Actions) で動かす設定

[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) は Lighthouse を CI で実行するためのパッケージです。
公式ドキュメントの通り、設定ファイルを置いて CI の設定ファイルに実行ステップを追加すれば OK です。

ではまず、計測したいリポジトリに `.lighthouserc.js` という設定ファイルを配置します。

```javascript
module.exports = {
  ci: {
    collect: {
      staticDistDir: "./",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
```

ファイルが配置済みの場合は上記の設定で大丈夫ですが `Ruby on Rails` など個別にサーバーを立てる必要がある場合は [startServerCommand](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#non-nodejs-development-server) という設定でコマンドを記述すると実行できます。

以下の例は [http-server](https://www.npmjs.com/package/http-server) を使って、自前でサーバーを実行する例です。（静的なHTTPサーバーなのでこの場合あまり意味はありませんが、サンプルとして捉えてください）

```diff
 module.exports = {
   collect: {
-     staticDistDir: "./",
+     startServerCommand: "npx http-server ./ --port 8080",
+     url: ["http://localhost:8080/"]
   },
   ci: {
     upload: {
       target: "temporary-public-storage",
     },
   },
 };
```

次に GitHub Actions の定義ファイルを `.github/workflows/(名前).yml` のパスに用意して、以下のような内容にします。

```yaml
name: "(名前)"
on: [push]
jobs:
  lhci:
    name: Lighthouse
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: 12
      - name: build
        run: echo '必要なビルドステップがあればここに記述する'
      - name: run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.6.x
          lhci autorun
```

※ `GitHub Actions` 以外のCIについては [Configure Your CI Provider](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/getting-started.md#configure-your-ci-provider) を参考に定義してみてください。



## GitHub Actions で実行

上記の設定ファイルを配置したら、コミットしてプッシュすると自動的に実行されます。
対象の GitHub リポジトリにブラウザでアクセスして「Actions」タブを開きます。

対象の実行ログを確認します。

![capture.png](https://i.gyazo.com/cde19cc3b005177f1c139caf9cb65715.png)

ログに出力されているURLにアクセスすると実行結果が見れます。便利ですね。

![storage.googleapis.com_lighthouse-infrastructure.appspot.com_reports_1604273442330-16003.report.html.png](https://i.gyazo.com/d414873c1b2d3684d177b7ff1dd1eed4.png)

`temporary-public-storage` はコストを掛けず Web 上で結果を確認できる便利な方法ですが、 [数日でアクセスできなくなる](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#target) ようなので継続的に結果を確認したい場合は注意が必要です。

今回は Lighthouse CI Server というサーバーを Heroku 上で動かしてみたいと思います。
（ちなみにファイルシステムに保存することもできるようなので、頑張って自前で処理する方法こともできそうです）



## Lighthouse CI Server (LHCI Server) を Heroku で動かす

丁寧に Heroku で動かす [公式ドキュメント](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/recipes/heroku-server/README.md) が準備されているので、ドキュメントに従ってコマンドを実行してみてください。
コマンド実行だけで LHCI Server を Heroku で簡単にデプロイできます。
（事前に [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) のセットアップされている必要があります）

実行したら、アクセスしてみましょう。
以下の画面が表示されれば一旦OKです。

![pacific-fortress-21791.herokuapp.com_app_projects.png](https://i.gyazo.com/9c88241edfd663ed4b003812294e9128.png)

後の設定で URL を使いますので、メモしておきましょう。



## Lighthouse CI (LHCI) の結果を Lighthouse CI Server (LHCI Server) にアップロードする

まずはプロジェクトのセットアップをします。
計測対象のリポジトリルートに移動して、以下のコマンドを実行します。

```bash
$ lhci wizard
```

ウィザードに従って、Heroku の URL (ドメインまで) やプロジェクト名、対象ブランチなどを設定してください。

![lhci.gif](https://i.gyazo.com/391f777e490dd5241a97499ec27bb6a8.gif)

ビルドトークン (`build token`) と管理トークン (`admin token`) という２種類のトークンが表示されます。
ビルドトークンはビルド結果をアップロードする際に使用するトークンで、公開しても問題ないようです。
管理トークンはプロジェクトの設定などに使用するトークンで **公開しないでください**。
詳しくは、公式ドキュメントをご覧ください。

[lighthouse-ci/server.md at master · GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/server.md#build--admin-tokens)

設定ができたら、Heroku にデプロイした LHCI Server にアクセスしてみましょう。
設定したプロジェクトが表示されているはずです。

![pacific-fortress-21791.herokuapp.com_app_.png](https://i.gyazo.com/385b33bf958eaa97bd7af531bab0866e.png)

プロジェクトのリンクをクリックしても、まだ結果がアップロードされていないので空になっています。

![pacific-fortress-21791.herokuapp.com_app.png](https://i.gyazo.com/5eea4da7821ea9b778fb95dc8e4a02bf.png)

次で実際に Lighthouse CI から結果をアップロードするようにしましょう。



## Lighthouse CI Server (LHCI Server) で結果の履歴や差分を見る

いよいよ LHCI Server へアップロードする設定をしましょう。

`.lighthouserc.js` を以下のように変更します。

```diff
        staticDistDir: "./",
      },
      upload: {
-       target: "temporary-public-storage",
+       target: "lhci",
+       serverBaseUrl: "(Heroku にデプロイした LHCI Server のURL。パスは不要 (例: https://xxxxxxxxx.herokuapp.com))",
+       token: "(ビルドトークン)",
      },
    },
  };
```

後はコミット＆プッシュして、GitHub Actions が実行完了するのを待ちます。

正常に実行完了したら、LHCI Server の画面を更新してみましょう。
1つだけですが、結果が追加されているのが確認できると思います。

![pacific-fortress-21791.herokuapp.com_app_projects_memo-6_dashboard.png](https://i.gyazo.com/d7ad07ba5f63dee9883e78454ea00a4a.png)

継続的に実行していくと、以下のようになっていきます。

![capture 1.png](https://i.gyazo.com/30fe9237817d78badcd1bfddf5fc4c38.png)

スコアにあまり変動がないですが、スコアの変動などをグラフで確認できたりします。

![capture 2.png](https://i.gyazo.com/957daabddd8538a93795d48c7b19a6c0.png)

前回とのスコアの Diff も見れたりします。
この辺りは、ぜひ実際にデプロイしてスコアの履歴をとって確認してみてください！


## GitHub Status Checks と連携する

[GitHub Status Checks](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/getting-started.md#github-status-checks) と連携することも可能です。
Pull Request ごとにスコアをチェックして、スコアを満たさない場合はマージをさせない、なんてこともできますね。

![image.png](https://i.gyazo.com/f2466fea877ddbefc33364d08d48bc29.png)

まず [GitHub Access Token](https://docs.github.com/ja/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) が必要になります。 
`repo:status` の権限を持ったアクセストークンを作成して [Secrets](https://docs.github.com/ja/free-pro-team@latest/actions/reference/encrypted-secrets) に `LHCI_GITHUB_APP_TOKEN` という名前で保存しておきます。

次に GitHubActions の定義ファイル ( `.github/workflows/(名前).yml` ) を次のように変更します。

```diff
 name: "(名前)"
 on: [push]
 jobs:
   lhci:
     name: Lighthouse
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v2
+        with:
+          ref: ${{ github.event.pull_request.head.sha }}
       - uses: actions/setup-node@v1
         with:
           node-version: 12
       - name: build
         run: echo '必要なビルドステップがあればここに記述する'
       - name: run Lighthouse CI
         run: |
           npm install -g @lhci/cli@0.6.x
           lhci autorun
+        env:
+          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

あとは設定ファイル ( `.lighthouserc.js` ) にアサーションの定義を追加します。

```diff
 module.exports = {
   ci: {
     collect: {
       staticDistDir: "./",
     },
     upload: {
       target: "temporary-public-storage",
     },
+    assert: {
+      preset: 'lighthouse:recommended',
+    },
   },
 };
```

`'lighthouse:recommended` は予め定義されているアサーションの定義セットです。
とりあえず動かすことができますが、結構チェックが厳しいので必要に応じて [設定を変更する](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#assert) いく必要が出ると思います。
もちろんなしでできるのならそれに越したことはないですが・・・。

最後に GitHub の [ブランチ保護](https://docs.github.com/ja/free-pro-team@latest/github/administering-a-repository/configuring-protected-branches) の設定でデフォルトブランチはこのチェックのパスを必須にするようにすればOKです。

個人的にやってみましたが、GitHub Status Checks との連携はある程度 Lighthouse CI のスコアが安定して、維持すべきスコアが分かってから導入したほうが良いなー、と感じました。



## おわりに

`GitHub Actions` と `Heroku` を使うことで、まずは無料で Lighthouse のスコアを継続的にモニタリングしていくことができとても便利です。

Lighthouse を使い Web パフォーマンスを最適化して、より良いユーザー体験につなげていきたいですね。

