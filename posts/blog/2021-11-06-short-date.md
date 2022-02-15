---
title: 日付をソートしやすくかつ短くするフォーマットを考えた
---

## はじめに

個人開発で、ファイルをアップロードした時に日付をプレフィックスにしてソートしやすくしつつ、なるべく短いテキストにしたい、ということをやった時のメモです。

## 求めているもの

ファイルをアップロードした時、ランダムな文字列の前に日付をつけて、ソートや何時頃アップロードしたのかを分かるようにしたいな、と思いました。

例: `20211106-RANDOM-CHARACTERS`

ただし、アップロードしたファイルはURLに組み込まれるので、なるべく日付部分を短くしたいな、って思いました。

例: `https://example.com/file/20211106-RANDOM-CHARACTERS`

つまり、日付のソート順を保ちつつ、短い文字列で日付を表現する方法がほしい、って感じでした。
既に存在する可能性もありますが、割と簡単にできそうだったので自分で方法を考えてみました。

## 検討した方法

日付の数字部分（例: 2021-11-06 なら「2021」「11」「06」）をそれぞれアルファベット含めた文字で表現すれば短くできそう、と思いました。
まぁ Base64 みたいな感じですね。
ただ UnixTime とかを (URL Safe な) Base64 にするだけだと、頭で変換するのは難しいので、こういう方法にしました。

実際にどうやるかと言うと「0-9」「A-Z」「a-z」(62種類) の文字を使い、それぞれの数を62で割った余りを当てはまる文字を割り当てる、というようにしました。
例えば「2021」なら以下のようになります。

1. 2021 % 62 = 37
    - :arrow_right: b
1. 2021 / 62 = 32 （小数点以下切り捨て）
    - :arrow_right: W
1. 結果: "bW"

## 出来上がったソースコード

こんな感じでできました。

```typescript
const Characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const numToShortText = (num: number): string => {
  const list = [];
  while (num >= Characters.length) {
    list.push(num % Characters.length);
    num = Math.floor(num / Characters.length);
  }
  list.push(num);
  return list.map((i) => Characters[i]).join("");
};
```

これを日付でやるとこんな感じになります。

```typescript
console.log(`${numToShortText(2021)}${numToShortText(11)}${numToShortText(6)}`)
// => bWB6
```

上記の例で出したURLも4文字短縮できました。

- Before: `https://example.com/file/20211106-RANDOM-CHARACTERS`
- After: `https://example.com/file/bWB6-RANDOM-CHARACTERS`

また、頑張れば見てちょっと考えれば月と日は分かるようになってます。
（年はちょっと難しいですが）

## おわりに

使う人がいるかどうかは分かりませんが、こういう考え方もあるんだな〜、ぐらいの参考にしてもらえれば。
