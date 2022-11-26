import React from 'react';
import { loadingWrapper } from '../styles/components/Loading.module.scss';

export default function Loading() {
  return (
    <div className={loadingWrapper}>
      Loading...
    </div>
  );
};
