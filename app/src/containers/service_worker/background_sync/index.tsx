import * as React from 'react';
import { AbstractContainer } from '../../abstract_container';
import { Button } from '../../../presenters/button';
import './style.scss';

const serviceWorker = ('serviceWorker' in navigator ? navigator.serviceWorker : null);
const indexedDb = ('indexedDB' in window ? window.indexedDB : null);

type SyncInfo = { id?: number, path: string, result: string, createdAt?: number }

interface Props {}

interface State {
  supportBackgroundSync: boolean,
  syncList: Array<SyncInfo>
}

class ServiceWorkerBackgroundSyncContainer extends AbstractContainer<Props, State> {
  intervalId: (null | NodeJS.Timer) = null;
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
    this.intervalId = setInterval(this.reloadSyncList, 1000);
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
      const newSyncList: Array<SyncInfo> = (event.target as IDBOpenDBRequest).result
                                                                             .reverse()
                                                                             .slice(0, 30);
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
        const id: number = (event.target as IDBOpenDBRequest).result;
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
        <h1>バックグランド同期API</h1>

        <h2>バックグランド同期APIとは？</h2>
        <p>サービスワーカーで提供されている API の一つで、ネットワークがオフラインの場合、オンラインになった時点で通信を行えるようにできる機能です。</p>
        <p>IndexedDB も使用して実現します。</p>

        <h2>お使いのブラウザの対応状況</h2>
        <p>{supportBackgroundSync ? '○ 対応しています' : '× 非対応です'}</p>

        {supportBackgroundSync && (
          <div>
            <h2>動作確認の方法</h2>
            <ol>
              <li>インターネットから切り離します。（例：機内モードにする、Wi-FiをOffにする、LANケーブルを抜くなど）</li>
              <li>下の<strong>操作パネル</strong>の<strong>Background Sync Test</strong>をクリックします。</li>
              <li>下の<strong>操作パネル</strong>の<strong>同期結果</strong>に１行追加され<strong>Result</strong>欄が空であることを確認します。
              </li>
              <li>インターネットに接続します。</li>
              <li>下の<strong>操作パネル</strong>の<strong>同期結果</strong>の<strong>Result</strong>欄に同期結果が表示されることを確認します。
              </li>
            </ol>

            <h2>操作パネル</h2>
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
        )}
      </div>
    );
  }
}

export { ServiceWorkerBackgroundSyncContainer };