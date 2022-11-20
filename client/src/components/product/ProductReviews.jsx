import React from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchReviews from '../../hooks/useFetchReviews';
import AccLogo from '../profile/AccLogo';
import ReviewsList from '../reviews/ReviewsList';
import {
  authorWrapper,
  accLogo,
  logoWrapper,
  username,
} from '../../styles/components/product/ProductReviews.module.scss';

export default function ProductReviews({ type }) {
  const navigate = useNavigate();

  const { pageDispatch, reviewsData, error, data } = useFetchReviews(
    `${process.env.REACT_APP_SERVER}/product/${type}-reviews`
  );

  const onUserClick = id => navigate(`/user/${id}`);

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
    header={reviewHeader}
    data={reviewsData.data}
    available={data.next_available}
    error={error}
    dispatch={pageDispatch}
  />;
};
