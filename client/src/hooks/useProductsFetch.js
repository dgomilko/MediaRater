import { useState, useEffect } from 'react';
import { post, throwResError } from '../utils/request';

export default function useProductsFetch(url, pageData, searchOptions = {}) {
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [outOfContent, setOutOfContent] = useState(false);

  useEffect(() => {
    if (outOfContent || !pageData.page) return;
    const { page } = pageData;
    const options = {
      responseHandler: (response, json) => {
        response.status >= 400 ?
          response.status === 404 && json.message ?
            setOutOfContent(true) : throwResError(json) :
          setItems(json.products);
      },
      errHandler: (e) => setError(e)
    };

    post(url, { page, ...searchOptions }, options);
  }, [pageData.page]);

  return { items, setItems, outOfContent, setOutOfContent, error, setError };
};
