import React, { useEffect, useReducer, useRef, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Error from '../Error';
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
  const navigate = useNavigate();

  const resetPage = () => {
    pageDispatch({ type: 'CLEAR', payload: 0 });
    productsDispatch({ type: 'CLEAR' });
    setError('');
  }

  useEffect(resetPage, [location]);

  const {
    items,
    setItems,
    outOfContent,
    setOutOfContent,
    error,
    setError
  } = useProductsFetch(
    `${process.env.REACT_APP_SERVER}/${type}`,
    pageData,
    options
  );

  const bottomObserverClb = node => {
    new IntersectionObserver(elements => elements.forEach(e => {
      if (e.intersectionRatio > 0)
        pageDispatch({ type: 'ADVANCE' });
      })
    ).observe(node);
  };

  const bottomObserver = useCallback(bottomObserverClb, [pageDispatch]);

  const onProductClick = id =>
    navigate(`/${type.slice(0, type.length - 1)}/${id}`);

  useEffect(() => {
    if (bottomRef.current) bottomObserver(bottomRef.current);
  }, [bottomObserver, bottomRef]);

  useEffect(() => {
    setItems([]);
    setOptions({});
    setOutOfContent(false);
  }, [location]);

  useEffect(() => {
    if (outOfContent || !items.length) return;
    productsDispatch({ type: 'FETCHING', payload: true });
    productsDispatch({ type: 'LOAD', payload: items });
    productsDispatch({ type: 'FETCHING', payload: false });
  }, [items, outOfContent]);

  return (error ? <Error msg={error.message} /> :
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
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
};
