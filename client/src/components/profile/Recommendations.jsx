import React, { useContext } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Loading from '../Loading';
import ErrorWrapper from '../ErrorWrapper';
import LazyLoadList from '../LazyLoadList';
import useFetchRecs from '../../hooks/useFetchRecs';
import { UserContext } from '../../contexts/UserContext';

export default function Recommendations({ type }) {
  const { userState } = useContext(UserContext);
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  if (userState?.id !== id) return <Navigate to={`/user/${id}`} />;
  const navigate = useNavigate();
  const { error, loading, recs } = useFetchRecs(type);

  const onProductClick = id => navigate(`/${type}/${id}`);

  return (loading ? <Loading /> :
    <ErrorWrapper msg={error.message} >
      <div style={{'display': 'flex', 'justifyContent': 'center'}}>
        <LazyLoadList
          loading={false}
          data={recs}
          onClick={onProductClick}
          />
      </div>
    </ErrorWrapper>
  );
};
