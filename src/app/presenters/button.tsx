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
      <a
        className={`button-presenter ${className}`}
        onClick={active ? onClick : null}
      >
        {children}
      </a>
    );
  };
}

export {
  Button,
};
