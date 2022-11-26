import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import AccLogo from '../profile/AccLogo';
import Error from '../Error';
import {
  accInfoWrapper,
  accLogo,
  logoNameWrapper,
  headerText,
  logoutText,
} from '../../styles/components/header/AccInfo.module.scss';

export default function AccInfo() {
  const [error, setError] = useState();
  const { userState, userDispatch } = useContext(UserContext);
  const navigate = useNavigate();

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
    const url = `${process.env.REACT_APP_SERVER}/logout`;
    try {
      const response = await fetch(url, requestInfo);
      const json = await response.json();
      localStorage.clear();
      userDispatch({type: 'CLEAR'});
      if (response.status >= 400) {
        const message = json.message || 'Unknown server error';
        if (message !== 'Signature expired') throw new Error(message);
      }
    } catch (e) {
      setError(e);
    }
  };

  const onLogoClick = () => navigate(`/user/${userState.id}`);

  return (error ? <Error msg={error.message} /> :
    <div className={accInfoWrapper}>
      <div className={logoNameWrapper} onClick={onLogoClick}>
        <AccLogo name={userState?.name} className={accLogo} />
        <span className={headerText}>{userState?.name}</span>
      </div>
      <p className={logoutText} onClick={handleLogout}>
        Logout
      </p>
    </div>
  );
};
