import React from 'react';
import { Routes, Route } from 'react-router-dom';
import useDescriptionFetch from '../../hooks/useDescriptionFetch';
import ProductReviews from './ProductReviews'; 
import ProductNavbar from './ProductNavbar';
import ProductStats from './ProductStats';
import Rating from './Rating';
import {
  descriptionWrapper,
  textDescription,
  titleRow,
  genreLengthWrapper,
  ratingScore,
  scoreWrapper,
  synopsis,
} from '../../styles/components/product/Product.module.scss';

export default function Product({ type }) {
  const { data, error } = useDescriptionFetch(
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

  return (
    <div>
      {error || (
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
            </div>
            <div className={synopsis}>
              <p>Synopsis:</p>
              <span>{data?.synopsis}</span>
            </div>
          </div>
        </div>
      )}
      <ProductNavbar />
      <Routes>
        <Route path='' element={<ProductReviews />}/>
        <Route path='stats' element={<ProductStats />}/>
      </Routes>
    </div>
  );
};
