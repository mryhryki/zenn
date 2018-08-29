import * as React from 'react';
import * as QrCode from 'qrcode';
import { AbstractContainer } from '../../abstract_container';
import './style.scss';
import { TextArea } from '../../../presenters/text_area';
import { Storage } from '../../../common/storage';

const StorageKey: string = 'qr_code/qrText';

interface Props {}

interface State {
  qrText: string,
  qrImage: string,
}

class QrCodeContainer extends AbstractContainer<Props, State> {
  state: State = {
    qrImage: '',
    qrText: '',
  };

  componentDidMount(): void {
    const qrText: string = Storage.get(StorageKey) || window.location.href;
    this.onChangeText(qrText);
  }

  onChangeText = (qrText: string): void => {
    Storage.set(StorageKey, qrText);
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
        <h1>QR Code</h1>
        <div className="frame">
          {qrImage !== '' && (
            <div id="qr-code-image-wrapper">
              <img
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

        <h2>このページについて</h2>
        <p>QRコードをただ生成するだけのページです。サービスワーカーと組み合わせることでオフラインアプリ的に使えるかな、と思って作成してみました。</p>
        <p>いずれは、自分で生成するところまでやってみたい。</p>
      </div>
    );
  }
}

export { QrCodeContainer };