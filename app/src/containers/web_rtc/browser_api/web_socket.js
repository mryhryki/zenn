import io from 'socket.io-client';

class WebSocket {
  constructor(url, roomId) {
    this.url = url;
    this.roomId = roomId;
  }

  setJoinEventListener(listener /* args: peerIds*/) {
    this.joinEventListener = listener;
  }

  setExchangeEventListener(listener /* args: exchangeData */) {
    this.exchangeEventListener = listener;
  }

  setLeaveEventListener(listener /* args: peerIds*/) {
    this.leaveEventListener = listener;
  }

  start() {
    this.socket = io.connect(this.url, { transports: ['websocket'] });
    this.socket.on('exchange', this.exchange.bind(this));
    this.socket.on('leave', this.leave.bind(this));
    this.send('join', this.roomId, peerIds => this.join(peerIds));
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.joinEventListener = null;
    this.exchangeEventListener = null;
    this.leaveEventListener = null;
  }

  sendExchange(exchangeData) {
    this.send('exchange', exchangeData);
  }

  join(peerIds) {
    console.debug('receive[join]', peerIds);
    if (this.joinEventListener) this.joinEventListener(peerIds);
  }

  exchange(exchangeData) {
    console.debug('receive[exchange]', exchangeData);
    if (this.exchangeEventListener) this.exchangeEventListener(exchangeData);
  }

  leave(peerId) {
    console.debug('receive[leave]', peerId);
    if (this.leaveEventListener) this.leaveEventListener(peerId);
  }

  send(type, data, callback = null) {
    if (this.socket) {
      console.debug(`send[${type}]`, data);
      this.socket.emit(type, data, (params) => {
        if (callback) callback(params);
      });
    }
  }
}

export default WebSocket;
