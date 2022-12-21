---
title: Promise.race で最初に返された Promise 以外の Promise はどう扱われるのか調べる
---

## はじめに

タイトルの通り [Promise.race](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) が最初に返された Promise 以外の Promise はどう扱われるかどうなるかちょっと気になったので試してみました。

## サンプルコード

```javascript
// sample.js
const wait = (message, ms) => new Promise((resolve) => {
  console.log(`START: ${message}`)
  setTimeout(resolve, ms)
})

Promise.race([
  wait('Promise-1', 2000).then(() => console.log('END: Promise-1')),
  wait('Promise-2', 3000).then(() => console.log('END: Promise-2')),
  wait('Promise-3', 1000).then(() => console.log('END: Promise-3')),
]).then(() => {
  console.log('END: Promise.race()')
})
```

## 結果

最初に返された Promise 以外の Promise も解決するまで実行される。

```shell
$ node sample.js 
START: Promise-1
START: Promise-2
START: Promise-3
END: Promise-3
END: Promise.race()
END: Promise-1
END: Promise-2
```

## おわりに

当然といえば当然の結果ですが、最初の Promise が返ってきても、他の Promise も中断されずそのまま実行されます。
それで不具合が起きるようなケースは何らか停止する手段を用意する必要がありそうですね。

`fetch` であれば `AbortController` とかを使えますが、通常の Promise の場合は自分で実装するしかなさそう。
