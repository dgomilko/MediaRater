import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import AuthOptions from './AuthOptions';
import AccInfo from './AccInfo';

export default function AccountOptions() {
  const { userState } = useContext(UserContext);
  return (userState.id) ?
    <AccInfo /> :
    <AuthOptions />;
};
