import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import Modal from './Modal';
import {
  modal,
  submitBtn,
  content
} from '../styles/components/ExpirationWrapper.module.scss';

export default function ExpirationWrapper({ children }) {
  const { userState, userDispatch } = useContext(UserContext);
  const clearUserData = () => userDispatch({type: 'CLEAR'});
  
  return (
    userState.expired ?
      <Modal className={modal} display={true} closeFn={clearUserData}>
        <div className={content}>
          <div>
            Session time has expired. If you wish to continue, please, relogin.
          </div>
          <input
            type='button'
            className={submitBtn}
            onClick={clearUserData}
            value='Close'
          />
        </div>
      </Modal> :
      children
  );
};
