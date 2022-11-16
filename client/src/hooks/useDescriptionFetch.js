import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function useDescriptionFetch(userParam, route) {
  const { userState } = useContext(UserContext);
  const [error, setError] = useState('');
  const [data, setData] = useState({});
  const { id } = useParams();
  const { id: user_id } = userState;

  useEffect(() => {
    const fetchData = async () => {
      if (!id || user_id === undefined) return;
      const requestInfo = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [userParam]: user_id, id }),
      };
      try {
        const url = `${process.env.REACT_APP_SERVER}/${route}`;
        const response = await fetch(url, requestInfo);
        const json = await response.json();
        if (response.status >= 400) {
          const message = json.message || 'Unknown server error';
          throw new Error(message); 
        } else {
          setData(json);
        }
      } catch (e) {
        setError(e.message);
      };
    };
  
    fetchData();
  }, [userState]);

  return { data, error };
};
