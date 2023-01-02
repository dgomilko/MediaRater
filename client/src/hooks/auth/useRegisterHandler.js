import { useState } from 'react';
import useStorage from '../useStorage';
import useFormValidation from './useFormValidation';
import { throwResError } from '../../utils/request';
import { authApi } from '../../api/authApi';
import { statuses } from '../../utils/statuses';

export default function useRegisterHandler(verifiers) {
  const [error, setError] = useState('');
  const { storeData } = useStorage();
  const {
    handleChange,
    data,
    errors,
    setErrors
  } = useFormValidation(verifiers);

  const handleSubmit = async e => {
    e.preventDefault();
    const userData = {
      ...data,
      birthday: data.birthday.split('.').reverse().join('.') 
    };
    delete userData.passwordConf;

    const options = {
      responseHandler: (response, json) => {
        (response.status >= statuses.BAD_REQUEST) ?
          (response.status === statuses.FORBIDDEN && json.message) ?
            setErrors({ email: json.message }) :
            throwResError(json) :
          storeData(json);
      },
      errHandler: (e) => setError(e)
    }

    await authApi.register(userData, options);
  };

  return { handleChange, handleSubmit, data, errors, error };
};
