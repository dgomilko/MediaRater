import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom'
import ErrorWrapper from '../ErrorWrapper';
import InputField from './InputField';
import { UserContext } from '../../contexts/UserContext';
import useFormValidation from '../../hooks/useFormValidation';
import { signUpVerifiers } from '../../verifiers/signUpVerifiers';
import CountrySelector from './countrySelector/CountrySelector';
import { post, throwResError } from '../../utils/request';
import useStorage from '../../hooks/useStorage';
import {
  areaWrapper,
  title,
  radioWrapper,
  submitBtn,
} from '../../styles/components/auth/Register.module.scss';
import { warningWrapper } from '../../styles/components/auth/InputField.module.scss';

export default function Register() {
  const { userState } = useContext(UserContext);
  if (userState?.id) return <Navigate to={`/user/${userState?.id}`} />;
  const {
    handleChange,
    data,
    errors,
    setErrors
  } = useFormValidation(signUpVerifiers);
  const [error, setError] = useState('');
  const { storeData } = useStorage();

  const handleSubmit = async e => {
    e.preventDefault();
    const userData = {
      ...data,
      birthday: data.birthday.split('.').reverse().join('.') 
    };
    delete userData.passwordConf;

    const options = {
      responseHandler: (response, json) => {
        (response.status >= 400) ?
          (response.status === 403 && json.message) ?
            setErrors({ email: json.message }) :
            throwResError(json) :
          storeData(json);
      },
      errHandler: (e) => setError(e)
    }
    await post('register', userData, options);
  };
  
  const errorsFound = !!(Object.keys(errors).length);
  const emptyFields = Object.keys(data).length !==
    Object.keys(signUpVerifiers.validations).length;
  const submitImpossible = errorsFound || emptyFields;
  return (
    <ErrorWrapper error={error}>
      <div className={areaWrapper}>
        <p className={title}>Sign up for an account</p>
        <form onSubmit={handleSubmit} >
          <InputField
            type='text'
            label='Username'
            onChange={handleChange('name')}
            warning={errors['name']}
          />
          <InputField
            type='email'
            label='Email'
            onChange={handleChange('email')}
            warning={errors['email']}
          />
          <div>
            <p>Gender:</p>
            <div className={radioWrapper}>
            {['Female', 'Male'].map(val => {
              const gen = val.charAt(0).toLowerCase()
              return (
                <div>
                  <input
                    type='radio'
                    value={gen}
                    checked={data.gender === gen}
                    onChange={handleChange('gender')}
                  />
                {val}
                </div>
                )
              })
            }
          </div>
          <div className={warningWrapper}>
            <span>{errors['gender']}</span>
          </div>
          </div>
          <InputField
            type='text'
            label='Birthday (DD.MM.YYYY)'
            onChange={handleChange('birthday')}
            warning={errors['birthday']}
          />
          <CountrySelector
            value={data.country}
            label='Country'
            onChange={handleChange('country')}
            warning={errors['country']}
          />
          <InputField
            type='password'
            label='Password'
            onChange={handleChange('password') }
            warning={errors['password']}
          />
          <InputField
            type='password'
            label='Password (confirm)'
            onChange={handleChange('passwordConf')}
            warning={errors['passwordConf']}
          />
          <input className={submitBtn} type='submit' value="Register" disabled={submitImpossible} />
        </form>
      </div>
    </ErrorWrapper>
  );
};
