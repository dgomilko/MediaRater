import React, { createContext, useEffect, useReducer } from 'react';
import userReducer from '../reducers/userReducer';

export const UserContext = createContext(undefined);

export function UserProvider(props) {
  const [userState, userDispatch] = useReducer(userReducer, {});
  
  useEffect(() => {
    const checkToken = async (localData) => {
      const { token } = localData;
      if (!token) return;
      const requestInfo = {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      };
      const url = `${process.env.REACT_APP_SERVER}/check-token`;
      try {
        const response = await fetch(url, requestInfo);
        const json = await response.json();
        if (response.status >= 400) {
          const msg = json.status || 'Internal server error';
          throw new Error(msg);
        } else {
          userDispatch(
            {type: 'SET_INFO', payload: { ...localData, expired: false }}
          );
        }
      } catch (e) {
        localStorage.clear();
        userDispatch(
          {type: 'SET_INFO', payload: { expired: true }}
        );
      }
    };

    const localData = localStorage.getItem(process.env.REACT_APP_STORAGE_KEY);
    if (!localData) userDispatch({type: 'CLEAR'});
    else {
      const parsed = JSON.parse(localData);
      if (!parsed?.token) userDispatch({type: 'CLEAR'});
      else checkToken(parsed);
    }
  }, []);

  return (
    <UserContext.Provider value={{userDispatch, userState}}>
      {props.children}
    </UserContext.Provider>
  );
};
