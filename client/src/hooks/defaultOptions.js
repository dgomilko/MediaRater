import { useState } from 'react';
import { throwResError } from '../utils/request';

export default function defaultOptions() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({});

  const options = {
    responseHandler: (response, json) =>
      response.status >= 400 ? throwResError(json) : setData(json),
    errHandler: (e) => setError(e),
    finallyHandler: () => setLoading(false)
  }

  return { options, data, setData, error, setError, loading, setLoading };
};
