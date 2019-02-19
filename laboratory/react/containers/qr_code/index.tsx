import * as React from 'react';
import * as QrCode from 'qrcode';
import './style.scss';
import { TextArea } from '../../presenters/text_area';
import { RadioButton } from '../../presenters/radio_button';
import { LocalStorage } from '../../common/storage';

const QrTextStorageKey: string = 'qr_code/qrText';
const QrErrorCorrectionLevel: string = 'qr_code/qrErrorCorrectionLevel';

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

interface Props {}

interface State {
  qrText: string,
  qrImage: string,
  errorCorrectionLevel: ErrorCorrectionLevel,
}

class QrCodeContainer extends React.Component<Props, State> {
  state: State = {
    qrImage: '',
    qrText: '',
    errorCorrectionLevel: 'L',
  };

  componentDidMount(): void {
    const qrText: string = LocalStorage.get(QrTextStorageKey) || window.location.href;
    const errorCorrectionLevel: any = LocalStorage.get(QrErrorCorrectionLevel) || 'L';
    this.setState({ qrText, errorCorrectionLevel });
    this.generateQrCode(qrText, errorCorrectionLevel);
  }

  generateQrCode = (qrText: string, errorCorrectionLevel: ErrorCorrectionLevel): void => {
    if (qrText !== '') {
      QrCode
        .toDataURL(qrText, { errorCorrectionLevel })
        .then((qrImage) => this.setState({ qrImage }))
        .catch((error) => console.error('QrCode generate error:', error));
    }
  };

  onChangeText = (qrText: string): void => {
    LocalStorage.set(QrTextStorageKey, qrText);
    this.setState({ qrText });
    const { errorCorrectionLevel } = this.state;
    this.generateQrCode(qrText, errorCorrectionLevel);
  };

  onChangeErrorCorrectionLevel = (errorCorrectionLevel: ErrorCorrectionLevel): void => {
    LocalStorage.set(QrErrorCorrectionLevel, errorCorrectionLevel);
    this.setState({ errorCorrectionLevel });
    const { qrText } = this.state;
    this.generateQrCode(qrText, errorCorrectionLevel);

  };

  render() {
    const { qrImage, qrText, errorCorrectionLevel } = this.state;

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
            <span>エラー訂正レベル</span>
            <div>
              <RadioButton
                checked={errorCorrectionLevel === 'L'}
                onClick={() => this.onChangeErrorCorrectionLevel('L')}
              >
                L (Low - 7% の破損まで読み取り可能)
              </RadioButton>
              <RadioButton
                checked={errorCorrectionLevel === 'M'}
                onClick={() => this.onChangeErrorCorrectionLevel('M')}
              >
                M (Medium - 15% の破損まで読み取り可能)
              </RadioButton>
              <RadioButton
                checked={errorCorrectionLevel === 'Q'}
                onClick={() => this.onChangeErrorCorrectionLevel('Q')}
              >
                Q (Quartile - 25% の破損まで読み取り可能)
              </RadioButton>
              <RadioButton
                checked={errorCorrectionLevel === 'H'}
                onClick={() => this.onChangeErrorCorrectionLevel('H')}
              >
                H (High - 30% の破損まで読み取り可能)
              </RadioButton>
            </div>
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