import * as React from 'react';
import './style.scss';

interface Props {}

interface State {}

class HomeContainer extends React.Component<Props, State> {
  render() {
    return (
      <div id="home-container">
        <h1>hyiromori's Laboratory</h1>
        <p id="home-description">自分の持っている技術の実験＆公開の場として作成しているページです。</p>
      </div>
    );
  }
}

export { HomeContainer };