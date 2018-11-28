import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { AbstractContainer } from '../abstract_container';
import { TextInput } from '../../presenters/text_input';
import { Button } from '../../presenters/button';
import { LocalStorage } from '../../common/storage';
import {
  webSocket,
  ReceiveMessageType,
} from '../../common/web_socket';
import './style.scss';

interface Props {}

interface State {
  joined: boolean,
  room: string,
  name: string,
  input: string,
  messages: Array<{ id: string, name: string, message: string }>,
}

const RoomKey: string = 'simple_chat.room';
const NameKey: string = 'simple_chat.name';
const InputKey: string = 'simple_chat.input';

class SimpleChatContainer extends AbstractContainer<Props, State> {
  state: State = {
    joined: false,
    room: LocalStorage.get(RoomKey) || '',
    name: LocalStorage.get(NameKey) || '',
    input: LocalStorage.get(InputKey) || '',
    messages: [],
  };

  componentDidMount() {
    webSocket.setListener(this.onMessage);
  }

  componentWillUnmount() {
    webSocket.setListener(null);
    this.leave();
  }

  onMessage = (receiveMessage: ReceiveMessageType): void => {
    const { requestId, message } = receiveMessage;
    this.setState((prevState) => ({
      messages: [{ ...message, id: requestId }, ...prevState.messages],
    }));
  };

  join = () => {
    const { room, name } = this.state;
    if (room != null && name != null) {
      webSocket.send({ requestId: uuid(), type: 'join', group: room });
      webSocket.send({
                       requestId: uuid(),
                       type: 'message',
                       group: room,
                       message: { name, message: '【入室しました】' },
                     });
      this.setState({ joined: true });
    }
  };

  leave = () => {
    const { room, name } = this.state;
    if (room != null && name != null) {
      webSocket.send({
                       requestId: uuid(),
                       type: 'message',
                       group: room,
                       message: { name, message: '【退室しました】' },
                     });
      webSocket.send({
                       requestId: uuid(),
                       type: 'leave',
                       group: room,
                     });
    }
    this.setState({ joined: false, messages: [] });
  };

  sendMessage = () => {
    const { room, name, input } = this.state;
    if (room != null) {
      webSocket.send({
                       requestId: uuid(),
                       type: 'message',
                       group: room,
                       message: { name, message: input },
                     });
      LocalStorage.set(InputKey, '');
      this.setState({ input: '' });
    }
  };

  render() {
    const { input, joined, room, name, messages } = this.state;

    return (
      <div id="simple-chat-container">
        <h1>簡易チャット</h1>
        <div id="simple-chat-description">WebSocket の実験です。</div>
        <div className="row">
          <TextInput
            active={!joined}
            className="half-width"
            maxLength={255}
            onChangeText={(newRoom) => {
              LocalStorage.set(RoomKey, newRoom);
              this.setState({ room: newRoom });
            }}
            placeHolder="ルーム名"
            value={room}
          />
          <TextInput
            active={!joined}
            className="half-width"
            maxLength={255}
            onChangeText={(newName) => {
              LocalStorage.set(NameKey, newName);
              this.setState({ name: newName });
            }}
            placeHolder="表示名"
            value={name}
          />
          <Button
            active={room !== '' && name !== ''}
            onClick={joined ? this.leave : this.join}
          >
            {joined ? '退室' : '入室'}
          </Button>
        </div>
        {joined && (
          <div>
            <div className="row">
              <TextInput
                className="full-width"
                maxLength={255}
                onChangeText={(newInput) => {
                  LocalStorage.set(InputKey, newInput);
                  this.setState({ input: newInput });
                }}
                placeHolder="メッセージを入力"
                value={input}
              />
              <Button
                active={input.length > 0}
                onClick={this.sendMessage}
              >
                送信
              </Button>
            </div>
            {messages.map(message => (
              <p
                key={message.id}
                className="chat-message"
              >
                {message.name}：{message.message}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export { SimpleChatContainer };