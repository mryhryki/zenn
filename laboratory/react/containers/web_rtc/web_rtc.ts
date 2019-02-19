import { v4 as uuid } from 'uuid';
import {
  ReceiveType,
  webSocket,
} from '../../common/web_socket';

const CONFIG = {
  sdpSemantics: 'unified-plan',
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};

type SdpMessage = {
  type: 'sdp',
  sdp: any,
}
type CandidateMessage = {
  type: 'candidate',
  candidate: any,
}
type SignalingMessage = SdpMessage | CandidateMessage;
type PeerInfo = { connection: RTCPeerConnection, stream?: MediaStream }

const stopStream = (stream: MediaStream | null | undefined): void => {
  if (stream != null) {
    stream.getVideoTracks()
          .forEach(track => track.stop());
    stream.getAudioTracks()
          .forEach(track => track.stop());
  }
};

class WebRTC {
  room: string;
  localStream: (MediaStream | null) = null;
  peers: { [peerId: string]: PeerInfo } = {};
  onChangeRemoteStreams: (streams: Array<MediaStream>) => void;

  constructor(room: string, onChangeRemoteStreams: (streams: Array<MediaStream>) => void) {
    this.room = room;
    this.onChangeRemoteStreams = onChangeRemoteStreams;

    webSocket.setListener((message: ReceiveType) => {
      switch (message.type) {
        case 'join':
          this.getPeerInfo(message.from, true);
          break;
        case 'leave':
          this.leavePeer(message.from);
          break;
        case 'message':
          this.receiveSignalingMessage(message.from, message.message);
      }
    });
  }

  sendSignalingMessage(to: string, message: SignalingMessage) {
    webSocket.send({ requestId: uuid(), type: 'message', group: this.room, to, message: message });
  };

  async start(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    this.localStream = stream;
    webSocket.send({ requestId: uuid(), type: 'join', group: this.room });
    return stream;
  };

  close() {
    stopStream(this.localStream);
    Object.keys(this.peers)
          .forEach(peerId => this.leavePeer(peerId));
    webSocket.send({ requestId: uuid(), type: 'leave', group: this.room });
  }

  async receiveSignalingMessage(peerId: string, message: SignalingMessage) {
    const peerConnection = this.getPeerInfo(peerId).connection;
    switch (message.type) {
      case 'sdp':
        if (peerConnection.remoteDescription == null) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
          if (peerConnection.remoteDescription.type === 'offer') {
            const description = await peerConnection.createAnswer();
            peerConnection.setLocalDescription(description);
            this.sendSignalingMessage(peerId, { type: 'sdp', sdp: description });
          }
        }
        break;
      case 'candidate':
        peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        break;
    }
  }

  remoteStreams(): Array<MediaStream> {
    return Object
      .keys(this.peers)
      .map(peerId => this.peers[peerId].stream)
      .filter(stream => stream != null);
  }

  leavePeer(peerId: string): void {
    const peerInfo = this.peers[peerId];
    if (peerInfo != null) {
      const { connection, stream } = peerInfo;
      delete this.peers[peerId];
      connection.close();
      stopStream(stream);
      this.onChangeRemoteStreams(this.remoteStreams());
    }
  }

  getPeerInfo(peerId: string, needsNegotiation: boolean = false): PeerInfo {
    if (this.peers[peerId] == null) {
      const rtcPeerConnection = new RTCPeerConnection(CONFIG);
      rtcPeerConnection.ontrack = (event: RTCTrackEvent) => {
        event.streams.forEach(stream => this.getPeerInfo(peerId).stream = stream);
        this.onChangeRemoteStreams(this.remoteStreams());
      };
      rtcPeerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate != null) {
          this.sendSignalingMessage(peerId, { type: 'candidate', candidate: event.candidate });
        }
      };
      rtcPeerConnection.onnegotiationneeded = () => {
        if (needsNegotiation) {
          rtcPeerConnection
            .createOffer()
            .then((description) => {
              rtcPeerConnection.setLocalDescription(description);
              this.sendSignalingMessage(peerId, { type: 'sdp', sdp: description });
            });
        }
      };
      rtcPeerConnection.addTrack(this.localStream.getVideoTracks()[0], this.localStream);
      this.peers[peerId] = { connection: rtcPeerConnection };
    }
    return this.peers[peerId];
  }

  enableSelfCamera(enabled: true) {
    if (this.localStream != null) {
      this.localStream
          .getVideoTracks()
          .forEach(track => track.enabled = enabled);
      return true;
    }
    return false;
  }

  enableSelfMic(enabled: true) {
    if (this.localStream != null) {
      this.localStream
          .getAudioTracks()
          .forEach(track => track.enabled = enabled);
      return true;
    }
    return false;
  }
}

export {
  SignalingMessage,
  WebRTC,
};
