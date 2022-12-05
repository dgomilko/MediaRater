import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { throwResError } from '../utils/request';
import useStorage from './useStorage';
import { UserContext } from '../contexts/UserContext';
import { statuses, messages } from '../utils/statuses';
import { mainApi } from '../api/mainApi';

export default function useFetchRecs(type) {
  const { userState } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const { handleExpiration } = useStorage();
  const [taskId, setTaskId] = useState('');
  const [error, setError] = useState('');
  const [recs, setRecs] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (!userState.id) return;
    const options = {
      responseHandler: (response, json) => {
        response.status >= statuses.BAD_REQUEST ?
          handleExpiration(json) : setTaskId(json.task_id);
      },
      errHandler: (e) => {
        setError(e)
        setLoading(false)
      }
    };

    const body = { id: userState.id };
    setLoading(true);
    mainApi[`${type}Recs`](body, options, userState.token);
  }, [userState, location]);

  useEffect(() => {
    if (!taskId) return;

    const getTaskRes = async () => {
      const { token } = userState;
      const requestInfo = {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      };
      const url =
        `${process.env.REACT_APP_SERVER}/recommend/get-result/${taskId}`;
      try {
        const response = await fetch(url, requestInfo);
        const json = await response.json();
        if (response.status >= statuses.BAD_REQUEST)
          throwResError(json)
        else if (json.status === messages.PENDING)
          setTimeout(() => getTaskRes(taskId), 100); 
        else {
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

  return { error, loading, recs };
};
