import * as React from 'react';

const TITLE = 'Portfolio';
const BY = 'by hyiromori';

type Props = {};
type State = {
  title: string,
  by: string,
};

class HomeImage extends React.Component<Props, State> {
  state: State = {
    title: '',
    by: '',
  };

  componentDidMount(): void {
    let title: string = '';
    let by: string = '';
    const intervalId = setInterval(() => {
      if (title !== TITLE) {
        title = TITLE.substr(0, title.length + 1);
      } else {
        by = BY.substr(0, by.length + 1);
      }
      this.setState({ title, by });
      if (title === TITLE && by === BY) {
        clearInterval(intervalId);
      }
    }, 100);
  }

  render() {
    const { title, by } = this.state;

    return (
      <div id="home-image">
        <p>{title}</p>
        <p>{by}</p>
      </div>
    );
  }
}

export {
  HomeImage,
};
