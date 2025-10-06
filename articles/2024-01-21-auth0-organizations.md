---
title: "Auth0 Organizations  メモ"
emoji: "0️⃣"
type: "tech"
topics:
  - "Auth0"
published: true
canonical: "https://zenn.dev/mryhryki/articles/2024-01-21-auth0-organizations"
---

## はじめに

ここ１ヶ月ほど、業務で SSO (Single Sign-On) やマルチテナントを実現するため Auth0 Organizations の機能を調査していました。
そこで得た Auth0 Organizations についての情報をまとめたメモです。

### この記事の目的

私の探し方が悪いのかもしれませんが、Auth0 の公式ドキュメントを読んでも挙動などのイメージがつきにくく、触ってみないとよくわからないなと思う点もありました。
ですので、Auth0 Organizations のイメージや挙動をメインに書こうと思います。

想定読者としては、これから Auth0 Organizations を触る方や、未来の自分です。

### おことわり

前述の通り、Auth0 Organizations とはどういったものなのかや、動作のイメージを掴んでもらうことを目的として書いています。

公式ドキュメントをまとめたようなものではないので、ご注意ください。
最新の正確な Auth0 Organizations の機能については、公式ドキュメントを参照してください。

まだ調査した段階で、実際に使って運用しているわけではないので、その点もご注意ください。
間違いや新たにわかったことがあれば、追記するかもしれません。

## Auth0 Organizations とは

ユーザーを組織単位で管理する機能です。
この機能により、以下のようなことが実現できます。

- 組織単位でユーザーを管理することができる
- 組織単位でユーザーに対してロールを割り当てることができる（Auth0 の RBAC を使う場合）
- 組織ごとに異なるログイン方法を提供することができる
- １ユーザーで複数の組織にログインすることができる（いわゆるマルチテナント）

## Auth0 用語

### コネクション

コネクションは、ざっくり言うとユーザーの認証方法を定義したものと考えています。
大きく、以下の４種類があります。

