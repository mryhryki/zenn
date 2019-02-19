import * as React from 'react';
import './style.scss';

const supportServiceWorker: boolean = ('serviceWorker' in navigator);

interface Props {}

interface State {}

class ServiceWorkerCacheContainer extends React.Component<Props, State> {
  render() {
    return (
      <div id="service-worker-cache-container">
        <h1>Service Worker - Cache API</h1>

        <div id="product-summary">
          <h2>プロダクト概要</h2>
          <p>
            <strong>Service Worker</strong>の<strong>Cache API</strong>を使用して、
            ページの表示に必要なリソースをすべてキャッシュしています。
          </p>
          <p>これにより、高速なリソースのリロードとオフライン下での表示が可能になります。</p>
        </div>

        <div id="experimental-product">
          <h2>動作確認の手順</h2>
          {supportServiceWorker ? (
            <div>
              <p>このページに必要なリソースは全てキャッシュされているため、以下の手順でキャッシュされていることを確認できます。</p>
              <ol>
                <li>インターネットから切り離します。（例：機内モードにする、Wi-FiをOffにする、LANケーブルを抜くなど）</li>
                <li>このページをリロードして、正常に表示されることを確認します。</li>
              </ol>
            </div>
          ) : (
             <p>お使いのブラウザは対応していないため、動作確認はできません。</p>
           )}
        </div>

        <div id="product-explanation">
          <h2>技術解説</h2>
          <h3>Cache API</h3>
          <p>
            <strong>Service Worker</strong>で提供されている<strong>API</strong>の一つで
            <strong>fetch</strong>イベントに介入し、キャッシュされたリソースを返却することが可能です。
            キャッシュの仕組みは提供されていますが、どのようにキャッシュを利用するかはプログラミングでコントロールすることが可能です。
          </p>
          <p>
            キャッシュのパターンは
            <a href="https://jakearchibald.com/2014/offline-cookbook/">The offline cookbook</a>
            に詳しく書かれていますので、ぜひご覧ください。
          </p>
        </div>
      </div>
    );
  }
}

export { ServiceWorkerCacheContainer };