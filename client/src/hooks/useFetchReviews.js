import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import productsReducer from '../reducers/productsReduser';
import pageReducer from '../reducers/pageReducer';
import { post } from '../utils/request';
import defaultOptions from './defaultOptions';

export default function useFetchReviews(url, onReload = false) {
  const params = useParams();
  const [reviewsData, reviewsDispatch] =
    useReducer(productsReducer, { data: [] });
  const [pageData, pageDispatch] =
    useReducer(pageReducer, { page: 1 });
  const { options, data, error, setError, loading, setLoading } =
    defaultOptions();
  const { id } = params;
  const deps = [pageData.page];
  if (onReload) deps.push(params);

  useEffect(() => {
    if (!id) return;
    post(url, { id, page: pageData.page }, options);
  }, deps);

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
    data,
    loading,
    setLoading,
  };
};
