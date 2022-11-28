import React, { useContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import useDescriptionFetch from '../../hooks/useDescriptionFetch';
import Loading from '../Loading';
import ErrorWrapper from '../ErrorWrapper';
import ProductReviews from './ProductReviews'; 
import ProductNavbar from './ProductNavbar';
import ProductStats from './ProductStats';
import AddReviewModal from '../reviews/AddReviewModal';
import Rating from './Rating';
import {
  descriptionWrapper,
  textDescription,
  titleRow,
  genreLengthWrapper,
  ratingScore,
  scoreWrapper,
  synopsis,
  addReview,
  addReviewWrapper,
} from '../../styles/components/product/Product.module.scss';

export default function Product({ type }) {
  const { userState } = useContext(UserContext);
  const [modal, setModal] = useState(false);
  const { data, error, loading } = useDescriptionFetch(
    'user_id',
    `product/${type}-desc`
  );
  const productLength = {
    'movie': data?.runtime,
    'show': `${data?.seasons} s (${data?.episodes} ep)`,
    'book': `${data?.pages} pages`,
  };
  const productAuthor = {
    'movie': [data?.director],
    'book': [data?.author],
  };
  const toggleModal = () => setModal(!modal);

  return (loading ? <Loading/> :
    <ErrorWrapper error={error}>
      <div>
        <div className={descriptionWrapper}>
          <div>
            <img src={data?.img_path}/>
          </div>
          <div className={textDescription}>
            <div className={titleRow}>
              <p>{data?.title}</p>
              <span>({data?.release?.slice(0, 4)})</span>
            </div>
            <div className={genreLengthWrapper}>
              <p>{data?.genres?.join(', ')}</p>
              <p>•</p>
              <p>{productLength[type]}</p>
              {type === 'show' ? '' : <p>•</p>} 
              {type === 'show' ? '' : <p>{productAuthor[type]}</p>}            
            </div>
            <div className={scoreWrapper}>
              <p>Average score:</p>
              <Rating className={ratingScore} rating={data?.rating} />
              {data?.reviewed ? <p>Your score:</p> : ''}
              {data?.reviewed ?
                <Rating className={ratingScore} rating={data.reviewed} /> :
                userState?.token ?
                <div className={addReviewWrapper}>
                    <AddReviewModal type={type} productId={data.id} display={modal} closeFn={toggleModal}/>
                    <input
                      type='button'
                      className={addReview}
                      value='Add review'
                      onClick={toggleModal} 
                      />
                  </div>  : ''
              }
            </div>
            <div className={synopsis}>
              <p>Synopsis:</p>
              <span>{data?.synopsis}</span>
            </div>
          </div>
        </div>
        <ProductNavbar />
        <Routes>
          <Route path='' element={<ProductReviews type={type} />}/>
          <Route path='stats' element={<ProductStats type={type} />}/>
        </Routes>
      </div>
    </ErrorWrapper>
  );
};
