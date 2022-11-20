import React from 'react';
import Scrollable from './Scrollable';
import useProductsFetch from '../../hooks/useProductsFetch';
import {
  productWrapper
} from '../../styles/components/home/Home.module.scss';

export default function Home() {
  const types = ['movies', 'books', 'shows'];
  const products = types.map(type => useProductsFetch(
      `${process.env.REACT_APP_SERVER}/${type}`,
      { page: 1 }
    ).items
  );

  return (
    <div>
      {products.map((arr, i) => (
        <div className={productWrapper}>
          {types[i]}
          <Scrollable data={arr} />
        </div>
      ))}
    </div>
  );
}
