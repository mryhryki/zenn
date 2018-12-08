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
        <h1>QRコード</h1>
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
    );
  }
}

export { QrCodeContainer };