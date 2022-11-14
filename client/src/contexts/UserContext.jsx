import React, { createContext, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import userReducer from '../reducers/userReducer';

export const UserContext = createContext(undefined);

export function UserProvider(props) {
  const [userState, userDispatch] = useReducer(userReducer, {});

  useEffect(() => {
    const localData = localStorage.getItem(process.env.REACT_APP_STORAGE_KEY);
    console.log(localData);
    if (!localData) return;
    const data = JSON.parse(localData);
    userDispatch({type: 'SET_INFO', payload: { ...data }});
  }, []);

  return (
    <UserContext.Provider value={{userDispatch, userState}}>
      {props.children}
    </UserContext.Provider>
  );
};
