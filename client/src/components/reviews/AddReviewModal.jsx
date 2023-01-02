import React from 'react';
import StarsRate from './StarsRate';
import Modal from '../Modal';
import ErrorWrapper from '../ErrorWrapper';
import useHandleReview from '../../hooks/review/useHandleReview';
import {
  modal,
  textbox,
  rateWrapper,
  textWrapper,
  blockWrapper,
  addReview,
} from '../../styles/components/reviews/AddReviewModal.module.scss';

export default function AddReviewModal({ closeFn, display, type, productId }) {
  const {
    handleAddReview,
    error,
    setText,
    rating,
    setRating
  } = useHandleReview(type, productId, closeFn);

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
