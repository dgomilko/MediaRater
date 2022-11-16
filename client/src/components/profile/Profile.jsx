import React from 'react';
import useDescriptionFetch from '../../hooks/useDescriptionFetch';
import { Routes, Route } from 'react-router-dom';
import Recommendations from './Recommendations';
import UserReviews from './UserReviews';
import AccLogo from './AccLogo';
import ProfileNavbar from './ProfileNavbar';
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
  const types = ['movie', 'book', 'show'];
  
  return (
    <div>
      {error || (
        <div className={accountWrapper}>
          <AccLogo name={data?.name} className={logo} />
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
    <ProfileNavbar />
    <Routes>
      {types.map(type => (
        <Route path={`${type}-reviews`} element={<UserReviews type={type} />}/>
      ))}
      {types.map(type => (
        <Route path={`${type}-recommendations`} element={<Recommendations type={type} />}/>
      ))} 
    </Routes>
    </div>
  );
};
