import * as React from 'react';
import { Button } from '../../presenters/button';
import './style.scss';

const serviceWorker = ('serviceWorker' in navigator ? navigator.serviceWorker : null);
const indexedDb = ('indexedDB' in window ? window.indexedDB : null);

type SyncInfo = { id?: number, path: string, result: string, createdAt?: number }

interface Props {}

interface State {
  supportBackgroundSync: boolean,
  syncList: Array<SyncInfo>
}

class ServiceWorkerBackgroundSyncContainer extends React.Component<Props, State> {
  intervalId: (null | number) = null;
  db: (null | IDBDatabase) = null;
  state: State = {
    syncList: [],
    supportBackgroundSync: false,
  };

  componentWillMount(): void {
    if (indexedDb == null || serviceWorker == null) {
      return;
    }

    serviceWorker
      .ready
      .then((swRegistration) => {
        if ('sync' in swRegistration) {
          this.setState({ supportBackgroundSync: true });
        }
      });

    const dbOepnRequest: IDBOpenDBRequest = indexedDb.open('service_worker', 1);
    dbOepnRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      const options = { keyPath: 'id', autoIncrement: true };
      db.createObjectStore('background_sync', options);
      this.db = db;
    };
    dbOepnRequest.onerror = (error) => console.error('Failed:', error);
    dbOepnRequest.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };
  }

  componentDidMount(): void {
    this.reloadSyncList();
    this.intervalId = window.setInterval(this.reloadSyncList, 500);
  }

  componentWillUnmount(): void {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reloadSyncList = (): void => {
    if (this.db == null) {
      return;
    }
    const { syncList } = this.state;

    const transaction: IDBTransaction = this.db.transaction(['background_sync'], 'readwrite');
    transaction.onerror = (error) => console.error('Failed:', error);

    const request: IDBRequest = transaction.objectStore('background_sync')
                                           .getAll();
    request.onerror = (error) => console.error('Failed:', error);
    request.onsuccess = (event: Event) => {
      const newSyncList: Array<SyncInfo> = (event.target as any).result.reverse().slice(0, 30);
      if (newSyncList.length === 0) {
        return;
      }

      const differentLength: boolean = syncList.length !== newSyncList.length;
      const diffElement: (undefined | SyncInfo) = differentLength ? undefined :
                                                  newSyncList.find((element, index: number) => (
                                                    element.id !== syncList[index].id || element.result !== syncList[index].result
                                                  ));

      if (differentLength || diffElement != null) {
        this.setState({ syncList: newSyncList });
      }
    };
  };

  backgroundSyncTest = (): void => {
    if (serviceWorker == null || this.db == null) {
      return;
    }
    const syncData = {
      path: 'https://api.hyiromori.com/v1/uuid',
      result: '',
      createdAt: (new Date()).getTime(),
    };
    const transaction: IDBTransaction = this.db.transaction(['background_sync'], 'readwrite');
    transaction.onerror = (error) => console.error('Failed:', error);

    const request: IDBRequest = transaction.objectStore('background_sync')
                                           .add(syncData);
    request.onerror = (error) => console.error('Failed:', error);
    request.onsuccess = async (event: Event) => {
      const swRegistration = await serviceWorker.ready;
      if ('sync' in swRegistration) {
        const id: any = (event.target as IDBOpenDBRequest).result;
        const tag: string = `background-sync:${id}`;
        swRegistration.sync.register(tag);
        this.reloadSyncList();
      }
    };
  };

  render() {
    const { syncList, supportBackgroundSync } = this.state;

    return (
      <div id="service-worker-background-sync-container">
        <h1>Service Worker - Background Sync API</h1>
        <div id="product-summary">
          <h2>プロダクト概要</h2>
          <p>
            <strong>Service Worker</strong>の<strong>Background Sync API</strong>を使用して、
            ネットワーク切断時に待機し、ネットワーク再接続時に自動で同期処理が行われることを確認できます。
          </p>
        </div>

        <div id="experimental-product">
          <h2>動作確認の手順</h2>
          {supportBackgroundSync ? (
            <div>
              <ol>
                <li>インターネットから切り離します。（例：機内モードにする、Wi-FiをOffにする、LANケーブルを抜くなど）</li>
                <li>下の<strong>操作パネル</strong>の<strong>Background Sync Test</strong>をクリックします。</li>
                <li>下の<strong>操作パネル</strong>の<strong>同期結果</strong>に１行追加され<strong>Result</strong>欄が空であることを確認します。
                </li>
                <li>インターネットに接続します。</li>
                <li>下の<strong>操作パネル</strong>の<strong>同期結果</strong>の<strong>Result</strong>欄に同期結果が表示されることを確認します。
                </li>
              </ol>

              <h3>操作パネル</h3>
              <div className="frame">
                <Button onClick={() => this.backgroundSyncTest()}>
                  Background Sync Test
                </Button>
                <p>同期結果</p>
                <table>
                  <thead>
                    <tr>
                      <th className="table-id-column">ID</th>
                      <th>Path</th>
                      <th>Result</th>
                      <th>CreatedAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncList.map(syncData => (
                      <tr key={syncData.id}>
                        <td>{syncData.id}</td>
                        <td>{syncData.path}</td>
                        <td>{syncData.result || '-'}</td>
                        <td>{syncData.createdAt || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
             <p>お使いのブラウザは対応していないため、動作確認はできません。</p>
           )}
        </div>

        <div id="product-explanation">
          <h2>技術解説</h2>
          <h3>Background Sync API</h3>
          <p>
            <strong>Service Worker</strong>で提供されている<strong>API</strong>の一つで、
            ネットワークが有効な場合のみに発火するイベントが提供されます。
            ネットワークが無効な場合は、次に有効になった時点で発火されます。
          </p>
          <p>
            イベントが提供されるだけで、自動で同期を行う処理まで提供されているわけではないため、同期処理を実装する必要があります。
            タグという文字列情報しか受け渡しできないため、 `IndexedDB` に同期に必要な情報を保存して受け渡すのが一般的です。
          </p>

          <h3>IndexedDB</h3>
          <p>
            ブラウザに実装された<strong>RDBMS</strong>に似たデータベースシステムです。
            詳細は<a href="https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API">MDN</a>の解説が理解しやすいと思いますので、こちらをご覧ください。
          </p>
        </div>
      </div>
    );
  }
}

export { ServiceWorkerBackgroundSyncContainer };