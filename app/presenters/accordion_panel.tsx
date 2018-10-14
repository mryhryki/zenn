import * as React from 'react';
import IconArrow from '../icon/arrow.png';
import './accordion_panel.scss';

type Props = {
  children: React.ReactNode,
  initialDisplay?: boolean,
  title: string,
};

type State = {
  open: boolean,
}

class AccordionPanel extends React.Component<Props, State> {
  state: State;

  static defaultProps = {
    initialDisplay: false,
  };

  constructor(props: Props) {
    super(props);
    const { initialDisplay } = props;
    this.state = {
      open: initialDisplay,
    };
  }

  onTitleClick = () => this.setState((prevState: State) => ({
    open: !prevState.open,
  }));

  render() {
    const {
      title,
      children,
    } = this.props;
    const { open } = this.state;

    return (
      <div className="accordion-panel-presenter">
        <button
          className={`title${open ? ' open' : ''}`}
          onClick={this.onTitleClick}
        >
          {title}
        </button>
        {open ? (
          <div className="content-wrapper">
            {children}
          </div>
        ) : null}
        <button
          className="icon-arrow"
          onClick={this.onTitleClick}
        >
          {open ? '⬆ Close ⬆' : '⬇ Open ⬇'}
        </button>
      </div>
    );
  };
}

export {
  AccordionPanel,
};
