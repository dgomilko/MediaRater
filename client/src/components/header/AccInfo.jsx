import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import {
  accInfoWrapper,
  accLogo,
  logoNameWrapper,
  headerText,
  logoutText,
} from '../../styles/components/header/AccInfo.module.scss';

export default function AccInfo() {
  const { userState, userDispatch } = useContext(UserContext);

  const handleLogout = async () => {
    if (!userState.token) return;
    const { token } = userState;
    const requestInfo = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    try {
      const url = `${process.env.REACT_APP_SERVER}/logout`
      const response = await fetch(url, requestInfo);
      const json = await response.json();
      if (response.status >= 400) {
        const message = json.message || 'Unknown server error';
        if (message === 'Signature expired') {
          localStorage.clear();
          userDispatch({type: 'CLEAR'});
        } else {
          throw new Error(message);
        }
      }
      localStorage.clear();
      userDispatch({type: 'CLEAR'});
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={accInfoWrapper}>
      <div className={logoNameWrapper}>
        <div className={accLogo}>
          <span>{userState?.name.slice(0, 1)}</span>
        </div>
        <span className={headerText}>{userState?.name}</span>
      </div>
      <p className={logoutText} onClick={handleLogout}>
        Logout
      </p>
    </div>
  );
};
