import * as React from 'react';
import './style.scss';
import { AbstractContainer } from '../../../abstract_container';
import { Button } from '../../../../presenters/button';

const serviceWorker = ('serviceWorker' in navigator ? navigator.serviceWorker : null);
const indexedDb = ('indexedDB' in window ? window.indexedDB : null);

interface Props {}

interface State {
  syncList: Array<{ id?: number, path: string, body: string, result: string, createdAt?: number }>
}

class ServiceWorkerBackgroundSyncContainer extends AbstractContainer<Props, State> {
  intervalId: (null | NodeJS.Timer) = null;
  db: (null | IDBDatabase) = null;
  state: State = {
    syncList: [],
  };

  async componentWillMount(): Promise<void> {
    if (indexedDb == null) {
      return;
    }
    const dbOepnRequest: IDBOpenDBRequest = indexedDb.open('service_worker', 1);
    dbOepnRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      const store: IDBObjectStore = db.createObjectStore(
        'background_sync',
        { keyPath: 'id', autoIncrement: true },
      );
      console.log('Success create store:', store);
      this.db = db;
    };
    dbOepnRequest.onerror = (error) => console.error('Fail open DB:', error);
    dbOepnRequest.onsuccess = (event) => {
      console.log('Success open DB:', event);
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

  reloadSyncList = async (): Promise<void> => {
    // const { syncList } = this.state;
    // const newSyncList = await getBackgroundSyncRows();
    // if (newSyncList.length === 0) {
    //   return;
    // }
    //
    // const differentLength: boolean = syncList.length !== newSyncList.length;
    // const updated: boolean = differentLength ||
    //   newSyncList.findIndex((element, index) => (element.id !== syncList[index].id)) !== -1;
    // if (updated) {
    //   this.setState({ syncList: newSyncList });
    // }
  };

  backgroundSyncTest = (): void => {
    if (serviceWorker == null || this.db == null) {
      return;
    }
    const syncData = { path: '/example.json', body: '', result: '' };
    const transaction: IDBTransaction = this.db.transaction(['background_sync'], 'readwrite');
    transaction.onerror = (error) => console.error('Failed:', error);

    const request: IDBRequest = transaction.objectStore('background_sync')
                                           .add(syncData);
    request.onerror = (error) => console.error('Failed:', error);
    request.onsuccess = async (event: Event) => {
      const id: number = (event.target as IDBOpenDBRequest).result;
      const tag: string = `background-sync:${id}`;
      const swRegistration = await serviceWorker.ready;
      swRegistration.sync.register(tag);
      this.reloadSyncList();
    };
  };

  render() {
    const { syncList } = this.state;

    return (
      <div id="service-worker-background-sync-container">
        <div>
          <Button onClick={() => this.backgroundSyncTest()}>
            Background Sync Test
          </Button>
        </div>
        <div>
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
    );
  }
}

export { ServiceWorkerBackgroundSyncContainer };