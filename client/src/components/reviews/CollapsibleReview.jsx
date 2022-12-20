import React, { useRef, useState, useEffect } from 'react';
import Rating from '../product/Rating';
import {
  reviewAuthorWrapper,
  rating,
  textContentWrapper,
  reviewText,
  reviewTextWrapper,
  expand,
  reviewHeader,
  date
} from '../../styles/components/reviews/CollapsibleReview.module.scss';

export default function CollapsibleReview({ header, product }) {
  const ref = useRef();
  const [expandBtn, setExpandBtn] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.offsetWidth < ref.current.scrollWidth) {
      setExpandBtn(true);
      setExpanded(false);
    }
  }, [ref]);

  const expandStyle = {
    'whiteSpace': 'nowrap',
    'overflow': 'hidden',
    'textOverflow': 'ellipsis',
  }

  return (
    <div className={reviewTextWrapper}>
      <div className={reviewAuthorWrapper}>
        <div>
          <Rating className={rating} rating={product.rate} />
          <span className={date}>{product.created}</span>
        </div>
        <div className={textContentWrapper}>
          <div className={reviewHeader}>
            {header}
            {expandBtn && (
              <p className={expand} onClick={() => setExpanded(!expanded)}>
                {expanded ? '︽' : '︾'}
              </p>
            )}
          </div>
        </div>
      </div>
        <p
          ref={ref}
          className={reviewText}
          style={expanded ? {} : expandStyle} 
        >
          {product.text || ''}
        </p>
    </div>
  );
};
