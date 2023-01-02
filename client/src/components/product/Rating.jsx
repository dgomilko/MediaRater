import React from 'react';

const calculateColor = rate => {
  if (rate < 0) return 'hsl(0, 0%, 55%)';
  const maxRate = 5;
  const percenage = rate / maxRate;
  const hue = (percenage * 120).toString(10);
  return `hsl(${hue}, 100%, 50%)`;
}

export default function Rating({ rating, className }) {
  return (
    <div className={className} style={{backgroundColor: calculateColor(rating)}} >
      <span>{rating >= 0 ? rating : 'TBD'}</span>
    </div>
  );
};
