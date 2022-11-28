import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom'
import InputField from './InputField';
import { post, throwResError } from '../../utils/request';
import useStorage from '../../hooks/useStorage';
import ErrorWrapper from '../ErrorWrapper';
import { UserContext } from '../../contexts/UserContext';
import useFormValidation from '../../hooks/useFormValidation';
import { signInVerifiers } from '../../verifiers/signInVerifiers';
import {
  title,
  loginBtn,
  areaWrapper
} from '../../styles/components/auth/Login.module.scss';

export default function Login() {
  const { userState } = useContext(UserContext);
  if (userState?.id) return <Navigate to={`/user/${userState?.id}`} />;
  const {
    handleChange,
    data,
    errors,
    setErrors
  } = useFormValidation(signInVerifiers);
  const [error, setError] = useState('');
  const { storeData } = useStorage();

  const handleSubmit = async e => {
    e.preventDefault();
    const userData = { ...data };

    const options = {
      responseHandler: (response, json) => {
        if (response.status >= 400)
          if (response.status === 403)
            setErrors({ password: json.message });
          else if (response.status === 404)
            setErrors({ email: json.message });
          else throwResError(json);
        else storeData(json);
      },
      errHandler: (e) => setError(e)
    }
    await post('login', userData, options);
  };
  
  const errorsFound = !!(Object.keys(errors).length);
  const emptyFields = Object.keys(data).length !==
    Object.keys(signInVerifiers.validations).length;
  const submitImpossible = errorsFound || emptyFields;
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
          <input
            className={loginBtn}
            type='submit'
            value='Login'
            disabled={submitImpossible}
          />
        </form>
      </div>
    </ErrorWrapper>
  );
};
