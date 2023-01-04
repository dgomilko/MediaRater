import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import useStorage from '../useStorage';
import { mainApi } from '../../api/mainApi';
import { statuses } from '../../utils/statuses';

export default function useHandleReview(type, id, closeFn) {
  const { userState, userDispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);

  const { handleExpiration } = useStorage();

  const handleAddReview = async () => {
    if (!userState.id || !id) return;
    const { token, id: user_id } = userState;
    const body = {
      text,
      user_id,
      rate: rating,
      product_id: id,
    };
    const options = {
      responseHandler: (response, json) => {
        if (response.status >= statuses.BAD_REQUEST)
          handleExpiration(json);
        else {
          navigate(`/${type}/${json.product_id}`);
          userDispatch({ type: 'SET_INFO', payload: { expired: false }});
        }
      },
      errHandler: e => setError(e),
      finallyHandler: () => closeFn(),
    };
    await mainApi[`${type}ReviewAdd`](body, options, token);
  };

  return { handleAddReview, error, setText, rating, setRating };
};
