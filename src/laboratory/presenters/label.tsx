import * as React from 'react';
import './label.scss';

type Props = {
  children: string,
  className?: string,
};

const Label = (props: Props) => {
  const {
    className,
    children,
  } = props;

  return (
    <div className={`label-presenter ${className ? className : ''}`}>
      {children}
    </div>
  );
};

export { Label };
