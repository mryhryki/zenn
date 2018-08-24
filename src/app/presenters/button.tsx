import * as React from 'react';
import './button.scss';

type Props = {
  active?: boolean,
  className?: string,
  children: string,
  onClick: () => void,
};

class Button extends React.Component<Props> {
  static defaultProps = {
    active: true,
    className: '',
  };

  render() {
    const {
      active,
      children,
      className,
      onClick,
    } = this.props;

    return (
      <button
        className={`button-presenter ${className} ${active ? '' : 'disable'}`}
        onClick={active ? onClick : null}
      >
        {children}
      </button>
    );
  };
}

export {
  Button,
};
