import React from 'react';
import CollapsibleReview from './CollapsibleReview';
import ErrorWrapper from '../ErrorWrapper';
import Loading from '../Loading';
import Filter from './Filter';
import {
  mainContainer,
  reviewsWrapper,
  loadMore,
  btnWrapper
} from '../../styles/components/reviews/ReviewsList.module.scss';

export default function ReviewsList(
  {
    loading,
    loadingStyle,
    header,
    data,
    error,
    dispatch,
    available,
    options,
    setOptions,
    onClick,
  }
) {

  return (
  <div className={mainContainer}>
    <Filter options={options} setOptions={setOptions} onClick={onClick} />
    {loading ? <div style={{width: '60%'}}><Loading style={loadingStyle} /></div> :
    <ErrorWrapper style={{width: '60%'}} error={error}>
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
    </ErrorWrapper>}
  </div>
  );
};
