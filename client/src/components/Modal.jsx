import React from 'react';
import {
  modalWrapper,
  header,
  close,
} from '../styles/components/Modal.module.scss';

export default function Modal({ children, closeFn, className, display }) {
  const style = { 
    display: display ? 'block' : 'none'
  };

  const closeModal = e => {
    e.stopPropagation();
    closeFn();
  };

  return (
    <div className={modalWrapper} style={style}>
      <div className={className} onClick={e => e.stopPropagation()}>
        <div className={header}>
          <span className={close} onClick={closeModal}>&times;</span>
        </div>
        {children}
      </div>
    </div>
  );
};
