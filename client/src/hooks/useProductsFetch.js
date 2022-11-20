import { useState, useEffect } from 'react';

export default function useProductsFetch(url, pageData) {
  const [items, setItems] = useState([]);
  const [outOfContent, setOutOfContent] = useState(false);

  useEffect(() => {
    if (outOfContent || !pageData.page) return;
    const fetchList = async page => {
      const requestInfo = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page })
      };
      try {
        const response = await fetch(url, requestInfo);
        const data = await response.json();
        if (response.status >= 400) {
          if (response.status === 404 && data.message) {
            setOutOfContent(true);
          } else {
            const message = data.message || 'Unknown server error';
            throw new Error(message);
          }
        }
        else {
          setItems(data.products);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchList(pageData.page);
  }, [pageData.page]);

  return { items, setItems, outOfContent, setOutOfContent };
}
