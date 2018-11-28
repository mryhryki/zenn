const rewriteSDP = (description) => {
  const sdp = description.sdp;
  // 今のところ書き換える必要は無いが、今後SDPの書き換えが必要になった場合はここで書き換える。
  description.sdp = sdp; // eslint-disable-line no-param-reassign
  return description;
};

class PeerConnection {
  constructor(peerId, config, exchange, rawLocalStream) {
    this.peerId = peerId;
    this.config = config;
    this.exchange = exchange;
    this.localStream = rawLocalStream;
  }

  setAddStreamEventListener(listener /* args: stream */) {
    this.addStreamEventListener = listener;
  }

  setRemoveStreamEventListener(listener /* args: stream */) {
    this.removeStreamEventListener = listener;
  }

  start() {
    this.connection = new RTCPeerConnection(this.config);
    this.setPeerConnectionCallbacks({ connection: this.connection });
    this.connection.addStream(this.localStream);
  }

  close() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    this.addStreamEventListener = null;
    this.removeStreamEventListener = null;
  }

  receiveExchange(data) {
    const fromId = data.from;
    if (data.sdp) {
      this.connection.setRemoteDescription(new RTCSessionDescription(rewriteSDP(data.sdp)), () => {
        if (this.connection.remoteDescription.type === 'offer') this.createAnswer(fromId);
      }, (error) => {
        if (error.name === 'SetRemoteDescriptionFailed') {
          // TODO: #284 （動作は問題ないため、一旦ログ出力のみする）
          console.info('### SetRemoteDescriptionFailed', error);
        } else {
          console.error(error);
        }
      });
    } else if (data.candidate) {
      this.connection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  }

  createOffer() {
    this.connection.createOffer((description) => {
      this.connection.setLocalDescription(rewriteSDP(description), () => {
        this.exchange({
          to: this.peerId,
          sdp: this.connection.localDescription,
        });
      }, (error) => {
        if (error.name === 'SetLocalDescriptionFailed') {
          // TODO: #284 （動作は問題ないため、一旦ログ出力のみする）
          console.info('### SetLocalDescriptionFailed', error);
        } else {
          console.error(error);
        }
      });
    }, (error) => {
      console.error(error);
    });
  }

  createAnswer(toId) {
    this.connection.createAnswer((description) => {
      this.connection.setLocalDescription(rewriteSDP(description), () => {
        this.exchange({
          to: toId,
          sdp: this.connection.localDescription,
        });
      }, (error) => {
        console.error(error);
      });
    }, (error) => {
      console.error(error);
    });
  }

  setPeerConnectionCallbacks() {
    // 使用しないイベントも含め、全てのイベントを列挙しています。
    this.connection.onaddstream = (event) => {
      console.debug('onAddStream');
      if (this.addStreamEventListener) this.addStreamEventListener(event.stream);
    };
    this.connection.onremovestream = (event) => {
      console.debug('onRemoveStream');
      if (this.removeStreamEventListener) this.removeStreamEventListener(event.stream);
    };
    this.connection.onicecandidate = (event) => {
      console.debug('onICECandidate');
      if (event.candidate) this.exchange({ to: this.peerId, candidate: event.candidate });
    };
    this.connection.oniceconnectionstatechange = (/* event */) => {
      console.debug('onICEConnectionStateChange');
    };
    this.connection.onnegotiationneeded = (/* event */) => {
      console.debug('onNegotiationNeeded');
    };
    this.connection.onsignalingstatechange = (/* event */) => {
      console.debug('onSignalingStateChange');
    };
    this.connection.onconnectionstatechange = (/* event */) => {
      console.debug('onConnectionStateChange');
    };
    this.connection.ondatachannel = (/* event */) => {
      console.debug('onDataChannel');
    };
    this.connection.onicegatheringstatechange = (/* event */) => {
      console.debug('onICEGatheringStateChange');
    };
    this.connection.onidentityresult = (/* event */) => {
      console.debug('onIdentityResult');
    };
    this.connection.onidpassertionerror = (/* event */) => {
      console.debug('onIDPassertionError');
    };
    this.connection.onpeeridentity = (/* event */) => {
      console.debug('onPeerIdentity');
    };
    this.connection.ontrack = (/* event */) => {
      console.debug('onTrack');
    };
  }
}

export default PeerConnection;
