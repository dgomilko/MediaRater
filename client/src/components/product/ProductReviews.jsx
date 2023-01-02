import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchReviews from '../../hooks/review/useFetchReviews';
import ReviewsList from '../reviews/ReviewsList';
import AccLogo from '../profile/AccLogo';
import {
  authorWrapper,
  accLogo,
  logoWrapper,
  username,
} from '../../styles/components/product/ProductReviews.module.scss';

export default function ProductReviews({ type }) {
  const [options, setOptions] = useState({});
  const navigate = useNavigate();

  const {
    pageDispatch,
    reviewsDispatch,
    reviewsData,
    error,
    data,
    loading,
    setError,
    setLoading
  } =
    useFetchReviews(type, options);

  const onUserClick = id => navigate(`/user/${id}`);

  const onClick = () => {
    pageDispatch({ type: 'CLEAR' });
    reviewsDispatch({ type: 'CLEAR' });
    setError(''),
    setLoading(true)
  };

  const reviewHeader = (product) => (
    <div className={authorWrapper}>
      <p>A review by</p>
        <div className={logoWrapper} onClick={() => onUserClick(product.author_id)}>
          <AccLogo className={accLogo} name={product.author} />
          <span className={username}>{product.author}</span>
      </div>
    </div>
  );

  return <ReviewsList
      setOptions={setOptions}
      options={options}
      loading={loading}
      loadingStyle={{'height': '150px'}}
      header={reviewHeader}
      data={reviewsData.data}
      available={data.next_available}
      error={error}
      dispatch={pageDispatch}
      onClick={onClick}
    />;
};
