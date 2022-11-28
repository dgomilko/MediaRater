import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { throwResError } from '../utils/request';

export default function useStorage() {
  const { userDispatch } = useContext(UserContext);
  
  const storeData = (data) => {
    const dataToStore = {
      name: data.name,
      id: data.id,
      token: data.token
    };
    localStorage.setItem(
      process.env.REACT_APP_STORAGE_KEY,
      JSON.stringify(dataToStore)
    );
    userDispatch({type: 'SET_INFO', payload: { ...data, expired: false }});
  };

  const clearData = () => {
    localStorage.clear();
    userDispatch({type: 'CLEAR'});
  };

  const handleExpiration = (data) => {
    if (data.message === 'Signature expired')
      userDispatch({type: 'SET_INFO', payload: { expired: true }});
    throwResError(data);
  }

  return { storeData, clearData, handleExpiration };
};
