import React from 'react';
import { loadingWrapper } from '../styles/components/Loading.module.scss';

export default function Loading({ style }) {
  return (
    <div style={style} className={loadingWrapper}>
      Loading...
    </div>
  );
};
