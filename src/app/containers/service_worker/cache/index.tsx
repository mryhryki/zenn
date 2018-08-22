import * as React from 'react';
import { AbstractContainer } from '../../abstract_container';
import { Button } from '../../../presenters/button';
import { CheckBox } from '../../../presenters/check_box';
import { TextArea } from '../../../presenters/text_area';
import {
  getPropertyRow,
  putPropertyRow,
  PropertyKeys,
} from '../../../database/property';
import './style.scss';

interface Props {}

interface State {
  response: string | null,
  disableCache: boolean,
}

class ServiceWorkerCacheContainer extends AbstractContainer<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      response: null,
      disableCache: false,
    };
  }

  async componentWillMount(): Promise<void> {
    const row: any = getPropertyRow(PropertyKeys.serviceWorkerCacheApiDisable);
    const disableCache: boolean = (row != null && row.val === 'true');
    this.setState({ disableCache });
  };

  async componentWillUnmount(): Promise<void> {
    await putPropertyRow({ key: PropertyKeys.serviceWorkerCacheApiDisable, val: 'false' });
  };

  onClickCheckBox = async (checked: boolean): Promise<void> => {
    await putPropertyRow({
                           key: PropertyKeys.serviceWorkerCacheApiDisable,
                           val: (checked ? 'true' : 'false'),
                         });
    this.setState({ disableCache: checked });
  };

  fetchTest = () => {
    fetch('/example.json')
      .then(response => response.text())
      .then(text => this.setState({ response: text }))
      .catch(() => this.setState({ response: 'エラー' }));
  };

  render() {
    const { response, disableCache } = this.state;

    return (
      <div id="service-worker-cache-container">
        <div className="frame">
          <div className="frame-title">Fetchテスト</div>
          <Button
            className="fetch-test-button"
            onClick={this.fetchTest}
          >
            Fetch Test
          </Button>
          <TextArea
            label="Response"
            onChange={(inputText) => this.setState({ response: inputText })}
          >
          {response}
          </TextArea>
          <CheckBox
            checked={disableCache}
            onClick={(checked) => this.onClickCheckBox(checked)}
          >
            キャッシュを無効にする。
          </CheckBox>
        </div>
        <h2>前提</h2>
        <ul>
          <li>
            上の「Fetchテスト」の <strong>Fetch
                                  Test</strong> ボタンを押すと <strong>fetch('/example.json')</strong>
            が実行され、取得結果が「Response」が表示されます。
          </li>
          <li>正常に取得できなかった場合は「Response」に「エラー」と表示されます。</li>
        </ul>
        <h2>動作確認の方法</h2>
        <ol>
          <li>インターネットから切り離します。（例：機内モードにする、Wi-FiをOffにする、LANケーブルを抜くなど）</li>
          <li><strong>Fetch Test</strong> ボタンを押すと「エラー」が表示されることを確認します。</li>
          <li>インターネットに接続します。</li>
          <li><strong>Fetch Test</strong> ボタンを押すと正常な結果（JSON）表示されることを確認します。</li>
          <li>再度インターネットから切り離します。</li>
          <li><strong>Fetch Test</strong> ボタンを押すと、今度は正常な結果（JSON）表示されていることを確認します。</li>
        </ol>
      </div>
    );
  }
}

export { ServiceWorkerCacheContainer };