import React, { createContext, useEffect, useReducer } from 'react';
import { throwResError } from '../utils/request';
import userReducer from '../reducers/userReducer';
import { authApi } from '../api/authApi';
import { statuses } from '../utils/statuses';

export const UserContext = createContext(undefined);

export function UserProvider(props) {
  const [userState, userDispatch] = useReducer(userReducer, {});
  
  useEffect(() => {
    const checkToken = async (localData) => {
      const options = {
        responseHandler: (response, json) => {
          (response.status >= statuses.BAD_REQUEST) ?
            throwResError(json) : userDispatch({
              type: 'SET_INFO',
              payload: { ...localData, expired: false }
            });
        },
        errHandler: (e) => {
          localStorage.clear();
          userDispatch(
            {type: 'SET_INFO', payload: { expired: true }}
          );
        }
      }
      if (!localData.token) return;
      await authApi.checkToken({}, options, localData.token);
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
