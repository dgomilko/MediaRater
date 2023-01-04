import { useState, useEffect } from 'react';
import { throwResError } from '../utils/request';
import { mainApi } from '../api/mainApi';
import { statuses } from '../utils/statuses';

export default function useProductsFetch(type, pageData, searchOptions = {}) {
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [outOfContent, setOutOfContent] = useState(false);

  useEffect(() => {
    if (outOfContent || !pageData.page) return;
    const { page } = pageData;
    const options = {
      responseHandler: (response, json) => {
        if (response.status >= statuses.BAD_REQUEST) {
          if (response.status === statuses.NOT_FOUND && json.message)
            setOutOfContent(true);
          throwResError(json);
        }
        else setItems(json.products);
      },
      errHandler: e => setError(e)
    };

    mainApi[type]({ page, ...searchOptions }, options);
  }, [pageData.page]);

  return { items, setItems, outOfContent, setOutOfContent, error, setError };
};
