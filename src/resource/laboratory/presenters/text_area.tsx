import * as React from 'react';
import './text_area.scss';

type Props = {
  children: string,
  className?: string,
  label?: string,
  onChange: (inputText: string) => void,
};

class TextArea extends React.Component<Props> {
  static defaultProps = {
    className: '',
    label: '',
  };

  render() {
    const {
      children,
      className,
      label,
      onChange,
    } = this.props;

    return (
      <div className={`text-area-presenter ${className}`}>
        {label && (<div className="text-area-label">{label}</div>)}
        <textarea
          onChange={(event: any) => {
            const value = event.target.value;
            if (typeof value === 'string') {
              onChange(value);
            }
          }}
          value={children || ''}
        />
      </div>
    );
  };
}

export {
  TextArea,
};
