import * as React from 'react';
import Peer from 'skyway-js';
import {AbstractContainer} from '../../../abstract_container';
import {TextInput} from '../../../../presenters/text_input';
import {Storage} from '../../../../common/storage';
import './style.scss';

const SkyWayApiKey: string = '45ab99db-396c-403b-b90d-a97933da6404';
const RoomPrefix: string = `${window.location.host}/`;
const StorageKey: string = 'skyway/room_id';

interface Props {
}

interface State {
  localStream: (null | Object),
  room: string,
  streams: Array<any>,
}

// ---------------------------------------------------------------------------------------------------------------------

class Skyway {
  room: any;
  peer: any;

  disconnect() {
    if (this.room != null) {
      this.room.close;
      this.room = null;
    }
    if (this.peer != null) {
      this.peer.disconnect();
      this.peer.destroy();
      this.peer = null;
    }
  }


  connect(props) {
    const {
      audioOnly,
      room: roomName,
      onJoinPeer,
      onLeavePeer,
      onClose,
      useSFU,
      localStream,
    } = props;

    this.disconnect();
    this.peer = new Peer({key: SkyWayApiKey, debug: 2, turn: true});
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
      this.room.on('peerJoin', (peerId: any) => console.log('### onJoinPeer', peerId));
      this.room.on('stream', (stream: any) => onJoinPeer(stream));
      this.room.on('removeStream', (stream: any) => console.log('### onRemoveStream', stream));
      this.room.on('peerLeave', (peerId: any) => onLeavePeer(peerId));
      this.room.on('data', (data: any) => console.log('### onData', data));
      this.room.on('close', onClose);
      console.debug('Join room:', roomNameWithPrefix);
    });
  };

  sendData(type: any, data: any) {
    if (!this.room) throw new Error('Not join room.');
    if (!type) throw new Error('`type` is required.');
    const sendData: any = {type};
    if (data) Object.keys(data).forEach((key) => (sendData[key] = data[key]));
    this.room.send(sendData);
  };
}


// ---------------------------------------------------------------------------------------------------------------------


class SkyWayContainer extends AbstractContainer<Props, State> {
  state: State = {
    localStream: null,
    room: Storage.get(StorageKey),
    streams: [],
  };

  onChangeRoom = (room: string): void => {
    Storage.set(StorageKey, room);
    this.setState({room});
  };

  render() {
    const {room} = this.state;

    return (
      <div id="qr-code-container">
        <h1>SkyWay (WebRTC)</h1>
        <div className="frame">
          <TextInput
            label="Room"
            onChangeText={this.onChangeRoom}
            value={room}
            maxLength={255}
          />
        </div>
      </div>
    );
  }
}

export {SkyWayContainer};