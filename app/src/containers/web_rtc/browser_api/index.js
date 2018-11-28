import LocalStream from './local_stream';
import PeerConnection from './peer_connection';
import WebSocket from './web_socket';

const CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};

class WebRTC {
  constructor(url, roomId) {
    this.roomId = roomId;
    this.peers = {};
    this.webSocket = new WebSocket(url, roomId);
    this.webSocket.setJoinEventListener(this.receiveJoin.bind(this));
    this.webSocket.setExchangeEventListener(this.receiveExchange.bind(this));
    this.webSocket.setLeaveEventListener(this.receiveLeave.bind(this));
    this.localStream = new LocalStream();
  }

  setErrorHandler(handler /* args: type, error */) {
    this.errorHandler = handler;
  }

  setAddLocalStreamListener(listener /* args: stream */) {
    this.addLocalStreamListener = listener;
  }

  setAddRemoteStreamListener(listener /* args: stream */) {
    this.addRemoteStreamListner = listener;
  }

  setRemoveRemoteStreamListener(listener /* args: stream */) {
    this.removeRemoveStreamListner = listener;
  }

  setLeaveRemovePeerListener(listener /* args: peerId */) {
    this.leaveRemovePeerListener = listener;
  }

  start() {
    this.localStream.start((stream) => {
      if (this.addLocalStreamListener) this.addLocalStreamListener(stream);
      this.webSocket.start(this.roomId);
    }, (error) => {
      this.onError('media_device_error', error);
    });
  }

  close() {
    Object.keys(this.peers).forEach((peerId) => {
      this.closePeerConnection(peerId);
    });
    if (this.localStream) {
      this.localStream.close();
      this.localStream = null;
    }
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
    this.addLocalStreamListener = null;
    this.addRemoteStreamListner = null;
    this.removeRemoveStreamListner = null;
    this.leaveRemovePeerListener = null;
  }

  onError(type, error) {
    console.error(type, error);
    if (this.errorHandler) this.errorHandler(type, error);
  }

  receiveJoin(peerIds) {
    peerIds.forEach(peerId => this.getPeerConnection(peerId).createOffer(peerId));
  }

  receiveExchange(data) {
    this.getPeerConnection(data.from).receiveExchange(data);
  }

  receiveLeave(peerId) {
    this.closePeerConnection(peerId);
    if (this.leaveRemovePeerListener) this.leaveRemovePeerListener(peerId);
  }

  getPeerConnection(peerId) {
    if (!this.peers[peerId]) {
      const pc = new PeerConnection(
        peerId,
        CONFIG,
        data => this.webSocket.sendExchange(data),
        this.localStream.getStream(),
      );
      pc.setAddStreamEventListener(this.addRemoteStreamListner);
      pc.setRemoveStreamEventListener(this.removeRemoveStreamListner);
      pc.start();
      this.peers[peerId] = pc;
    }
    return this.peers[peerId];
  }

  closePeerConnection(peerId) {
    if (this.peers[peerId]) {
      this.peers[peerId].close();
      delete this.peers[peerId];
    }
  }

  enableSelfCamera(enabled) {
    if (this.localStream) return this.localStream.enableVideo(enabled);
    return false;
  }

  enableSelfMic(enabled) {
    if (this.localStream) return this.localStream.enableAudio(enabled);
    return false;
  }
}

export default WebRTC;
