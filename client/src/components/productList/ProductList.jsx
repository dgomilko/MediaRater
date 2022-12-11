import React, { useEffect, useReducer, useRef, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorWrapper from '../ErrorWrapper';
import Filters from './Filters';
import LazyLoadList from '../LazyLoadList';
import useProductsFetch from '../../hooks/useProductsFetch.js';
import productsReducer from '../../reducers/productsReduser';
import pageReducer from '../../reducers/pageReducer';
import {
  mainWrapper,
} from '../../styles/components/productsList/ProductList.module.scss';

export default function ProductList({ type }) {
  const [options, setOptions] = useState({});
  const [pageData, pageDispatch] = useReducer(pageReducer, { page: 0 })
  const [productsList, productsDispatch] = useReducer(
    productsReducer,
    { data: [], fetching: true }
  );
  let bottomRef = useRef(null);
  const location = useLocation();

  const resetPage = () => {
    pageDispatch({ type: 'CLEAR', payload: 0 });
    productsDispatch({ type: 'CLEAR' });
    setOutOfContent(false);
    setError('');
  };

  useEffect(resetPage, [location]);

  const {
    items,
    setItems,
    outOfContent,
    setOutOfContent,
    error,
    setError
  } = useProductsFetch(type, pageData, options);

  const bottomObserverClb = node => {
    new IntersectionObserver(elements => elements.forEach(e => {
      if (e.intersectionRatio > 0)
        pageDispatch({ type: 'ADVANCE' });
      })
    ).observe(node);
  };

  const bottomObserver = useCallback(bottomObserverClb, [pageDispatch]);

  const onProductClick = id =>
    window.open(`/${type.slice(0, type.length - 1)}/${id}`, '_blank');

  useEffect(() => {
    if (bottomRef.current) bottomObserver(bottomRef.current);
  }, [bottomObserver, bottomRef]);

  useEffect(() => {
    setItems([]);
    setOptions({});
    setOutOfContent(false);
  }, [location]);

  useEffect(() => {
    if (outOfContent || !items.length) {
      if (outOfContent)
        productsDispatch({ type: 'FETCHING', payload: false });
      return;
    };
    productsDispatch({ type: 'FETCHING', payload: true });
    productsDispatch({ type: 'LOAD', payload: items });
    productsDispatch({ type: 'FETCHING', payload: false });
  }, [items, outOfContent]);

  return (
    <div>
      <div className={mainWrapper}>
        <Filters
          setOptions={setOptions}
          options={options}
          onClick={resetPage}
        />
        <LazyLoadList
          loading={productsList.fetching}
          data={productsList.data}
          onClick={onProductClick}
        />
        {!outOfContent && <ErrorWrapper error={error} style={{'width': '80%'}} />}
        </div>
        <div ref={bottomRef}></div>
      </div>
  );
};
