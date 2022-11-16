import React, { createContext, useEffect, useReducer } from 'react';
import userReducer from '../reducers/userReducer';

export const UserContext = createContext(undefined);

export function UserProvider(props) {
  const [userState, userDispatch] = useReducer(userReducer, {});
  
  useEffect(() => {
    const localData = localStorage.getItem(process.env.REACT_APP_STORAGE_KEY);
    const data = localData ? JSON.parse(localData) : { id : null };
    userDispatch({type: 'SET_INFO', payload: { ...data }});
  }, []);

  return (
    <UserContext.Provider value={{userDispatch, userState}}>
      {props.children}
    </UserContext.Provider>
  );
};
