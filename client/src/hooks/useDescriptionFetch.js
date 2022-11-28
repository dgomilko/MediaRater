import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import defaultOptions from './defaultOptions';
import { post } from '../utils/request';

export default function useDescriptionFetch(userParam, route) {
  const { userState } = useContext(UserContext);
  const { id } = useParams();
  const { id: user_id } = userState;
  const { options, loading, error, data } = defaultOptions();

  useEffect(() => {
    if (!id || user_id === undefined) return;
    post(route, { [userParam]: user_id, id }, options);
  }, [userState]);

  return { data, error, loading };
};
