import * as React from 'react';

type Props = {};
type State = {
  by: string,
  showByCursor: boolean,
  showTitleCursor: boolean,
  title: string,
};

const INITIAL_STATE: State = {
  by: '',
  showByCursor: false,
  showTitleCursor: false,
  title: '',
};

type AnimationDefinition = (State | 'finish')

const generateFrame = (partialState: Partial<State>): State => ({
  ...INITIAL_STATE,
  ...partialState,
});

const ANIMATION_TIME_LINE: { [FrameKey: string]: AnimationDefinition } = {
  Frame0: generateFrame({ showTitleCursor: true }),
  Frame5: generateFrame({ showTitleCursor: false }),
  Frame10: generateFrame({ showTitleCursor: true }),
  Frame15: generateFrame({ showTitleCursor: false }),
  Frame20: generateFrame({ showTitleCursor: true }),
  Frame21: generateFrame({ title: 'P', showTitleCursor: true }),
  Frame22: generateFrame({ title: 'Po', showTitleCursor: true }),
  Frame23: generateFrame({ title: 'Por', showTitleCursor: true }),
  Frame24: generateFrame({ title: 'Port', showTitleCursor: true }),
  Frame25: generateFrame({ title: 'Portf', showTitleCursor: true }),
  Frame26: generateFrame({ title: 'Portfo', showTitleCursor: true }),
  Frame27: generateFrame({ title: 'Portfol', showTitleCursor: true }),
  Frame28: generateFrame({ title: 'Portfoli', showTitleCursor: true }),
  Frame29: generateFrame({ title: 'Portfolio', showTitleCursor: true }),
  Frame34: generateFrame({ title: 'Portfolio', showByCursor: true }),
  Frame39: generateFrame({ title: 'Portfolio', showByCursor: false }),
  Frame44: generateFrame({ title: 'Portfolio', showByCursor: true }),
  Frame49: generateFrame({ title: 'Portfolio', by: 'b', showByCursor: true }),
  Frame50: generateFrame({ title: 'Portfolio', by: 'by', showByCursor: true }),
  Frame51: generateFrame({ title: 'Portfolio', by: 'by h', showByCursor: true }),
  Frame52: generateFrame({ title: 'Portfolio', by: 'by hy', showByCursor: true }),
  Frame53: generateFrame({ title: 'Portfolio', by: 'by hyi', showByCursor: true }),
  Frame54: generateFrame({ title: 'Portfolio', by: 'by hyir', showByCursor: true }),
  Frame55: generateFrame({ title: 'Portfolio', by: 'by hyiro', showByCursor: true }),
  Frame56: generateFrame({ title: 'Portfolio', by: 'by hyirom', showByCursor: true }),
  Frame57: generateFrame({ title: 'Portfolio', by: 'by hyiromo', showByCursor: true }),
  Frame58: generateFrame({ title: 'Portfolio', by: 'by hyiromor', showByCursor: true }),
  Frame59: generateFrame({ title: 'Portfolio', by: 'by hyiromori', showByCursor: true }),
  Frame64: generateFrame({ title: 'Portfolio', by: 'by hyiromori', showByCursor: false }),
  Frame69: 'finish',
};

class InitialScreen extends React.Component<Props, State> {
  intervalId: (NodeJS.Timer | null);
  state: State = INITIAL_STATE;

  componentDidMount(): void {
    let count: number = 0;
    this.intervalId = setInterval(() => {
      const animation: AnimationDefinition = ANIMATION_TIME_LINE[`Frame${count}`];
      if (animation === 'finish') {
        this.stopInterval();
      } else if (animation != null) {
        this.setState(animation);
      }
      count += 1;
    }, 100);
  }

  componentWillUnmount() {
    this.stopInterval();
  }

  stopInterval() {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    const {
      by,
      showByCursor,
      showTitleCursor,
      title,
    } = this.state;

    return (
      <div id="initial-screen">
        <div>
          <div
            id="initial-screen-title"
            className={title === '' ? 'show' : ''}
          >
            {title}
          </div>
          <div
            id="initial-screen-title-cursor"
            className={showTitleCursor ? 'show' : ''}
          />
        </div>
        <div>
          <div id="initial-screen-by-name">
            {by}
          </div>
          <div
            id="initial-screen-by-name-cursor"
            className={showByCursor ? 'show' : ''}
          />
        </div>
      </div>
    );
  }
}

export {
  InitialScreen,
};
