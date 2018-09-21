import * as React from 'react';
import './modal.scss';

type Props = {
  children: React.ReactNode,
  onWrapperClick: () => void,
}

class Modal extends React.Component <Props> {
  render() {
    const {
      children,
      onWrapperClick,
    } = this.props;

    return (
      <button
        className="modal-presenter"
        onClick={onWrapperClick}
      >
        <div className="modal-content">
          {children}
        </div>
      </button>
    );
  }
}

export { Modal };
