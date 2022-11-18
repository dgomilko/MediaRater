import React, { useContext } from 'react';
import InputField from './InputField';
import { UserContext } from '../../contexts/UserContext';
import { Navigate } from 'react-router-dom'
import useFormValidation from '../../hooks/useFormValidation';
import { signInVerifiers } from '../../verifiers/signInVerifiers';
import {
  title,
  loginBtn,
  areaWrapper
} from '../../styles/components/auth/Login.module.scss';

export default function Login() {
  const { userState, userDispatch } = useContext(UserContext);
  if (userState?.id) return <Navigate to={`/user/${userState?.id}`} />;
  const {
    handleChange,
    data,
    errors,
    setErrors
  } = useFormValidation(signInVerifiers);

  const handleSubmit = async e => {
    e.preventDefault();
    const userData = { ...data };
    const requestInfo = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    };
    const url = `${process.env.REACT_APP_SERVER}/login`
    try {
      const response = await fetch(url, requestInfo);
      const json = await response.json();
      if (response.status >= 400) {
        if (response.status === 403 && json.message) {
          setErrors({ password: json.message });
        } else if (response.status === 404 && json.message) {
          setErrors({ email: json.message });
        } else {
          const message = json.message || 'Unknown server error';
          throw new Error(message);
        }
      } else {
        const dataToStore = { name: json.name, id: json.id, token: json.token };
        localStorage.setItem(
          process.env.REACT_APP_STORAGE_KEY,
          JSON.stringify(dataToStore)
        );
        userDispatch({type: 'SET_INFO', payload: { ...json }});
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  const errorsFound = !!(Object.keys(errors).length);
  const emptyFields = Object.keys(data).length !==
    Object.keys(signInVerifiers.validations).length;
  const submitImpossible = errorsFound || emptyFields;
  return (
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
        <input className={loginBtn} type='submit' value="Login" disabled={submitImpossible} />
      </form>
    </div>
  );
};
