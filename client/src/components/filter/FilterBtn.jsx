import React from 'react';
import {
  searchBtn,
} from '../../styles/components/productsList/Filters.module.scss';

export default function FilterBtn({ options, setPrevOptions, prevOptions, onClick }) {
  const onSearchClick = () => {
    setPrevOptions({ ...options });
    onClick();
  };

  return <button
      className={searchBtn}
      disabled={!Object.keys(options).length ||
        JSON.stringify(options) === JSON.stringify(prevOptions)}
      onClick={onSearchClick}
      >Search</button>;
};
