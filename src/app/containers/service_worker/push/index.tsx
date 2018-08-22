import * as React from 'react';
import { AbstractContainer } from '../../abstract_container';
import { Button } from '../../../presenters/button';
import { TextInput } from '../../../presenters/text_input';
import { TextArea } from '../../../presenters/text_area';
import './style.scss';

const { serviceWorker } = navigator;
const { PushManager } = (window as any);

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

class ServiceWorkerPushContainer extends AbstractContainer<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      publicKey: '',
      subscriptionInfo: '',
    };
  }

  requestPushNotification = async (): Promise<void> => {
    const { publicKey } = this.state;

    if (serviceWorker && PushManager && publicKey !== '') {
      console.log('ServiceWorker and Push is Supported');
      try {
        const swRegistration = await navigator.serviceWorker.register('/service_worker.js');
        console.log('ServiceWorker is registered', swRegistration);
        const applicationServerKey = urlB64ToUint8Array(publicKey);
        await swRegistration.pushManager.getSubscription();
        const params = { userVisibleOnly: true, applicationServerKey };
        const subscription = swRegistration.pushManager.subscribe(params);
        console.log('User is subscribed:', subscription);
        this.setState({ subscriptionInfo: JSON.stringify(subscription, null, '  ') });
      } catch (error) {
        console.error('ServiceWorker error:', error);
      }
    } else {
      console.warn('Push messaging is not supported');
    }
  };

  render() {
    const { publicKey, subscriptionInfo } = this.state;

    return (
      <div id="service-worker-push-container">
        <div>
          <a
            href="https://web-push-codelab.glitch.me/"
            target="_blank"
          >
            Push Test Page
          </a>
        </div>
        <div>
          <Button
            active={publicKey !== ''}
            onClick={() => this.requestPushNotification()}
          >
            Request Permission
          </Button>
        </div>
        <div>
          <TextInput
            label="Public Key"
            maxLength={100}
            onChangeText={(inputValue: string) => this.setState({ publicKey: inputValue })}
            placeHolder="Public Key"
            value={publicKey}
          />
        </div>
        <div>
            <TextArea
              className="push-info"
              onChange={() => undefined}
            >
              {subscriptionInfo}
            </TextArea>
        </div>
      </div>
    );
  }
}

export { ServiceWorkerPushContainer };