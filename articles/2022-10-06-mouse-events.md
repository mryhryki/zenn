---
title: "\"JavaScriptで検知できるマウスのイベントについて調べた\""
emoji: "🖱"
type: "tech"
topics:
  - "JavaScript"
published: true
canonical: "https://zenn.dev/mryhryki/articles/2022-10-06-mouse-events"
---

# はじめに

久しぶりに JavaScript でマウスイベントを検知してゴニョゴニョやるコードを書いていたら「どういう時に発火するんだっけ？」がちょっと曖昧になっていました。
一回調べ直したメモがこの記事になります。

MDN に記載のあった以下の7イベントについて調べました。

![Element events on MDN](https://mryhryki.com/file/UT8nQgo1R1rcMZjQQqHDc_UJtfYDvUN_n7L6_4grA97J6od4.jpeg)

https://developer.mozilla.org/ja/docs/Web/API/Element

# 検証に使ったHTML

簡単に動作を確認できるページを、以下のURLに用意して検証しました。
疑問点があれば、こちらを試すとわかりやすいかと思います。

https://mryhryki.com/experiment/mouse-events.html

中身は、検証したいイベントごとに親要素と子要素で1セットとなる構造にしています。

![structure](https://mryhryki.com/file/UT8Ua-wzTRizEayMO2f62r2TecfSgP9b6kzV47hN4OdZ1yq8.jpeg)

親要素に対して `addEventListener()` を設定してイベントを検知し、イベントが発火するとその時点のマウス座標を表示するようにしています。

# 検証

## mousedown

> ポインティングデバイスのボタンが要素上で押されたときに発行されます。 onmousedown プロパティからも利用できます。

マウスがクリックされた時に発火するイベントです。
`mouseup` との違いは、ボタンが押された時点で発火する点です。

![mousedown_event.gif](https://mryhryki.com/file/UT8W2w1Benv9_i5N2fsnpl4SJmFpR9FfSvGX8FRCPAdO6Rsc.gif)

## mouseup

> ポインティングデバイスのボタンが要素の上で離されたときに発行されます。 onmouseup プロパティからも利用できます。

マウスがクリックされた時に発火するイベントです。
`mousedown` との違いは、ボタンが押されて戻った時点で発火する点です。

![mouseup_event.gif](https://mryhryki.com/file/UT8W2zncguXlppLVHKLMen5TgdqlNyDbiDZf_bAMMuSOAkDg.gif)

## mouseenter

> ポインティングデバイス（ふつうはマウス）が、リスナーが割り当てられた要素の上へ移動したときに発行されます。 onmouseenter プロパティからも利用できます。

その要素にマウスのカーソルが入った時に発火するイベントです。

![mouseenter_event.gif](https://mryhryki.com/file/UT8W2Nmq0k_X6cCH86JKEeNrGBfkABBrtyoS5fG_jxYQs5mY.gif)

## mouseover

> ポインティングデバイス（ふつうはマウス）が、リスナーが割り当てられた要素またはその子要素の上を移動したときに発行されます。 onmouseover プロパティからも利用できます。

`mouseenter` に似ていますが、子要素に出入りしたタイミングでも発火するのが違います。

![mouseover_event.gif](https://mryhryki.com/file/UT8W2AsHIcRAZ2wMXLKzDSR4YxFTMLGhcfwAZADBTfot53MI.gif)

## mouseleave

> ポインティングデバイス（ふつうはマウス）が、リスナーが割り当てられた要素の外へ移動したときに発行されます。 onmouseleave プロパティからも利用できます。

その要素からマウスのカーソルが出た時に発火するイベントです。

![mouseleave_event.gif](https://mryhryki.com/file/UT8W25s_LKPazsftsdEKtfUgqMyn-6rImbnMKSqZXgxWtvI8.gif)

## mouseout

> ポインティングデバイス（ふつうはマウス）が、リスナーが割り当てられた要素またはその子要素の外へ移動したときに発行されます。 onmouseout プロパティからも利用できます。

`mouseleave` に似ていますが、子要素に出入りしたタイミングでも発火するのが違います。

![mouseout_event.gif](https://mryhryki.com/file/UT8W2gQgWYNapdF1bANOO3neMBrUOn8hhcgbfiMJPM5WmfDw.gif)

## mousemove

> ポインティングデバイス（ふつうはマウス）が、要素の上を移動したときに発行されます。 onmousemove プロパティからも利用できます。

要素上でマウスカーソルが移動した場合に発火するイベントです。

![mousemove_event.gif](https://mryhryki.com/file/UT8W2YcIwavTkAHJmndmPRgp3Sgeew2igLPA8X4BlAgHcWCI.gif)

