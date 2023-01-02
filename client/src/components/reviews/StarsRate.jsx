import React, { useState } from 'react';
import {
  starOn,
  starOff,
} from '../../styles/components/reviews/StarsRate.module.scss';

export default function StarsRate({ rating, setRating }) {
  const [hover, setHover] = useState(0);
  const onClick = (i) => {
    i === rating ? setRating(0) : setRating(i);
  }

  return (
    <div>
      {[...Array(5)].map((_, i) => {
        const className = i < (rating || hover) ? starOn : starOff;
        const idx = i + 1;
        return (
          <span
            className={className}
            onClick={() => onClick(idx)}
            onMouseEnter={() => setHover(idx)}
            onMouseLeave={() => setHover(rating)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};