- [Database Connections](https://auth0.com/docs/authenticate/database-connections)
  - Auth0 が提供する、ユーザーの認証情報などを保存するデータベースを使った認証
- [Social Connections for Partners](https://auth0.com/docs/customize/integrations/marketplace-partners/social-connections-for-partners)
  - Google や Facebook などのソーシャルアカウントを使った認証
- [Enterprise Connections](https://auth0.com/docs/authenticate/enterprise-connections)
  - SAML や OAuth などを使った認証
- [Passwordless Connections](https://auth0.com/docs/authenticate/passwordless)
  - SMS、メールを使った認証

Auth0 Organizations とは直接関係しませんが、組織単位でのログイン方法を検討する場合にコネクションを意識する必要があります。

### HRD (Home Realm Discovery)

HRD は、ユーザーにどのコネクションを使って認証させるかを判別するための Auth0 の仕組みです。
アプリケーション側で URL のドメインやパスなどを使って判別し Auth0 に連携することもできますが、Auth0 側で判別する仕組みもあります。

[Authentication (B2B)](https://auth0.com/docs/get-started/architecture-scenarios/business-to-business/authentication#home-realm-discovery)

Auth0 側で行う場合は、HRD をメールアドレスのドメインを使って判別します。
例えば、ユーザーがログイン画面で `user@org.example.com` のようなメールアドレスを入力した場合、`org.example.com` からどのコネクションでログインさせるべきかを Auth0 が判断します。

この設定は、Auth0 ダッシュボード内の「Authentication」→「Enterprise」→「Login Experience」→「Home Realm Discovery」で設定できます。

![Auth0 Dashboard: Set HRD settings](https://mryhryki.com/file/20240107212421-EMFmNtI_GjPlvo5a1v_KBNMBtAtgbhKq8W5G3JQs78Y.png)

ただ、メールアドレスのドメインを使って判別するので、以下２点に注意する必要がありそうです。

- 違うコネクションなのに、同じメールアドレスのドメインを使っている場合は、判別できません。
- Auth0 は、複数のコネクションに同じメールアドレスのドメインを設定でき、どのコネクションと判別されるかのルールは（私が調べた限り）不明です。

実際に B2B でこういったケースがどのぐらい発生するかはわかりませんが、起きた場合にある組織に所属するユーザーはログインできない事象が起こるかもしれません。
そういったリスクやユースケースを考えて置く必要があります。



## 導入による影響：ログイン方法の変更

Auth0 Organizations を使い、組織ごとのログインを提供するには、ログイン方法を変更する必要があります。

Auth0 の Application 単位で、以下の設定を変更する必要があります。

- Type of Users
    - Individual
    - Organizations
    - Both
- Login Flows:
    - Prompt for Credentials
    - Prompt for Organizations
    - No Prompt

以下、それぞれについて解説します。

### Type of Users

ユーザーの種類は、以下の３つがあります。

- Individual
- Organizations
- Both

Auth0 Organizations を使用する場合は、Organizations か Both に設定します。

![Type of Users](https://mryhryki.com/file/20240121162817-oNSs1pRNJMapKRL8FHKDwwPs8SKESnuQ-cnNB9dStUQ.webp)

#### Individual

個人ユーザーのみを対象とするパターンです。
これは初期設定で、Auth0 Organizations を意識せず使っている場合はこれになっていると思います。

これを選択した場合 Login Flows は使用しないため、選択肢が表示されません。

#### Organizations

組織に所属するユーザーのみを対象とするパターンです。

#### Both

Individual と Organizations の併用するパターンです。



### Login Flows

Type of Users が Organizations か Both の場合には、ログイン方法を変更する必要があります。
ログイン方法は、以下の３つがあります。

- Prompt for Credentials
- Prompt for Organizations
- No Prompt

#### Prompt for Credentials

ログイン時に、まずメールアドレスを入力させる方法です。
メールアドレスをもとに、HRD で Auth0 がどのログイン方法を使用するか判定し、ユーザーにログインさせます。

#### Prompt for Organizations

ログイン時に Organization をユーザー自身に入力させる方法です。

Type of Users が Both の場合は使用することができません。
これは、Both は個人ユーザーも使用できるので、Organization を使わない場合に対応できないからだと思います。

#### No Prompt

Organization をアプリケーション側で決定し、Auth0 にパラメーターで渡す方法です。
アプリケーション側で何も指定せず、Auth0 のログイン画面に遷移させるとエラーになります。



## 検討時に考えておきたいこと

### ユーザーのログイン体験の変更に伴う影響

Auth0 Organizations を導入すると、何らかログイン体験が変更されてしまいます。
特に、アプリケーションが公開された後に Auth0 Organizations を導入する場合は、ユーザーの離脱につながる可能性があります。

例えば、Prompt for Organizations を使用する場合、ユーザーに Organization 名の入力を求めるので、ユーザーがログインを諦めるという可能性があります。

なるべく変更が出ないようにするのが理想ですが、技術的な制約もあるので、十分に影響を考慮し検討しておく必要があります。

### Prompt for Credentials における制約

HRD (Home Realm Discovery) はメールドメインによる制約があり、これをアプリケーションとしてどう考えるかが重要になります。

Prompt for Credentials を使用しても、パラメーターで Organization を指定しログインさせることも可能です。
ただし、その場合は Prompt for Credentials を使うメリットが薄れるので、何を実現したいのかを十分検討しておく必要があります。



## おわりに

Auth0 Organizations は、Auth0 が公式に提供している機能であり、B2B サービスを提供する際には素晴らしい機能だと思います。
特に SSO やマルチテナントは B2B サービスなら要望が多い機能だと思います。
しかしながらログイン体験の変更は、ユーザーの離脱にもつながりかねないので、慎重に検討する必要があります。

取れる選択した多いので、逆に悩むポイントも多く、将来的な思想も含め検討する必要があるので難易度が高いです。
全てのパターンや考慮事項を網羅するのは難しいので、この記事ではざっくりとまとめてみました。
どの方法がベストという決定打はなく、ユーザーのログイン体験と技術的な制約を考慮して、そのアプリケーションに最も適する方法を選択する必要があります。

最初に書いた通り、まだ調査した段階で、実際に使って運用しているわけではないので、その点ご注意ください。
また何かわかったことがあれば追記するかもしれません。
