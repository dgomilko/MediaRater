import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import useStorage from '../../hooks/useStorage';
import { post } from '../../utils/request';
import AccLogo from '../profile/AccLogo';
import ErrorWrapper from '../ErrorWrapper';
import {
  accInfoWrapper,
  accLogo,
  logoNameWrapper,
  headerText,
  logoutText,
} from '../../styles/components/header/AccInfo.module.scss';

export default function AccInfo() {
  const [error, setError] = useState();
  const { userState } = useContext(UserContext);
  const navigate = useNavigate();
  const { clearData } = useStorage();

  const handleLogout = async () => {
    if (!userState.token) return;
    const { token } = userState;
    const options = {
      responseHandler: (response, json) => {
        clearData();
        if (response.status >= 400) {
          const message = json.message || 'Unknown server error';
          if (message !== 'Signature expired')
            throw new Error(message);
        }
      },
      errHandler: (e) => setError(e)
    };

    await post('logout', {}, options, token);
  };

  const onLogoClick = () => navigate(`/user/${userState.id}`);

  return (
    <ErrorWrapper error={error}>
      <div className={accInfoWrapper}>
        <div className={logoNameWrapper} onClick={onLogoClick}>
          <AccLogo name={userState?.name} className={accLogo} />
          <span className={headerText}>{userState?.name}</span>
        </div>
        <p className={logoutText} onClick={handleLogout}>
          Logout
        </p>
      </div>
    </ErrorWrapper>
  );
};
