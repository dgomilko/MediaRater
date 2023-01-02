import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import defaultOptions from './defaultOptions';
import { mainApi } from '../api/mainApi';

export default function useDescriptionFetch(userParam, type) {
  const { userState } = useContext(UserContext);
  const { id } = useParams();
  const { id: user_id } = userState;
  const { options, loading, error, data } = defaultOptions();

  useEffect(() => {
    if (!id || user_id === undefined) return;
    mainApi[`${type}Desc`]({ [userParam]: user_id, id }, options);
  }, [userState, id]);

  return { data, error, loading };
};
