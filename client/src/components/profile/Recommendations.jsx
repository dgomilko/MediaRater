import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LazyLoadList from '../LazyLoadList';
import { UserContext } from '../../contexts/UserContext';

export default function Recommendations({ type }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);
  const [taskId, setTaskId] = useState('');
  const { userState } = useContext(UserContext);

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
        console.log(response);
        const json = await response.json();
        if (response.status >= 400 || response.status === 204) {
          const message = json.message || 'Unknown server error';
          throw new Error(message);
        } else {
          setTaskId(json.task_id);
        }
      } catch (e) {
        console.error(e);
      }
    };

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
        console.log(json);
        if (response.status >= 400) {
          const msg = json.status || 'Internal server error';
          throw new Error(msg);
        } else if (json.status === 'PENDING') {
          setTimeout(() => getTaskRes(taskId), 100); 
        } else {
          setRecs(json.result);
          setLoading(false);
        }
      } catch {
        console.error(e);
      }
    };

    getTaskRes();
  }, [taskId]);

  const onProductClick = id => navigate(`/${type}/${id}`);

  return <LazyLoadList
    loading={loading}
    data={recs}
    onClick={onProductClick}
  />;
};
