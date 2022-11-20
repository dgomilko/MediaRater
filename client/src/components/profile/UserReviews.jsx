import React, { useEffect } from 'react';
import useFetchReviews from '../../hooks/useFetchReviews';
import { useLocation, useNavigate } from 'react-router-dom';
import ReviewsList from '../reviews/ReviewsList';
import {
  authorWrapper,
  logoWrapper,
  username,
  title
} from '../../styles/components/product/ProductReviews.module.scss';

export default function UserReviews({ type }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setError,
    pageDispatch,
    reviewsDispatch,
    reviewsData,
    error,
    data
  } = useFetchReviews(
    `${process.env.REACT_APP_SERVER}/user/${type}-reviews`, true
  );

  useEffect(() => {
    setError('');
    reviewsDispatch({type: 'CLEAR'});
    pageDispatch({type: 'CLEAR'});
  }, [location]);

  const onProductClick = id => navigate(`/${type}/${id}`);

  const reviewHeader = (product) => (
    <div className={authorWrapper}>
      <p>A review of</p>
        <div className={logoWrapper}>
          <span
            onClick={() => onProductClick(product.product_id)}
            className={title}
          >
            {product.product}
          </span>
      </div>
    </div>
  );
  
  return <ReviewsList
    header={reviewHeader}
    data={reviewsData.data}
    available={data.next_available}
    error={error}
    dispatch={pageDispatch}
  />;
};
