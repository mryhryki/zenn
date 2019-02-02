import * as React from 'react';
import { Button } from '../../presenters/button';
import { TextInput } from '../../presenters/text_input';
import { TextArea } from '../../presenters/text_area';
import './style.scss';

const supportPushNotification: boolean = ('serviceWorker' in navigator && 'PushManager' in window);
const serviceWorker = (supportPushNotification ? navigator.serviceWorker : null);

interface Props {}

interface State {}

interface State {
  publicKey: string,
  subscriptionInfo: string,
}

const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

class ServiceWorkerPushNotificationContainer extends React.Component<Props, State> {
  state: State = {
    publicKey: '',
    subscriptionInfo: '',
  };

  requestPushNotification = async (): Promise<void> => {
    const { publicKey } = this.state;
    if (publicKey === '' || serviceWorker == null) {
      return;
    }
    console.log('ServiceWorker and Push is Supported');
    try {
      const swRegistration = await serviceWorker.register('./service_worker.js');
      console.log('ServiceWorker is registered', swRegistration);
      const applicationServerKey = urlB64ToUint8Array(publicKey);
      await swRegistration.pushManager.getSubscription();
      const params = { userVisibleOnly: true, applicationServerKey };
      swRegistration.pushManager.subscribe(params)
                    .then((subscription: any) => {
                      console.log('User is subscribed:', subscription);
                      this.setState({ subscriptionInfo: JSON.stringify(subscription, null, '  ') });
                    });
    } catch (error) {
      console.error('ServiceWorker error:', error);
    }
  };

  render() {
    const { publicKey, subscriptionInfo } = this.state;

    return (
      <div id="service-worker-push-container">
        <h1>Service Worker - Push API</h1>

        <div id="product-summary">
          <h2>プロダクト概要</h2>
          <p>
            <strong>Service Worker</strong>の<strong>Push API</strong>を使用して、
            ブラウザのみでプッシュ通知を行います。
          </p>
        </div>

        <div id="experimental-product">
          <h2>動作確認の手順</h2>
          {supportPushNotification ? (
            <div>
              <ol>
                <li>
                  <a href="https://web-push-codelab.glitch.me/" target="_blank">
                    Push Companion (外部サイト)
                  </a>
                  (※)を開きます。
                </li>
                <li>(※)のページ内にある<strong>Public Key</strong>をコピーします。</li>
                <li>下の<strong>操作パネル</strong>の<strong>Public Key</strong>にペーストします。</li>
                <li><strong>操作パネル</strong>の<strong>Request Permission</strong>をクリックします。</li>
                <li>ブラウザから通知を許可するか尋ねられるので、許可します。</li>
                <li><strong>操作パネル</strong>の<strong>Subscription Info</strong>にJSON文字列が表示されるので、全てコピーします。
                </li>
                <li>(※)のページの<strong>Subscription to Send To</strong>にペーストします。</li>
                <li>(※)のページの<strong>Text to Send</strong>に通知したいメッセージを適当に入れます。</li>
                <li>(※)のページの<strong>SEND PUSH MESSAGE</strong>をクリックします。</li>
                <li>プッシュ通知が届くことを確認します。</li>
              </ol>

              <h3>操作パネル</h3>
              <div className="frame">
                <TextInput
                  label="Public Key"
                  maxLength={100}
                  onChangeText={(inputValue: string) => this.setState({ publicKey: inputValue })}
                  placeHolder="Public Key"
                  value={publicKey}
                />
                <Button
                  active={publicKey !== ''}
                  className="request-permission-button"
                  onClick={() => this.requestPushNotification()}
                >
                  Request Permission
                </Button>
                <TextArea
                  className="subscription-info"
                  label="Subscription Info"
                  onChange={() => undefined}
                >
                {subscriptionInfo}
              </TextArea>
              </div>
            </div>
          ) : (
             <p>お使いのブラウザは対応していないため、動作確認はできません。</p>
           )}
        </div>

        <div id="product-explanation">
          <h2>技術解説</h2>
          <h3>Push API</h3>
          <p>
            <strong>Service Worker</strong>で提供されている<strong>API</strong>の一つで、
            ブラウザでのみでプッシュ通知はできます。
          </p>
          <p><strong>iOS</strong>は今のところ非対応ですが、ネイティブアプリに近い体験ができるようになります。</p>
        </div>
      </div>
    );
  }
}

export { ServiceWorkerPushNotificationContainer };