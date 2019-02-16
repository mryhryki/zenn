import * as React from 'react';
import { WebRTC } from './web_rtc';
import { TextInput } from '../../presenters/text_input';
import { Button } from '../../presenters/button';
import { Video } from '../../presenters/video';
import { LocalStorage } from '../../common/storage';
import './style.scss';

const RoomPrefix: string = `${window.location.host}/`;
const StorageKey: string = 'web_rtc.room_id';

interface Props {}

interface State {
  room: string,
  localStream: MediaStream | null,
  remoteStreams: Array<MediaStream>,
}

class WebRtcContainer extends React.Component<Props, State> {
  state: State = {
    room: LocalStorage.get(StorageKey),
    localStream: null,
    remoteStreams: [],
  };
  webRTC: (WebRTC | null) = null;

  componentWillUnmount(): void {
    this.disconnect();
  }

  onChangeRoom = (room: string): void => {
    LocalStorage.set(StorageKey, room);
    this.setState({ room });
  };

  connect = (): void => {
    const { room } = this.state;
    const roomNameWithPrefix = `${RoomPrefix}${room}`;

    const onChangeRemoteStreams = (remoteStreams: Array<MediaStream>) => {
      this.setState({ remoteStreams });
    };
    const webRTC = new WebRTC(roomNameWithPrefix, onChangeRemoteStreams);
    webRTC.start()
          .then((localStream) => {
            this.setState({ localStream });
          });
    this.webRTC = webRTC;
  };

  disconnect = (): void => {
    if (this.webRTC != null) {
      this.webRTC.close();
      this.webRTC = null;
    }
    this.setState({ localStream: null, remoteStreams: [] });
  };

  render() {
    const { room, localStream, remoteStreams } = this.state;

    return (
      <div id="browser-api-container">
        <h1>WebRTC (Real Time Communication)</h1>

        <div id="product-summary">
          <h2>プロダクト概要</h2>
          <p>
            <strong>WebRTC</strong>を使ったビデオチャットアプリです。
            <strong>Room</strong> に入力した文字列を元にチャットルームを判別し、接続した相手とビデオチャットができます。
          </p>
          <p><strong>Connect</strong> を押すと、最初にカメラとマイクの使用してよいか聞かれるので許可してください。</p>
        </div>

        <div id="experimental-product">
          <h2>実験プロダクト</h2>
          <div className="frame">
            <TextInput
              active={localStream == null}
              label="Room"
              onChangeText={this.onChangeRoom}
              value={room}
              maxLength={255}
            />
            <div className="control-buttons">
              <Button onClick={this.connect}>
                Connect
              </Button>
            </div>
          </div>
          {localStream != null && (
            <div className="video-modal">
              <Video
                className="self-view"
                autoPlay
                muted
                playsInline
                srcObject={localStream}
              />
              {remoteStreams.map((stream) => {
                return (
                  <Video
                    className="remote-view"
                    key={stream.id}
                    autoPlay
                    playsInline
                    srcObject={stream}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div id="product-explanation">
          <h2>技術解説</h2>
          <h3>WebRTC</h3>
          <p>ブラウザが提供しているリアルタイムコミュニケーションのAPIで、プラグイン等の追加なく、P2Pでビデオチャットやデータのやり取りができます。</p>
          <h3>シグナリング</h3>
          <p>
            P2P で接続するための情報をやり取りする方法です。
            RFC には規定されておらず、各々実装する必要があります。
            <strong>WebSocket</strong> を利用するのが一般的だと思います。
            このプロダクトでも <a href="https://arukas.io/">Arukas</a> というサービスで
            WebSocket サーバーのコンテナを立ち上げて使用してます。
          </p>
          <h3>TURN</h3>
          <p>
            P2P 通信ができない場合に通信を中継するサーバーです。
            この実験プロダクトでは使用していないので、特殊な NAT を使用している場合は動作しない可能性があります。
            ちなみに携帯電話のキャリアは繋がります。
          </p>
          <h3>SFU</h3>
          <p>
            複数人でビデオチャットを行う場合に効率よくデータを中継するための方式です。
            こちらの <a href="https://gist.github.com/voluntas/4d2bd3e878965bdd747a">Gist</a> は詳しく書かれています。
            こちらを書かれた方の記事はよくお世話になりました。
          </p>
        </div>
      </div>
    );
  }
}

export { WebRtcContainer };