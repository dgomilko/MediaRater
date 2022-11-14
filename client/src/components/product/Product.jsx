import React from 'react';
import useDescriptionFetch from '../../hooks/useDescriptionFetch';

export default function Product({ type }) {
  const { data, error } = useDescriptionFetch(
    'user_id',
    `product/${type}-desc`
  );
  
  return (
    <div>
      {error ? error : JSON.stringify(data)}
    </div>
  );
};
