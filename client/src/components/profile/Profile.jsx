import React from 'react';
import useDescriptionFetch from '../../hooks/useDescriptionFetch';
import {
  accountWrapper,
  logo,
  textInfoWrapper,
  detailsWrapper,
  username,
  bordered,
} from '../../styles/components/profile/Profile.module.scss';

export default function Profile() {
  const { data, error } = useDescriptionFetch(
    'my_id',
    'user/profile'
  );
  
  return (
    <div>
      {error ? error : (
        <div className={accountWrapper}>
          <div className={logo}>
            <span>{data?.name?.slice(0, 1)}</span>
          </div>
          <div className={textInfoWrapper}>
            <div className={username}>
              <p>{data?.name}</p>
              {data?.my_page ? <span>{data?.email}</span> : ''}
            </div>
            <div className={detailsWrapper}>
              <div className={bordered}>
                <p>Birthday: <span>{data?.birthday}</span></p>
                <p>Country: <span>{data?.country}</span></p>
              </div>
              <div>
                <p>Gender: <span>{data?.gender === 'f' ? 'Female' : 'Male'}</span></p>
                <p>Reviewed products: <span>{data?.reviews}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
