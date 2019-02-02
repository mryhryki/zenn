import * as React from 'react';
import * as QrCode from 'qrcode';
import './style.scss';
import { TextArea } from '../../presenters/text_area';
import { LocalStorage } from '../../common/storage';

const LocalStorageKey: string = 'qr_code/qrText';

interface Props {}

interface State {
  qrText: string,
  qrImage: string,
}

class QrCodeContainer extends React.Component<Props, State> {
  state: State = {
    qrImage: '',
    qrText: '',
  };

  componentDidMount(): void {
    const qrText: string = LocalStorage.get(LocalStorageKey) || window.location.href;
    this.onChangeText(qrText);
  }

  onChangeText = (qrText: string): void => {
    LocalStorage.set(LocalStorageKey, qrText);
    this.setState({ qrText });
    if (qrText !== '') {
      QrCode
        .toDataURL(qrText)
        .then((qrImage) => {
          this.setState({ qrImage });
        })
        .catch((error) => {
          console.error('QrCode generate error:', error);
        });
    }
  };

  render() {
    const { qrImage, qrText } = this.state;

    return (
      <div id="qr-code-container">
        <div>
          <h1>QRコード</h1>

          <div id="product-summary">
            <h2>プロダクト概要</h2>
            <p>
              手軽に<strong>QRコード</strong>を生成できます。
              <strong><a href="https://www.npmjs.com/package/qrcode">qrcode</a></strong>というライブラリを使用しています。
            </p>
          </div>

          <div id="experimental-product">
            <h2>実験プロダクト</h2>
            {qrImage !== '' && (
              <div id="qr-code-image-wrapper">
                <img
                  id="qr-code-image"
                  src={qrImage}
                  alt="QR Code"
                />
              </div>
            )}
            <TextArea
              label="QRコードに変換する文字列"
              onChange={this.onChangeText}
            >
              {qrText}
            </TextArea>
          </div>

          <div id="product-explanation">
            <h2>技術解説</h2>
            <h3>QRコード</h3>
            <p>1994年にデンソーが開発した二次元バーコードの規格です。一次元のバーコードに比べ、情報密度が高いのが特徴です。</p>
            <p>開発当初は、自動車部品の生産現場で使われていたそうです。</p>
          </div>
        </div>
      </div>
    );
  }
}

export { QrCodeContainer };