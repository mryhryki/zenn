import * as React from 'react';
import './text_input.scss';

type Props = {
  active?: boolean,
  className?: string,
  label?: string,
  maxLength: number,
  onChangeText: (inputValue: string) => void,
  password?: boolean,
  placeHolder?: string,
  value: string,
};

class TextInput extends React.Component<Props> {
  static defaultProps = {
    active: true,
  };

  render() {
    const {
      active,
      className,
      label,
      maxLength,
      onChangeText,
      password,
      placeHolder,
      value,
    } = this.props;

    return (
      <div className={`text-input ${className}`}>
        {label && (<div className="text-input-label">{label}</div>)}
        <input
          placeholder={placeHolder}
          type={password ? 'password' : 'text'}
          onChange={(event) => onChangeText(event.target.value)}
          maxLength={maxLength}
          value={value || ''}
          readOnly={!active}
        />
      </div>
    );
  }
}

export { TextInput };
