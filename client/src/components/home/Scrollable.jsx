import React from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from '../product/Rating';
import {
  horizontalWrapper,
  productCard,
  rate
} from '../../styles/components/home/Scrollable.module.scss';

export default function Scrollable({ data, type }) {
  const navigate = useNavigate();

  const onProductClick = id =>
    navigate(`/${type.slice(0, type.length - 1)}/${id}`);
  
  return (
    <div className={horizontalWrapper}>
      {data.map(p => (
        <div onClick={() => onProductClick(p.id)} className={productCard}>
          <img src={p.img_path}/>
          <Rating rating={p.rating} className={rate} />
          <p>{p.title}</p>
        </div>
      ))}
    </div>
  );
};
