import { useState } from 'react';
import useStorage from '../useStorage';
import { authApi } from '../../api/authApi';
import { statuses } from '../../utils/statuses';
import { throwResError } from '../../utils/request';
import useFormValidation from './useFormValidation';

export default function useLoginHandler(verifiers) {
  const {
    handleChange,
    data,
    errors,
    setErrors
  } = useFormValidation(verifiers);
  const { storeData } = useStorage();
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const userData = { ...data };

    const options = {
      responseHandler: (response, json) => {
        if (response.status >= statuses.BAD_REQUEST)
          if (response.status === statuses.FORBIDDEN)
            setErrors({ password: json.message });
          else if (response.status === statuses.NOT_FOUND)
            setErrors({ email: json.message });
          else throwResError(json);
        else storeData(json);
      },
      errHandler: (e) => setError(e)
    }
    await authApi.login(userData, options);
  };

  return { data, handleChange, handleSubmit, errors, error };
};
