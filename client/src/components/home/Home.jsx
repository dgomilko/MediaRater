import React from 'react';
import Scrollable from './Scrollable';
import useProductsFetch from '../../hooks/useProductsFetch';
import {
  productWrapper,
  listsWrapper,
  typeTitle,
  popular,
  heading
} from '../../styles/components/home/Home.module.scss';

export default function Home() {
  const types = ['Movies', 'Shows', 'Books'];
  const products = types.map(type => useProductsFetch(
      `${process.env.REACT_APP_SERVER}/${type.toLowerCase()}`,
      { page: 1 }
    ).items
  );

  return (
    <div className={listsWrapper}>
      <div className={heading}>
        <p>Welcome. Explore, review and get recommendations now.</p>
      </div>
      <p className={popular}>What's popular:</p>
      {products.map((arr, i) => (
        <div className={productWrapper}>
          <span className={typeTitle}>{types[i]}:</span>
          <Scrollable data={arr} type={types[i]} />
        </div>
      ))}
    </div>
  );
}
