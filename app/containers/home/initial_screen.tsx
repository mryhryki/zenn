import * as React from 'react';

type Props = {
  onAnimationFinish: () => void,
};
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
  Frame1: generateFrame({ showTitleCursor: true }),
  Frame5: generateFrame({ showTitleCursor: false }),
  Frame9: generateFrame({ showTitleCursor: true }),
  Frame13: generateFrame({ showTitleCursor: false }),
  Frame17: generateFrame({ showTitleCursor: true }),
  Frame20: generateFrame({ title: 'P', showTitleCursor: true }),
  Frame21: generateFrame({ title: 'Po', showTitleCursor: true }),
  Frame22: generateFrame({ title: 'Por', showTitleCursor: true }),
  Frame23: generateFrame({ title: 'Port', showTitleCursor: true }),
  Frame24: generateFrame({ title: 'Portf', showTitleCursor: true }),
  Frame25: generateFrame({ title: 'Portfo', showTitleCursor: true }),
  Frame26: generateFrame({ title: 'Portfol', showTitleCursor: true }),
  Frame27: generateFrame({ title: 'Portfoli', showTitleCursor: true }),
  Frame28: generateFrame({ title: 'Portfolio', showTitleCursor: true }),
  Frame31: generateFrame({ title: 'Portfolio', showByCursor: true }),
  Frame35: generateFrame({ title: 'Portfolio', showByCursor: false }),
  Frame39: generateFrame({ title: 'Portfolio', showByCursor: true }),
  Frame43: generateFrame({ title: 'Portfolio', showByCursor: false }),
  Frame47: generateFrame({ title: 'Portfolio', showByCursor: true }),
  Frame50: generateFrame({ title: 'Portfolio', by: 'b' }),
  Frame51: generateFrame({ title: 'Portfolio', by: 'by' }),
  Frame52: generateFrame({ title: 'Portfolio', by: 'by h' }),
  Frame53: generateFrame({ title: 'Portfolio', by: 'by hy' }),
  Frame54: generateFrame({ title: 'Portfolio', by: 'by hyi' }),
  Frame55: generateFrame({ title: 'Portfolio', by: 'by hyir' }),
  Frame56: generateFrame({ title: 'Portfolio', by: 'by hyiro' }),
  Frame57: generateFrame({ title: 'Portfolio', by: 'by hyirom' }),
  Frame58: generateFrame({ title: 'Portfolio', by: 'by hyiromo' }),
  Frame59: generateFrame({ title: 'Portfolio', by: 'by hyiromor' }),
  Frame60: generateFrame({ title: 'Portfolio', by: 'by hyiromori' }),
  Frame80: 'finish',
};

class InitialScreen extends React.Component<Props, State> {
  state: State = INITIAL_STATE;

  componentDidMount(): void {
    const { onAnimationFinish } = this.props;
    let count: number = 0;

    const intervalId = setInterval(() => {
      count += 1;
      const animation: AnimationDefinition = ANIMATION_TIME_LINE[`Frame${count}`];

      if (animation === 'finish') {
        clearInterval(intervalId);
        onAnimationFinish();
      } else if (animation != null) {
        this.setState(animation);
      }
    }, 100);
  }

  render() {
    const {
      title,
      by,
      showByCursor,
      showTitleCursor,
    } = this.state;

    return (
      <div id="home-image-wrapper">
        <div id="home-image">
          <div
            id="title"
            className={showTitleCursor ? 'cursor' : ''}
          >
            {title}
          </div>
          <div
            id="by"
            className={showByCursor ? 'cursor' : ''}
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
