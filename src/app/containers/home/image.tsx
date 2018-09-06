import * as React from 'react';

const TITLE = 'Portfolio';
const BY = 'by hyiromori';

type Props = {
  onAnimationFinish: () => void,
};
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
    const { onAnimationFinish } = this.props;
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
        setTimeout(onAnimationFinish, 3000);
      }
    }, 100);
  }

  render() {
    const { title, by } = this.state;

    return (
      <div id="home-image-wrapper">
        <div id="home-image">
          <h1>{title}</h1>
          <h2>{by}</h2>
        </div>
      </div>
    );
  }
}

export {
  HomeImage,
};
