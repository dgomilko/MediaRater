import React from 'react';
import { errWrapper } from '../styles/components/Error.module.scss';

export default function ErrorWrapper({ children, error }) {
  return (error ? 
    <div className={errWrapper}>
      {error.message}
    </div> :
    children
  );
};
