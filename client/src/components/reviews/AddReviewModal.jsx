import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import StarsRate from './StarsRate';
import Modal from '../Modal';
import Error from '../Error';
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

  const handleAddReview = async () => {
    if (!userState.id || !productId) return;
    const { token, id: user_id } = userState;
    const body = {
      text,
      user_id,
      rate: rating,
      product_id: productId,
    };
    const requestInfo = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };
    const url = `${process.env.REACT_APP_SERVER}/product/new-${type}-review`;
    try {
      const response = await fetch(url, requestInfo);
      const json = await response.json();
      if (response.status >= 400) {
        closeFn();
        if (json.message === 'Signature expired')
          userDispatch({type: 'SET_INFO', payload: { expired: true }});
        const message = json.message || 'Unknown server error';
        throw new Error(message);
      } else {
        navigate(`/${type}/${json.product_id}`);
        userDispatch({
          type: 'SET_INFO',
          payload: { id: json.user_id, expired: false }
        });
        closeFn();
      }
    } catch (e) {
      setError(e);
    }
  };

  return (error ? <Error msg={error.message} /> :
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
  );
};
