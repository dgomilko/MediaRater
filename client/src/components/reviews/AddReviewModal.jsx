import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import useStorage from '../../hooks/useStorage';
import StarsRate from './StarsRate';
import Modal from '../Modal';
import ErrorWrapper from '../ErrorWrapper';
import { post } from '../../utils/request';
import {
  modal,
  textbox,
  rateWrapper,
  textWrapper,
  blockWrapper,
  addReview,
} from '../../styles/components/reviews/AddReviewModal.module.scss';

export default function AddReviewModal({ closeFn, display, type, productId }) {
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const { userState, userDispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const { handleExpiration } = useStorage();

  const handleAddReview = async () => {
    if (!userState.id || !productId) return;
    const { token, id: user_id } = userState;
    const body = {
      text,
      user_id,
      rate: rating,
      product_id: productId,
    };
    const options = {
      responseHandler: (response, json) => {
        if (response.status >= 400) {
          handleExpiration(json);
        } else {
          navigate(`/${type}/${json.product_id}`);
          userDispatch({
            type: 'SET_INFO',
            payload: { id: json.user_id, expired: false }
          });
        }
      },
      errHandler: (e) => setError(e),
      finallyHandler: () => closeFn(),
    };
    await post(`product/new-${type}-review`, body, options, token);
  };

  return (
    <ErrorWrapper error={error}> 
      <Modal display={display} closeFn={closeFn} className={modal}>
        <div className={rateWrapper}>
          <span>Rate this content:</span>
          <StarsRate rating={rating} setRating={setRating} />
        </div>
        <div className={blockWrapper}>
          <div className={textWrapper}>
            <span>Your review:</span>
            <textarea class={textbox} onChange={(e) => setText(e.target.value)}/>
          </div>
          <input
            type='button'
            className={addReview}
            onClick={handleAddReview}
            value='Add review'
            />
        </div>
      </Modal>
    </ErrorWrapper>
  );
};
