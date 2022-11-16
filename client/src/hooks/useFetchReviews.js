import {
  useEffect,
  useState,
  useReducer,
} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import productsReducer from '../reducers/productsReduser';
import pageReducer from '../reducers/pageReducer';

export default function useFetchReviews(url) {
  const location = useLocation();
  const [error, setError] = useState('');
  const [data, setData] = useState({});
  const [reviewsData, reviewsDispatch] =
    useReducer(productsReducer, { data: [] });
  const [pageData, pageDispatch] =
    useReducer(pageReducer, { page: 1 });
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const requestInfo = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, page: pageData.page }),
      };
      try {
        const response = await fetch(url, requestInfo);
        const json = await response.json();
        if (response.status >= 400) {
          const message = json.message || 'Unknown server error';
          throw new Error(message);
        } else {
          setData(json);
        }
      } catch (e) {
        setError(e.message);
      };
    };

    fetchData();
  }, [location, pageData.page]);

  useEffect(() => {
    if (!data.reviews) return;
    reviewsDispatch({type: 'LOAD', payload: data.reviews});
  }, [data]);

  return {
    setError,
    pageDispatch,
    reviewsDispatch,
    reviewsData,
    error,
    data
  };
};
