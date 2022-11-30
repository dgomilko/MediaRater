import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom'
import Submitter from './Submitter';
import InputField from './InputField';
import ErrorWrapper from '../ErrorWrapper';
import useLoginHandler from '../../hooks/auth/useLoginHandler';
import { UserContext } from '../../contexts/UserContext';
import { signInVerifiers } from '../../verifiers/signInVerifiers';
import {
  title,
  loginBtn,
  areaWrapper
} from '../../styles/components/auth/Login.module.scss';

export default function Login() {
  const { userState } = useContext(UserContext);
  if (userState?.id) return <Navigate to={`/user/${userState?.id}`} />;
  const { data, handleChange, handleSubmit, errors, error } =
    useLoginHandler(signInVerifiers);
  
  return (
    <ErrorWrapper error={error}>
      <div className={areaWrapper}>
        <p className={title}>Sign in to your account</p>
        <form onSubmit={handleSubmit} >
          <InputField
            type='email'
            label='Email'
            onChange={handleChange('email')}
            warning={errors['email']}
          />
          <InputField
            type='password'
            label='Password'
            onChange={handleChange('password') }
            warning={errors['password']}
          />
          <Submitter
            className={loginBtn}
            val='Login'
            ctx={{ errors, data, verifiers: signInVerifiers }}
          />
        </form>
      </div>
    </ErrorWrapper>
  );
};
