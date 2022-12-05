import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import defaultOptions from './defaultOptions';
import { mainApi } from '../api/mainApi';

export default function useFetchGenres() {
  const type = useLocation().pathname.split('/')[1];
  const {
    options,
    error,
    setError,
    setLoading,
    loading,
    data
  } = defaultOptions();

  useEffect(() => {
    if (!type) return;
    const fnName = `${type
      .slice(0, type.length - 1)
      .toLowerCase()}Genres`;
    setError('');
    setLoading(true);
    mainApi[fnName]({}, options);
  }, [type]);

  return { data, error, loading };
};