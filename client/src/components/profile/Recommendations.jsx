import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import ErrorWrapper from '../ErrorWrapper';
import Loading from '../Loading';
import LazyLoadList from '../LazyLoadList';
import { post, throwResError } from '../../utils/request';
import useStorage from '../../hooks/useStorage';
import { UserContext } from '../../contexts/UserContext';

export default function Recommendations({ type }) {
  const { userState } = useContext(UserContext);
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  if (userState?.id !== id) return <Navigate to={`/user/${id}`} />;
  const { handleExpiration } = useStorage();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);
  const [taskId, setTaskId] = useState('');

  useEffect(() => {
    if (!userState.id) return;
    const options = {
      responseHandler: (response, json) => {
        response.status >= 400 ? handleExpiration(json) :
          setTaskId(json.task_id);
      },
      errHandler: (e) => setError(e)
    };

    setLoading(true);
    post(`recommend/rec-${type}s`, { id }, options, userState.token);
  }, [userState, location]);

  useEffect(() => {
    if (!taskId) return;

    const getTaskRes = async () => {
      const { token } = userState;
      const requestInfo = {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      };
      const url = `${process.env.REACT_APP_SERVER}/recommend/get-result/${taskId}`;
      try {
        const response = await fetch(url, requestInfo);
        const json = await response.json();
        if (response.status >= 400) {
          throwResError(json)
        } else if (json.status === 'PENDING') {
          setTimeout(() => getTaskRes(taskId), 100); 
        } else {
          setRecs(json.result);
          setLoading(false);
        }
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    getTaskRes();
  }, [taskId]);

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
