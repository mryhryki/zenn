import { v4 as uuid } from 'uuid';

const WS_URL = 'wss://web-socket.arukascloud.io/ws';

type WebSocketStatus = 'Connecting' | 'Open' | 'Closing' | 'Closed' | 'Disconnected'

type SendConnectivityType = {
  type: 'connectivity',
  data: {
    id: string,
    message: 'ping',
  }
};

type ReceiveConnectivityType = {
  type: 'connectivity',
  data: {
    id: string,
    message: 'pong',
  }
};

type ReceiveInfoType = {
  type: 'info',
  id: 'e1d8147e-39c8-421a-b106-3d79930063f3'
}

type SendMessageType = SendConnectivityType;
type ReceiveMessageType =
  ReceiveConnectivityType |
  ReceiveInfoType;

class Ws {
  connectionId: (string | null) = null;
  intervalId: (NodeJS.Timer | null) = null;
  waitConnectivityId: (string | null) = null;
  webSocket: (WebSocket | null) = null;

  constructor() {
    this.intervalId = setInterval(() => {
      if (this.webSocket == null) {
        this.reconnect();
      } else {
        this.checkConnectivity();
      }
    }, 5000);
  }

  closeWebSocket(): void {
    if (this.webSocket != null) {
      this.webSocket.close();
      this.webSocket = null;
    }
  }

  close(): void {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
    }
    this.closeWebSocket();
  }

  getId(): (string | null) {
    return this.connectionId;
  }

  getState(): WebSocketStatus {
    if (this.webSocket != null) {
      switch (this.webSocket.readyState) {
        case 0:
          return 'Connecting';
        case 1:
          return 'Open';
        case 2:
          return 'Closing';
        case 3:
          return 'Closed';
      }
    }
    return 'Disconnected';
  }

  reconnect(): void {
    if (this.webSocket != null) {
      return;
    }
    this.webSocket = new WebSocket(WS_URL);
    this.webSocket.onmessage = (event: MessageEvent) => this.onMessage(event);
    this.webSocket.onopen = (event: Event) => {
      console.debug('WebSocket Open:', event);
      this.checkConnectivity();
    };
    this.webSocket.onerror = (event: Event) => {
      console.error('WebSocket Error:', event);
      this.closeWebSocket();
    };
    this.webSocket.onclose = (event: CloseEvent) => {
      console.error('WebSocket Closed:', event);
      this.closeWebSocket();
    };
  }

  checkConnectivity(): void {
    const waitConnectivityId = uuid();
    const message: SendConnectivityType = {
      type: 'connectivity',
      data: {
        id: waitConnectivityId,
        message: 'ping',
      },
    };
    this.send(message);
    this.waitConnectivityId = waitConnectivityId;

    setTimeout(() => {
      if (this.waitConnectivityId === waitConnectivityId && this.webSocket != null) {
        this.webSocket.close();
        this.webSocket = null;
      }
    }, 3000);
  }

  send(message: SendMessageType): void {
    if (this.webSocket == null) {
      return;
    }
    this.webSocket.send(JSON.stringify(message));
  }

  onMessage(event: MessageEvent): void {
    const response: ReceiveMessageType = JSON.parse(event.data);
    switch (response.type) {
      case 'info':
        this.connectionId = response.id;
        break;
      case 'connectivity':
        if (this.waitConnectivityId === response.data.id) {
          this.waitConnectivityId = null;
        }
        break;
    }
  }
}

const ws = new Ws();
// (window as any).ws = ws;
export { ws };
