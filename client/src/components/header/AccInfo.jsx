import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogoutHandler from '../../hooks/auth/useLogoutHandler';
import { UserContext } from '../../contexts/UserContext';
import ErrorWrapper from '../ErrorWrapper';
import AccLogo from '../profile/AccLogo';
import {
  accInfoWrapper,
  accLogo,
  logoNameWrapper,
  headerText,
  logoutText,
} from '../../styles/components/header/AccInfo.module.scss';

export default function AccInfo() {
  const { userState } = useContext(UserContext);
  const navigate = useNavigate();
  const { error, handleLogout } = useLogoutHandler();
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
