import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Error from '../Error';
import Loading from '../Loading';
import LazyLoadList from '../LazyLoadList';
import { UserContext } from '../../contexts/UserContext';

export default function Recommendations({ type }) {
  const { userState, userDispatch } = useContext(UserContext);
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  if (userState?.id !== id) return <Navigate to={`/user/${id}`} />;
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);
  const [taskId, setTaskId] = useState('');

  useEffect(() => {
    const requestRecs = async () => {
      const { token, id } = userState;
      if (!id) return;
      const requestInfo = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      };
      const url = `${process.env.REACT_APP_SERVER}/recommend/rec-${type}s`;
      try {
        const response = await fetch(url, requestInfo);
        const json = await response.json();
        if (response.status >= 400) {
          if (json.message === 'Signature expired')
            userDispatch({type: 'SET_INFO', payload: { expired: true }});
          const message = json.message || 'Unknown server error';
          throw new Error(message);
        } else {
          setTaskId(json.task_id);
        }
      } catch (e) {
        setError(e);
      }
    };

    setLoading(true);
    requestRecs();
  }, [userState, location]);

  useEffect(() => {
    const getTaskRes = async () => {
      if (!taskId) return;
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
          const msg = json.status || 'Internal server error';
          throw new Error(msg);
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

  return (loading ? <Loading /> : error ? <Error msg={error.message} /> :
    <div style={{'display': 'flex', 'justifyContent': 'center'}}>
      <LazyLoadList
        loading={false}
        data={recs}
        onClick={onProductClick}
      />
    </div>
  );
};
