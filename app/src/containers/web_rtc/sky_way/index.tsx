import * as React from 'react';
import Peer from 'skyway-js';
import { AbstractContainer } from '../../abstract_container';
import { TextInput } from '../../../presenters/text_input';
import { Button } from '../../../presenters/button';
import { LocalStorage } from '../../../common/storage';
import { Modal } from '../../../presenters/modal';
import './style.scss';

const SkyWayApiKey: string = 'fcd26ea9-7208-4668-b4b5-456be1b3090e';
const RoomPrefix: string = `${window.location.host}/`;
const StorageKey: string = 'sky_way.room_id';

type SkyWayStream = MediaStream & { peerId: string }
type SkyWayStreamWithUrl = SkyWayStream & { url: string }

interface Props {}

interface State {
  remotePeerIds: Array<string>,
  room: string,
  selfPeerId: (string | null),
  streams: { [peerId: string]: SkyWayStreamWithUrl }
}

class SkyWay {
  room: any;
  peer: any;

  disconnect() {
    if (this.room != null) {
      this.room.close();
      this.room = null;
    }
    if (this.peer != null) {
      this.peer.disconnect();
      this.peer.destroy();
      this.peer = null;
    }
  }

  connect(props: any) {
    const {
      audioOnly,
      room: roomName,
      onJoinStream,
      onRemoveStream,
      onClose,
      useSFU,
      localStream,
    } = props;

    this.disconnect();
    this.peer = new Peer({ key: SkyWayApiKey, debug: 2, turn: true });
    this.peer.on('call', (call: any) => call.answer(localStream));
    this.peer.on('error', (err: any) => console.error(err));
    this.peer.on('open', () => {
      console.debug('Self Peer ID:', this.peer.id);
      const roomNameWithPrefix = `${RoomPrefix}${roomName}`;
      this.room = this.peer.joinRoom(roomNameWithPrefix, {
        mode: (useSFU ? 'sfu' : 'Mesh'),
        stream: localStream,
        videoBandwidth: 2048,
        audioBandwidth: 56,
        videoCodec: 'H264',
        audioCodec: 'opus',
        videoReceiveEnabled: !audioOnly,
        audioReceiveEnabled: true,
      });
      this.room.on('peerJoin', (peerId: string) => console.debug('peerJoin', peerId));
      this.room.on('stream', (stream: MediaStream) => {
        console.debug('stream', stream);
        onJoinStream(stream);
      });
      this.room.on('removeStream', (stream: MediaStream) => {
        console.debug('removeStream', stream);
        onRemoveStream(stream);
      });
      this.room.on('peerLeave', (peerId: string) => console.debug('peerLeave', peerId));
      this.room.on('data', (data: any) => console.debug('Data', data));
      this.room.on('close', onClose);
      console.debug('Join room:', roomNameWithPrefix);
    });
  };

  sendData(type: any, data: any) {
    if (!this.room) {
      throw new Error('Not join room.');
    }
    if (!type) {
      throw new Error('`type` is required.');
    }
    const sendData: any = { type };
    if (data) {
      Object.keys(data)
            .forEach((key) => (sendData[key] = data[key]));
    }
    this.room.send(sendData);
  };
}

const convertStream = (stream: any): SkyWayStreamWithUrl => {
  if (!('peerId' in stream)) {
    stream.peerId = stream.id;
  }
  stream.url = URL.createObjectURL(stream);
  return stream;
};

class SkyWayContainer extends AbstractContainer<Props, State> {
  state: State = {
    remotePeerIds: [],
    room: LocalStorage.get(StorageKey),
    selfPeerId: null,
    streams: {},
  };
  skyWay: SkyWay = new SkyWay();

  onChangeRoom = (room: string): void => {
    LocalStorage.set(StorageKey, room);
    this.setState({ room });
  };

  onJoinStream = (remoteStream: SkyWayStream): void => {
    const stream = convertStream(remoteStream);
    const { peerId } = stream;
    this.setState((prevState: State) => {
      const { remotePeerIds, streams } = prevState;
      const newRemotePeerIds = [...remotePeerIds, peerId];
      streams[peerId] = stream;
      return { remotePeerIds: newRemotePeerIds };
    });
  };

  onRemoveStream = (remoteStream: SkyWayStream): void => {
    const { peerId } = remoteStream;
    this.setState((prevState: State) => {
      const { remotePeerIds, streams } = prevState;
      const newRemotePeerIds = remotePeerIds.filter(id => id !== peerId);
      delete streams[peerId];
      return { remotePeerIds: newRemotePeerIds };
    });
  };

  onClose = (): void => {
    const { streams } = this.state;
    Object.keys(streams)
          .forEach((peerId) => {
            if (streams[peerId] != null) {
              streams[peerId].stop();
            }
          });
    this.setState({ selfPeerId: null, remotePeerIds: [], streams: {} });
  };

  connect = (): void => {
    const { room } = this.state;
    navigator
      .mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((localStream: MediaStream) => {
        const stream = convertStream(localStream);
        this.setState((prevState) => {
          const { streams } = prevState;
          const newStreams = { ...streams, [stream.peerId]: stream };
          return { selfPeerId: stream.peerId, streams: newStreams };
        });
        const props = {
          room,
          localStream: stream,
          onJoinStream: this.onJoinStream,
          onRemoveStream: this.onRemoveStream,
          onClose: this.onClose,
        };
        this.skyWay.connect(props);
      })
      .catch((e) => {
        console.error(e);
        alert('接続に失敗しました。');
      });
  };

  renderModal() {
    const { selfPeerId, remotePeerIds, streams } = this.state;
    if (selfPeerId == null) {
      return null;
    }

    return (
      <Modal onWrapperClick={this.onClose}>
        <div id="sky-way-video-modal">
          <video
            id="sky-way-self-view"
            autoPlay
            muted
            playsInline
            src={streams[selfPeerId].url}
          />
          {remotePeerIds.map((remotePeerId) => (
            <video
              className="sky-way-remote-view"
              key={remotePeerId}
              autoPlay
              playsInline
              src={streams[remotePeerId].url}
            />
          ))}
        </div>
      </Modal>
    );
  }

  render() {
    const { room, selfPeerId } = this.state;

    return (
      <div id="sky-way-container">
        <h1>SkyWayを使ったサンプル</h1>
        <div className="frame">
          <TextInput
            active={selfPeerId == null}
            label="Room"
            onChangeText={this.onChangeRoom}
            value={room}
            maxLength={255}
          />
          <div id="sky-way-control-buttons">
            <Button onClick={this.connect}>
              Connect
            </Button>
          </div>
        </div>
        {this.renderModal()}
      </div>
    );
  }
}

export { SkyWayContainer };