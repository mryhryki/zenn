---
title: "Google のターゲティング広告関連の新しい提案「The Topics API」について調べた"
emoji: "🔒"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["privacy","google","web"]
published: false
---


# はじめに

「The Topics API」は Google が提唱する「プライバシーサンドボックス」の一連の提案の１つで、ユーザーの関心が高い広告を配信するために使用する API です。
もともと提案されていた FLoC へのフィードバックを受けて新たに提案されています。
The Topics API はまだ提案段階で変わる可能性も十分ある点をご注意ください。

正確な情報は [提案のリポジトリ](https://github.com/jkarlin/topics) や [Chrome Developers](https://developer.chrome.com/docs/privacy-sandbox/topics/) を参照してください。
本記事では The Topics API の理解を助けるための概要や参考情報を提供することを目的に書いています。



# FLoC の概要と課題

FLoC は、ユーザーを追跡することなく、ターゲティング広告（ユーザーの興味に応じた広告）を配信するための提案でした。
ざっくりいうと、興味が似たユーザーをグループ（コホート）化することで、プライバシーを重視しつつ、広告効果も維持していくものでした。
ちなみにコホートは数千人単位で作られるので、個人を特定しにくいという理論によるものでした。

しかしながら、これはいくつか問題がありました。

1. 他のAPIなどの情報と組み合わせることで、従来よりも容易に個人を特定しやすくなる
2. コホートから、どういった人物か（例：年代、性別、人種など）を特定することができる
3. 別の手段でユーザーを一意に識別することができる場合、ユーザーの関心の変化を知ることができる

※詳しくは [Googleに騙されてはいけない：FLoCは邪悪なアイデアである](https://p2ptk.org/privacy/3290) などが参考になります。
（電子フロンティア財団の [Google’s FLoC Is a Terrible Idea](https://www.eff.org/deeplinks/2021/03/googles-floc-terrible-idea) という記事の翻訳記事です)）

こういった課題があり、批判やブラウザベンダーなどの不参加表明が相次いだことから FLoC に代わる The Topics API を出したものと思われます。

ちなみに Chrome は2022年中に Topics API の実験をする予定で、また FLoC の開発は停止しているとのことです。

> Chrome intends to experiment with the Topics API in 2022 and is no longer developing FLoC.
https://privacysandbox.com/timeline/


# The Topics API の概要

- https://developer.chrome.com/docs/privacy-sandbox/topics/ を中心に見ています。
- FLoC と同じく、ユーザーを追跡することなく、ターゲティング広告（ユーザーの興味に応じた広告）を配信するための仕組み
- トピック一覧の選定
    - センシティブなトピックを除外するため、トピックの一覧は人の手で管理してくよう
    - 最初はテスト用にChromeによって分類するが、信頼できる貢献者によってトピックを維持するを目標としている。
    - 現状は [350](https://github.com/jkarlin/topics/blob/main/taxonomy_v1.md) のトピックが提案されていて、将来的には数百から数千になる想定。
- ウェブサイトとトピックの紐付け
    - ホスト名とトピックを紐付ける
    - 機械学習でホスト名とトピックを紐付けるモデルを作る計画のよう
    - モデルはブラウザとともに配布され、オープンに開発され、自由に使用することができる
- ユーザーとトピックの紐付け
    - エポック(epoch)と呼ばれる期間の単位（現在の提案では１週間）の閲覧履歴をベースに、上位５つのトピックからランダムに決定される
    - 将来的にプライバシー強化のため、5%の確率でトピック一覧からランダムに選ばれることも検討されているよう
- Topics API の呼び出し
    - 直近3エポックのトピックが取得できる

# Topics は何を解決するのか？

## Third-Party Cookie との比較

## FLoC との比較

# おわりに
# 参考リンク

