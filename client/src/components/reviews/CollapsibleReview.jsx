import React, { useRef, useState, useEffect } from 'react';
import Rating from '../product/Rating';
import {
  reviewAuthorWrapper,
  rating,
  textContentWrapper,
  reviewText,
  reviewTextWrapper,
  expand,
  reviewHeader
} from '../../styles/components/reviews/CollapsibleReview.module.scss';

export default function CollapsibleReview({ header, product }) {
  const ref = useRef();
  const [expandBtn, setExpandBtn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const clampedHeight = 120;

  useEffect(() => {
    if (ref.current.scrollHeight > clampedHeight) {
      setExpandBtn(true);
      setExpanded(false);
    }
  }, []);

  const expandStyle = {
    'whiteSpace': 'nowrap',
    'overflow': 'hidden',
    'textOverflow': 'ellipsis',
  }

  return (
    <div
      className={reviewTextWrapper}
      ref={ref}
    >
      <div className={reviewAuthorWrapper}>
        <Rating className={rating} rating={product.rate} />
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
          className={reviewText}
          style={expanded ? {} : expandStyle}
        >
          {product.text || ''}
        </p>
    </div>
  );
};
