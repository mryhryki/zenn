import * as React from 'react';
import './text_input.scss';

type Props = {
  className?: string,
  label?: string,
  maxLength: number,
  onChangeText: (inputValue: string) => void,
  password?: boolean,
  placeHolder?: string,
  value: string,
};

const TextInput = (props: Props) => {
  const {
    className,
    label,
    maxLength,
    onChangeText,
    password,
    placeHolder,
    value,
  } = props;

  return (
    <div className={`text-input ${className}`}>
      {label && (<div className="text-input-label">{label}</div>)}
      <input
        placeholder={placeHolder}
        type={password ? 'password' : 'text'}
        onChange={(event) => onChangeText(event.target.value)}
        maxLength={maxLength}
        value={value || ''}
      />
    </div>
  );
};

export { TextInput };
