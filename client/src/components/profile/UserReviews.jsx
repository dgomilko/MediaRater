import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetchReviews from '../../hooks/review/useFetchReviews';
import ReviewsList from '../reviews/ReviewsList';
import {
  authorWrapper,
  logoWrapper,
  title
} from '../../styles/components/product/ProductReviews.module.scss';

export default function UserReviews({ type }) {
  const [options, setOptions] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setError,
    pageDispatch,
    reviewsDispatch,
    reviewsData,
    error,
    data,
    loading,
    setLoading
  } = useFetchReviews(`user${type}`, options);

  const resetPage = () => {
    setError('');
    setLoading(true);
    reviewsDispatch({type: 'CLEAR'});
    pageDispatch({type: 'CLEAR'});
  };

  useEffect(() => {
    if (!Object.keys(options).length) return;
    setOptions({});
    resetPage();
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
    setOptions={setOptions}
    options={options}
    header={reviewHeader}
    loading={loading}
    data={reviewsData.data}
    available={data.next_available}
    error={error}
    dispatch={pageDispatch}
    onClick={resetPage}
  />;
};
