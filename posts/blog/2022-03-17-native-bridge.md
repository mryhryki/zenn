---
title: iOS/Android と WebView でデータを連携する仕組みを作りました
canonical: https://tech.connehito.com/entry/2022/03/17/094422
---

## はじめに

こんにちは！ フロントエンドエンジニアの [もりや](https://mryhryki.com/) です。

今回は、ママリアプリ内で iOS/Android と WebView 間でデータを連携する仕組みを作った事例を紹介します。
2021年6月頃に実装してリリースし、現在（2022年3月）も問題なく使えています。

## データの連携を使いたい場面

ママリの場合、例えば以下のような場面で使っています。

- 【WebView → iOS/Android の例】
  - WebView で作った入力画面で編集中の時に、閉じるボタンを押した場合は iOS/Android 側で確認ダイアログを出す
- 【iOS/Android → WebView の例】
  - iOS/Android 側で処理を行った後で、WebView 側で何らかのアクションを行いたい場合

それまではその場その場で対応していましたが、これらを共通で便利に扱うための仕組みをそろそろ作りたいね、という話がでてきたので実装をしました。


## JavaScript (TypeScript) での実装方法

### WebView → iOS/Android の連携

この場合は `window.mamariq.state` という名前空間を用意して、iOS/Android からそこを参照してもらう形にしました。

```typescript

window.mamariq = {
  state: {
    PAGE: {       // ページごとに名前空間を作る
      KEY: VALUE, // 参照してもらいたい値を入れる
    }
  }
}
```

状態が変わったら、その値を更新していきます。
`React` の場合は、以下のように `useEffect` で更新するようにする実装が多いです。

```typescript
useEffect(() => {
  window.mamariq.PAGE.KEY = value
}, [value])
```

あとは iOS/Android から必要な時にセットされている値を見にいけばOKです。

（iOS/Android での実装方法は「iOS/Android からの呼び出し方」の章を参照してください）

#### 補足1: WebView からプッシュしたい場合

上記の方法は、状態を参照して処理するタイミングが iOS/Android 側で決めるものなので、すぐに iOS/Android へ状態を伝えたい場合には使えません。
そういった用途は（ページ遷移を伴わない）専用のディープリンクを作って対応しています。


#### 補足2: iOS の一般的なやり方

ちなみに iOS でプッシュする場合あれば、以下のやり方が一般的だそうです（[yanamura](https://twitter.com/yanamura_) からお聞きしました）

[【Swift】WKWebViewでJavaScriptのコールバックを受けつける（WKUserContentControllerの使い方）](https://qiita.com/rc_code/items/8928bf134a1568015ffe)

ただ、このやり方だと iOS と Android で方式を変えないといけないので、共通で使えるやり方を考えました。


### iOS/Android → WebView の連携

この場合は `window.mamariq.action` という関数を用意しておき、iOS/Android から呼び出してもらう形にしました。
また、UI側では必要なシーンでリスナーを登録しておき、イベントの内容に応じて処理を登録する、という形にしています。

ざっくりと以下のような構造になっています。

```
+-----------------------+
|     iOS/Android       |
+-----------------------+
           |
           | イベント発行
           v
+-----------------------+
| window.mamariq.action |
+-----------------------+
           |
           | イベント発行
           v
+-----------------------+
|       listeners       |
+-----------------------+
          ^  |
 登録/削除 |  | イベント発行
          |  v
+-----------------------+
|        UI (React)     |
+-----------------------+
```

#### リスナーの管理・登録・削除

リスナーは以下のような型定義になっています。
`type` というイベントを識別するキーと、必要な場合は（iOS/Android 側で）`payload` に情報を詰めて呼び出してくれます。

```typescript
// リスナーに渡されるイベントの型定義
export interface MamariqBridgeEvent {
  type: string
  payload: ObjectType
}

// リスナーの型定義
type MamariqBridgeEventListener = (event: MamariqBridgeEvent) => void
```

リスナーを管理する配列と、それに追加・削除をするための関数を用意しておきます。

```typescript
// リスナーを管理する配列
let listeners: MamariqBridgeEventListener[] = []

// リスナーを削除する関数
export const removeMamariqEventListener = (listener: MamariqBridgeEventListener): void => {
  listeners = listeners.filter((_listene) => _listener !== listener)
}

// リスナーを追加する関数
export const addMamariqEventListener = (listener: MamariqBridgeEventListener): void => {
  removeMamariqEventListener(listener) // 重複登録を避けるため、念の為一度削除する（通常は何も起こらない）
  listeners.push(listener)
}
```

#### window.mamariq.action

iOS/Android からイベントを受け取るための関数を定義しておきます。

```typescript
window.mamariq = {
  action: (event: unknown): void => {
    const type = `${checkObject(event).type ?? '(unknown)'}`
    const payload = checkObject(checkObject(event).payload) ?? {}
    listeners.forEach((listener) => listener({ type, payload }))
  }
}
```

`checkObject` はオブジェクト型であるかを確認して、違う型であっても必ずオブジェクト型で返してくれる関数です。

```typescript
type ObjectType = { [key: string]: unknown }
const checkObject = (target: unknown): ObjectType => {
  if (typeof target === 'object' && target != null && !Array.isArray(target)) {
    return target as ObjectType
  }
  return {}
}
```

#### React からのリスナーの登録・削除

実際に使用する側では、`useEffect` を使ってこういう感じで実装してます。

```typescript
useEffect(() => {
  const receiveMamariqBridgeEvent = (event: MamariqBridgeEvent): void => {
    switch (event.type) {
      case 'EVENT_TYPE':
        // do something
        break
    }
  }
  addMamariqEventListener(receiveMamariqBridgeEvent)
  return () => removeMamariqEventListener(receiveMamariqBridgeEvent)
}, [])
```

そのコンテキストで必要なイベントのみハンドリングするようにしておくことで、リスナーを複数登録したり新しいイベントを追加した場合でも問題が起きにくくしています。


### この実装のメリット

iOS/Android で同じ形でできることが一つのメリットかな、と思います。

また DevTools のコンソールを使って、実機を繋がなくてもブラウザ単体で動作確認ができるのも一つのメリットだと思います。
（他の方法はあまり知りませんので、推測です）

```typescript
// 現状のステートを確認できる
console.log(window.mamariq.state.PAGE.KEY)

// iOS/Android からイベントが来た場合の動作を確認できる
window.mamariq.action({ event: "EVENT_TYPE"})
```


## ハマったところ

### iOS で boolean が数値扱いされる

iOS の場合、boolean値 (`true`, `false`) が何故か `0`, `1` の数値として取得できてしまうとのことでした。
その原因はわかりません・・・。
（知っている方いましたらコメントいただけると嬉しいです）

今回は、それぞれ文字列 (`"true"`, `"false"`) とすることで対応しました。


## iOS/Android からの呼び出し方

[yanamura](https://twitter.com/yanamura_) と [tommykw](https://twitter.com/tommykw) にご協力頂き、それぞれの OS での実装箇所を抜粋しました。

### iOS での呼び出し方

#### 状態の読み取り

`window.mamariq.xxx` のデータを以下のように取得します。

```swift
webView
    .evaluateJavaScript(
        "window.mamariq.xxx"
    ) { [weak self] result, _ in
        if let result = result as? String, result == "true" {
            // do something
        } else {
            // do something
        }
    }
```


#### イベントの発行

`window.mamariq.action()` で以下のようにイベントを発行します。

```swift
let params: [String: Any] = [
    "type": "xxx",
    "payload": [
        "yyy": "zzz"
    ],
]
do {
    let data = try JSONSerialization.data(withJSONObject: params, options: [])
    guard let stringValue = String(data: data, encoding: .utf8) else {
        assertionFailure()
        return
    }
    contentViewController.webView.evaluateJavaScript(
        "window.mamariq.action(\(stringValue))"
    ) { _, _ in }
} catch {
    // do something
}
```

### Android での呼び出し方

#### 状態の読み取り

`window.mamariq.xxx` のデータを以下のように取得します。

```kotlin
// データバインディングを利用
binding.webView.evaluateJavascript("window.mamariq.xxx") { result ->
    if (result == "true") {
        // do something
    } else {
        // do something
    }
}
```


#### イベントの発行

`window.mamariq.action()` で以下のようにイベントを発行します。

```kotlin
// データバインディングを利用
binding.webView.evaluateJavascript("window.mamariq.action({type:'xxx'})") {}
```

## おわりに

既に実装して8ヶ月以上が経ち、本番環境でも使っていますが、現状では特に問題なく使えています。
やっていることがシンプルなので、あまり不具合が起きにくいというのもあるかもしれません。

この仕組みを作っておいたおかげで、iOS/Android と WebView でデータを連携する時に実装方法に迷うことがなくなり、実装に集中できるようになりました。
最初が少し面倒ですが、早めにやっておくとコスト的にペイできたな〜、と思っています。


## PR

コネヒトではエンジニアを募集しています！

[https://hrmos.co/pages/connehito/jobs/00e:embed:cite]
