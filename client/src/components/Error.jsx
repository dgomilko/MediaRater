import React from 'react';
import { errWrapper } from '../styles/components/Error.module.scss';

export default function Error({ msg }) {
  return (
    <div className={errWrapper}>
      {msg}
    </div>
  );
};
