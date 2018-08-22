import * as React from 'react';
import './style.scss';
import { AbstractContainer } from '../../abstract_container';
import { Button } from '../../../presenters/button';
import {
  addBackgroundSyncRow,
  getBackgroundSyncRows,
} from '../../..//database/background_sync';
import { TextArea } from '../../../presenters/text_area';

interface Props {}

interface State {
  latestRequestId: number | null,
  normalFetchResult: string | null,
  syncList: Array<{ id?: number, path: string, body: string, result: string, createdAt?: number }>
}

class ServiceWorkerBackgroundSyncContainer extends AbstractContainer<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      latestRequestId: null,
      normalFetchResult: null,
      syncList: [],
    };
  }

  componentDidMount(): void {
    this.reloadSyncList();
  }

  normalFetchTest = async (): Promise<void> => {
    fetch('/api/v1/echo/test', { method: 'POST', body: JSON.stringify({ test: 'OK' }) })
      .then(response => response.text())
      .then(text => this.setState({ normalFetchResult: text }))
      .catch(() => this.setState({ normalFetchResult: 'エラー' }));
  };

  backgroundSyncTest = async (): Promise<void> => {
    const syncData = {
      path: '/api/v1/echo/test',
      body: JSON.stringify({ test: 'OK' }),
      result: '',
    };
    const id: number = await addBackgroundSyncRow(syncData);
    const tag: string = `background-sync:${id}`;
    const swRegistration = await navigator.serviceWorker.ready;
    swRegistration.sync.register(tag);
    this.setState({ latestRequestId: id });
  };

  reloadSyncList = async (): Promise<void> => {
    const syncList = await getBackgroundSyncRows();
    this.setState({ syncList });
  };

  render() {
    const { latestRequestId, normalFetchResult, syncList } = this.state;

    return (
      <div id="service-worker-background-sync-container">
        <div>
          <Button onClick={() => this.normalFetchTest()}>
            Normal Fetch Test
          </Button>
        </div>
        <div>
          <TextArea
            className="push-info"
            onChange={() => undefined}
          >
            {normalFetchResult}
          </TextArea>
        </div>
        <div>
          <Button
            onClick={() => {
              this.backgroundSyncTest();
            }}
          >
            Background Sync Test
          </Button>
          {latestRequestId != null && (
            <span>　Request ID: {latestRequestId}</span>
          )}
        </div>
        <div>
          <Button
            onClick={() => {
              this.reloadSyncList();
            }}
          >
            Reload
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