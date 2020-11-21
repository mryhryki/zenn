---
title: "Service Worker メモ"
emoji: "🚚"
type: "tech"
topics: ["Web","Service Worker"]
published: true
---
※この記事は[はてなブログ](https://hyiromori.hateblo.jp/entry/2020/10/09/181120)から引っ越しました
※2018年7月頃に書いていたものを発掘して再掲したものなので、情報が古い可能性があります。

## Service Worker とは？

- ブラウザの仕様
- Web ページとは「別」のライフサイクルを持つ typescript の実行環境。
- `https` or `localhost` でしか動作しない

## Service Worker でできること

- `fetch` イベントに介入（キャッシュなどのコントロールが出来る）
- プッシュ通知
- バックグランド同期

ネイティブアプリでないと難しかったことが、Webアプリでも出来るようになってきた印象ですね！
まだ、機能によっては対応しているブラウザが少ないですが、この流れが進むと、Webアプリでもネイティブアプリとほぼ同等のことが出来るようになってくると思います。

## Service Worker でできないこと

- DOMアクセス
    - `window` にはアクセスできません
    - Service Worker のソース内では `self` が Service Worker 自身を指すようです。

## Service Worker のライフサイクル

### INSTALLING

- Service Worker の登録が開始された状態

### INSTALLED

- Service Worker の登録が完了した状態

### ACTIVATING

- インストールされた Service Worker が有効になる段階

### ACTIVATED

- Service Worker が有効に機能している状態
- この段階から `fetch` イベントなどへの介入が出来るようになる

### REDUNDANT

- Service Worker が無効になった状態
- 通常、新しい Service Worker に置き換えられた時ぐらい？

## Service Worker で使用できるイベント

### install

- `INSTALL` 時に呼び出される
- 試してみたところ、このコールバックでの戻り値、例外は Service Worker のライフサイクルには影響しないっぽい？

### activate

- `ACTIVATED` 時に呼び出される
- 試してみたところ、このコールバックでの戻り値、例外は Service Worker のライフサイクルには影響しないっぽい？

### message

- 不明（未調査）

#### fetch

- 何らかのリクエストが飛んだ時に介入するためのイベント
- `Cache API` を使用して、コントロールすることが出来るようになる。

#### sync

- バックグラウンド同期用のイベント
- Webページ側で登録しておくと、オンラインになった時点で発火する
    - オンライン状態で登録すればすぐに発火する
    - 逆にいえば、オフライン状態だと永遠に発火しない

#### push

- プッシュ通知が飛んできた時のイベント
- 通知メッセージの表示とかはカスタマイズできる
- メッセージを表示させず、バックグランドで何らかの処理を走らせることもできそう（未検証）

## サンプルソース

`TypeScript` チャレンジ中！（要するに、あまり慣れていないです😓）

### `index.html` とかの記述例

```html
<script type="text/typescript">
  if (navigator.serviceWorker) {
    navigator.serviceWorker
             .register('/service_worker.js')
             .then((registration) => { // 登録成功
               console.log('scope:', registration.scope);
             })
             .catch((error) => { // 登録失敗
               console.log('failed: ', error);
             });
  }
</script>
```

### `/service_worker.js` の記述例（抜粋）

```typescript
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    // インストール処理後に実行したい処理
  );
});

self.addEventListener('fetch', (event: any) => {
  // fetch イベント時に介入したい処理
});
```

## Cache API ([利用できるブラウザ](https://caniuse.com/#feat=serviceworkers))

１度 `fetch` に成功したものはキャッシュし、２度目以降はキャッシュを返す例

```typescript
self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    async () => {
      // キャッシュがあった場合は、キャッシュの内容を返す。
      const cacheResponse = await caches.match(event.request);
      if (cacheResponse) {
        return cacheResponse;
      }

      // request を複製する（ストリームは再利用できないので）
      const fetchRequest = event.request.clone();
      const fetchResponse = await fetch(fetchRequest);

      // レスポンスが正しくない場合はそのまま返却
      if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
        return fetchResponse;
      }

      // response を複製する（こちらも同じくストリームは再利用できないので）
      const responseToCache = fetchResponse.clone();
      const cache = await caches.open(CacheName);

      // cache に登録する
      cache.put(event.request, responseToCache);
      return fetchResponse;
    }
  );
});
```

[The offline cookbook](https://jakearchibald.com/2014/offline-cookbook/) というサイトに様々なパターンの例があり、とても参考になる。

### Push API ([利用できるブラウザ](https://caniuse.com/#feat=push-api)）

#### Webページ側（プッシュ通知の登録処理）

```typescript
const registerPushNotification = async () => {
  if (navigator.serviceWorker && window.PushManager) {
    const swRegistration = await navigator.serviceWorker.register('/service_worker.js');
    console.log('ServiceWorker is registered', swRegistration);
    // サーバから渡された公開鍵をバイト配列に変換します
    const applicationServerKey = urlB64ToUint8Array(publicKey);
    await swRegistration.pushManager.getSubscription();
    const params = { userVisibleOnly: true, applicationServerKey };
    // この段階でブラウザからプッシュ通知の許可ウィンドウが表示されます。
    const subscription = swRegistration.pushManager.subscribe(params);
    // プッシュ通知に必要な情報が subscription に入っています。（不許可の場合は何も入っていません）
    console.log('User is subscribed:', subscription);
  }
};
```

#### Service Worker 側

```typescript
self.addEventListener('push', (event: any) => {
  const dataText = event.data.text();
  const title = 'Push Test';
  const options = { body: dataText };
  event.waitUntil(self.registration.showNotification(title, options));
});
```

### Background Sync API ([利用できるブラウザ](https://caniuse.com/#feat=background-sync))

- 使えるブラウザが少ない（今のところChromeのみ）
- 登録しておけば勝手に同期してくれる訳ではない（ハマった・・・）
- 同期に必要な情報（HTTPメソッド、パス、パラメータなど）は `IndexedDB` と使って渡す必要がある（結構面倒だった）
    - `LocalStorage` は使用できない（[MDN - サービスワーカーの使用](https://developer.mozilla.org/ja/docs/Web/API/ServiceWorker_API/Using_Service_Workers) にも「メモ: localStorageはサービスワーカーキャッシュと同じように動作しますが、同期処理のため、サービスワーカー内では許可されていません。」と記述があった)
- 同期に限らず、オフラインからオンラインになった時にやりたい処理なども登録しておくことも出来ます。

#### IndexedDB の定義（[Dexie](http://dexie.org/) というライブラリを使用しています）

結構ソースが大きくなってしまった。
とりあえず、こんな感じで `IndexedDB` の登録＆取得処理を書いているんだな、という雰囲気だけ感じ取ればよいかと思います。

```typescript
import Dexie from 'dexie';

const DB_VERSION: number = 1;
const now = (): number => (new Date()).getTime();

interface BackgroundSyncRow {
  id?: number,
  path: string,
  body: string,
  result: string,
  createdAt?: number,
}

class BackgroundSyncDatabase extends Dexie {
  public backgroundSync!: Dexie.Table<BackgroundSyncRow, number>;

  public constructor() {
    super('BackgroundSyncDatabase');
    this.version(DB_VERSION)
        .stores({ backgroundSync: '++id,path,body,result,createdAt' });
  }
}

const db = new BackgroundSyncDatabase();

const addBackgroundSyncRow = (row: BackgroundSyncRow): Promise<number> => db
  .transaction('rw', db.backgroundSync, async () => {
    const createdAt: number = now();
    const _row: BackgroundSyncRow = { ...row, createdAt };
    return await db.backgroundSync.add(_row);
  });

const updateBackgroundSyncRow = (
  id: number,
  row: BackgroundSyncRow,
): Promise<void> => db
  .transaction('rw', db.backgroundSync, async () => {
    await db.backgroundSync.update(id, row);
  });

const getBackgroundSyncRow = (id: number): Promise<BackgroundSyncRow | null> => db
  .transaction('r', db.backgroundSync, async () => {
    const results = await db.backgroundSync.where({ id });
    const count: number = await results.count();
    return count === 1 ? results.first() : null;
  });

const getBackgroundSyncRows = (limit: number = 30): Promise<Array<BackgroundSyncRow>> => db
  .transaction('r', db.backgroundSync, async () => {
    return await db.backgroundSync
                   .orderBy('createdAt')
                   .reverse()
                   .limit(limit)
                   .toArray();
  });

export {
  addBackgroundSyncRow,
  getBackgroundSyncRow,
  getBackgroundSyncRows,
  updateBackgroundSyncRow,
};
```

#### Webページ側（バックグラウンド同期の登録処理）

```typescript
const backgroundSyncTest = async () => {
  const syncData = {
    path: '/api/v1/echo/test',
    body: JSON.stringify({ test: 'OK' }),
    result: '',
  };
  const id: number = await addBackgroundSyncRow(syncData);
  const tag: string = `background-sync:${id}`;
  const swRegistration = await navigator.serviceWorker.ready;
  swRegistration.sync.register(tag);
};
```

#### Service Worker 側

```typescript
self.addEventListener('sync', async (event: any) => {
  if (event != null && typeof event.tag === 'string') {
    if (event.tag.match(/^background-sync:\d+$/)) {
      const id: number = parseInt(event.tag.substr(16), 10);
      const syncData = await getBackgroundSyncRow(id);
      const { path, body, result } = syncData;
      if (result === '') {
        const response = await fetch(path, { method: 'POST', body });
        syncData.result = await response.text();
        await updateBackgroundSyncRow(id, syncData);
      }
    }
  }
});
```

## App Cache（参考）

これまでにあった、キャッシュの仕組みらしい。（使ったことは無いのであまり知らない）

### 機能

- ブラウザがキャッシュするファイルを指定して、キャッシュが出来る

### 問題点

- キャッシュの仕組みに問題がある
  - 動的に生成されるインデックスページ自体も必ずキャッシュされてしまうため、いろいろ厄介
  - 「こっちの方が便利だよね」という感じで入れたのが仇となったのか？（個人の意見です）
- セキュリティ的な問題がある
  - `HTTPS` じゃない場合に問題らしい

### App Cache と Service Worker との違い

- Service Worker はキャッシュ用のAPIが存在するが、キャッシュの方法については実装者に依存
- Service Worker の方がキャッシュの自由度が高く、また様々な介入が出来る

## 参考文献

- [Service Worker の紹介](https://developers.google.com/web/fundamentals/primers/service-workers/?hl=ja)
- [Service Worker のデバッグ](https://developers.google.com/web/fundamentals/codelabs/debugging-service-workers/?hl=ja)
- [Introducing Background Sync](https://developers.google.com/web/updates/2015/12/background-sync)
- [MDN - サービスワーカー API](https://developer.mozilla.org/ja/docs/Web/API/ServiceWorker_API)
- [MDN - サービスワーカーの使用](https://developer.mozilla.org/ja/docs/Web/API/ServiceWorker_API/Using_Service_Workers)
- [Qiita - Service Workerの基本とそれを使ってできること](https://qiita.com/y_fujieda/items/f9e765ac9d89ba241154)
- [Qiita - Service Workerってなんなのよ (Service Workerのえほん)](https://qiita.com/kosamari/items/5e2235d26eb339a33660)
- [Qiita - ServiceWorkerとCache APIを使ってオフラインでも動くWebアプリを作る](https://qiita.com/horo/items/175c8fd7513138308930)
- [Service Worker、はじめの一歩 - 第1回 Service Workerとは](https://app.codegrid.net/entry/2016-service-worker-1)
- [The offline cookbook](https://jakearchibald.com/2014/offline-cookbook/)
- [アプリケーション キャッシュを初めて使う](https://www.html5rocks.com/ja/tutorials/appcache/beginner/)
- [攻撃シナリオを使って解説するApplicationCacheのキャッシュポイズニング](https://html5experts.jp/kyo_ago/5153/)
