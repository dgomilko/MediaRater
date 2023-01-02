import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import defaultOptions from './defaultOptions';
import { mainApi } from '../api/mainApi';

export default function useFetchStats(type) {
  const { id } = useParams();
  const { options: handleOptions, error, loading, data } =
    defaultOptions();

  useEffect(() => {
    if (!id) return;
    mainApi[`${type}Stats`]({ id }, handleOptions);
  }, [id]);
  
  return { data, error, loading };
};
