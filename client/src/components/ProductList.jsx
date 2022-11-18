import React, {
  useEffect,
  useReducer,
  useState,
  useRef,
  useCallback
} from 'react';
import LazyLoadList from './LazyLoadList';
import { useLocation, useNavigate } from 'react-router-dom';
import productsReducer from '../reducers/productsReduser';
import pageReducer from '../reducers/pageReducer';

const useFetch = (url, pageData, dispatch, field) => {
  const [items, setItems] = useState([]);
  const [outOfContent, setOutOfContent] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (outOfContent) return;
    const fetchList = async page => {
      const requestInfo = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page })
      };
      try {
        const response = await fetch(url, requestInfo);
        const data = await response.json();
        if (response.status >= 400) {
          if (response.status === 404 && data.message) {
            setOutOfContent(true);
          } else {
            const message = data.message || 'Unknown server error';
            throw new Error(message);
          }
        }
        else {
          setItems(data[field]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchList(pageData.page);
  }, [dispatch, pageData.page]);

  useEffect(() => {
    setItems([]);
    setOutOfContent(false);
  }, [location]);

  useEffect(() => {
    if (outOfContent || !items.length) return;
    dispatch({ type: 'FETCHING', payload: true });
    dispatch({ type: 'LOAD', payload: items });
    dispatch({ type: 'FETCHING', payload: false });
  }, [items, outOfContent]);
}

export default function ProductList({ type }) {
  const [pageData, pageDispatch] = useReducer(pageReducer, { page: 1 })
  const [productsList, productsDispatch] = useReducer(
    productsReducer,
    { data: [], fetching: true }
  );
  let bottomRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    pageDispatch({ type: 'CLEAR' });
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

  useFetch(
    `${process.env.REACT_APP_SERVER}/${type}`,
    pageData,
    productsDispatch,
    'products'
  );
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
