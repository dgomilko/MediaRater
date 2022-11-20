import React, { useEffect, useReducer, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LazyLoadList from './LazyLoadList';
import useProductsFetch from '../hooks/useProductsFetch.js';
import productsReducer from '../reducers/productsReduser';
import pageReducer from '../reducers/pageReducer';

export default function ProductList({ type }) {
  const [pageData, pageDispatch] = useReducer(pageReducer, { page: 0 })
  const [productsList, productsDispatch] = useReducer(
    productsReducer,
    { data: [], fetching: true }
  );
  let bottomRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    pageDispatch({ type: 'CLEAR', payload: 0 });
    productsDispatch({ type: 'CLEAR' });
  }, [location]);

  const bottomObserverClb = node => {
    new IntersectionObserver(elements => elements.forEach(e => {
      if (e.intersectionRatio > 0)
        pageDispatch({ type: 'ADVANCE' });
      })
    ).observe(node);
  };

  const bottomObserver = useCallback(
    bottomObserverClb,
    [pageDispatch]
  );

  const onProductClick = id =>
    navigate(`/${type.slice(0, type.length - 1)}/${id}`);

  useEffect(() => {
    if (bottomRef.current) bottomObserver(bottomRef.current);
  }, [bottomObserver, bottomRef]);

  const { items, setItems, outOfContent, setOutOfContent } = useProductsFetch(
    `${process.env.REACT_APP_SERVER}/${type}`,
    pageData
  );

  useEffect(() => {
    setItems([]);
    setOutOfContent(false);
  }, [location]);

  useEffect(() => {
    if (outOfContent || !items.length) return;
    productsDispatch({ type: 'FETCHING', payload: true });
    productsDispatch({ type: 'LOAD', payload: items });
    productsDispatch({ type: 'FETCHING', payload: false });
  }, [items, outOfContent]);

  return (
    <div>
      <LazyLoadList
        loading={productsList.fetching}
        data={productsList.data}
        onClick={onProductClick}
      />
      <div ref={bottomRef}></div>
    </div>
  );
};
