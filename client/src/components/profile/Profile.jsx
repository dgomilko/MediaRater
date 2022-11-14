import React from 'react';
import useDescriptionFetch from '../../hooks/useDescriptionFetch';

export default function Profile() {
  const { data, error } = useDescriptionFetch(
    'my_id',
    'user/profile'
  );
  
  return (
    <div>
      {error ? error : JSON.stringify(data)}
    </div>
  );
};
