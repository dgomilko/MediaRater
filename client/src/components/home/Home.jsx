import React, { useState, useEffect } from 'react';
import Loading from '../Loading';
import Scrollable from './Scrollable';
import useProductsFetch from '../../hooks/useProductsFetch';
import { types } from '../../utils/productTypes';
import {
  productWrapper,
  listsWrapper,
  typeTitle,
  popular,
  heading
} from '../../styles/components/home/Home.module.scss';

export default function Home() {
  const [loading, setLoading] = useState([...Array(types.length)]
    .map(() => true));
  const products = types.map(type =>
    useProductsFetch(`${type}s`, { page: 1 }).items
  );

  useEffect(() => {
    const someLoaded = products.filter(p => p.length).length;
    const allLoaded = loading.filter(l => !l).length === types.length;
    if (!someLoaded || allLoaded) return;
    setLoading(products.map(p => !p.length));
  }, [products]);
  
  return (
    <div className={listsWrapper}>
      <div className={heading}>
        <p>Welcome. Explore, review and get recommendations now.</p>
      </div>
      <p className={popular}>What's popular:</p>
      {products.map((arr, i) => {
        const type = types[i];
        return (
          <div className={productWrapper}>
            <span className={typeTitle}>
              {type.charAt(0).toUpperCase() + `${type.slice(1)}s`}:
            </span>
            {loading[i] ? <Loading /> : <Scrollable data={arr} type={type} />}
          </div>
        )
      })}
    </div>
  );
};
