import * as React from 'react';

type Props = {
  onAnimationFinish: () => void,
};
type State = {
  by: string,
  fadeOut: boolean,
  showByCursor: boolean,
  showTitleCursor: boolean,
  title: string,
};

const INITIAL_STATE: State = {
  by: '',
  fadeOut: false,
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
  Frame69: generateFrame({ title: 'Portfolio', by: 'by hyiromori', showByCursor: true }),
  Frame74: generateFrame({ title: 'Portfolio', by: 'by hyiromori', showByCursor: false }),
  Frame79: generateFrame({ title: 'Portfolio', by: 'by hyiromori', showByCursor: true }),
  Frame84: generateFrame({ title: 'Portfolio', by: 'by hyiromori', showByCursor: false }),
  Frame85: 'finish',
};

class InitialScreen extends React.Component<Props, State> {
  state: State = INITIAL_STATE;

  componentDidMount(): void {
    const { onAnimationFinish } = this.props;
    let count: number = 0;

    const intervalId = setInterval(() => {
      const animation: AnimationDefinition = ANIMATION_TIME_LINE[`Frame${count}`];
      if (animation === 'finish') {
        clearInterval(intervalId);
        this.setState((prev) => ({ ...prev, fadeOut: true }));
        setTimeout(onAnimationFinish, 1000);
      } else if (animation != null) {
        this.setState(animation);
      }
      count += 1;
    }, 100);
  }

  render() {
    const {
      by,
      fadeOut,
      showByCursor,
      showTitleCursor,
      title,
    } = this.state;

    return (
      <div
        id="initial-screen-wrapper"
        className={fadeOut ? 'hide' : ''}
      >
        <div id="initial-screen">
          <div
            id="initial-screen-title"
            className={[
              showTitleCursor ? 'initial-screen-cursor' : '',
              title === '' ? 'no-text' : '',
            ].join(' ')}
          >
            {title}
          </div>
          <br />
          <div
            id="initial-screen-by-name"
            className={[
              showByCursor ? 'initial-screen-cursor' : '',
              by === '' ? 'no-text' : '',
            ].join(' ')}
          >
            {by}
          </div>
        </div>
      </div>
    );
  }
}

export {
  InitialScreen,
};
