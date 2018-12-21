import * as React from 'react';
import './check_box.scss';

type Props = {
  checked: boolean,
  className?: string,
  children: string,
  onClick: (check: boolean) => void,
};

class CheckBox extends React.Component<Props> {
  static defaultProps = {
    className: '',
  };

  render() {
    const {
      checked,
      children,
      className,
      onClick,
    } = this.props;

    return (
      <a
        className={`check-box-presenter ${className}`}
        onClick={() => onClick(!checked)}
      >
        <span className={`mark ${checked ? 'checked' : ''}`} />
        <span className="label"> {children} </span>
      </a>
    );
  };
}

export {
  CheckBox,
};
