import * as React from 'react';
import { AbstractContainer } from '../../../abstract_container';
import './style.scss';

const supportServiceWorker: boolean = ('serviceWorker' in navigator);

interface Props {}

interface State {}

class ServiceWorkerCacheContainer extends AbstractContainer<Props, State> {
  render() {
    return (
      <div id="service-worker-cache-container">
        <h1>キャッシュAPI</h1>

        <h2>キャッシュAPIとは？</h2>
        <p>サービスワーカーで提供されている API の一つで、fetch に介入し、キャッシュされたリソースを返却することができます。</p>
        <p>キャッシュを使用するかどうかは、コントロール可能です。</p>

        <h2>お使いのブラウザの対応状況</h2>
        <p>{supportServiceWorker ? '○ 対応しています' : '× 非対応です'}</p>

        {supportServiceWorker && (
          <div>
            <h2>動作確認の方法</h2>
            <p>実は、このページに必要なリソースは全てキャシュされています。以下の手順でキャッシュされていることを確認できます。</p>
            <ol>
              <li>インターネットから切り離します。（例：機内モードにする、Wi-FiをOffにする、LANケーブルを抜くなど）</li>
              <li>このページをリロードして、正常に表示されることを確認します。</li>
            </ol>
          </div>
        )}
      </div>
    );
  }
}

export { ServiceWorkerCacheContainer };