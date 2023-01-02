import React from 'react';
import { errWrapper } from '../styles/components/Error.module.scss';

export default function ErrorWrapper({ children, error, style }) {
  return (error ? 
    <div className={errWrapper} style={style}>
      {error.message}
    </div> :
    children
  );
};
