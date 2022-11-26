import React from 'react';
import CollapsibleReview from './CollapsibleReview';
import Error from '../Error';
import {
  reviewsWrapper,
  loadMore,
  btnWrapper
} from '../../styles/components/reviews/ReviewsList.module.scss';

export default function ReviewsList({ header, data, error, dispatch, available }) {
  return (error ? <Error msg={error.message} /> :
    <div className={reviewsWrapper}>
      <div>
        {data?.map(p =>
          <CollapsibleReview product={p} header={header(p)} />)}
        <div className={btnWrapper}>
          <input
            className={loadMore}
            type='button'
            value='Load more'
            disabled={!available}
            onClick={() => dispatch({type: 'ADVANCE'})}
          />
        </div>
      </div>
    </div>
  );
};
