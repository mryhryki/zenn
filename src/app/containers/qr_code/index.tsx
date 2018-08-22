import * as React from 'react';
import * as QrCode from 'qrcode';
import { AbstractContainer } from '../abstract_container';
import './style.scss';

interface Props {}

interface State {}

class QrCodeContainer extends AbstractContainer<Props, State> {
  canvas: (HTMLCanvasElement | null) = null;

  renderQrCode() {
    if (this.canvas != null) {
      QrCode.toCanvas(this.canvas, 'sample text', (error: any) => {
        if (error) {
          console.error(error);
        }
        console.log('success!');
      });
    }
  }

  render() {
    return (
      <div id="qr-code-container">
        <h1>QR Code</h1>
        <canvas
          ref={(element) => {
            this.canvas = element;
            this.renderQrCode();
          }}
        />
      </div>
    );
  }
}

export { QrCodeContainer };