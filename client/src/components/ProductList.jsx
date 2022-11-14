import React, {
  useEffect,
  useReducer,
  useState,
  useRef,
  useCallback
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productsReducer from '../reducers/productsReduser';
import pageReducer from '../reducers/pageReducer';
import {
  mediaContainer,
  mediaProduct,
  mediaImg,
  mediaTitle,
  mediaRelease,
  ratingArea,
} from '../styles/components/ProductList.module.scss';

const calculateColor = rate => {
  if (rate < 0) return 'hsl(0, 0%, 55%)';
  const maxRate = 5;
  const percenage = rate / maxRate;
  const hue = (percenage * 120).toString(10);
  return `hsl(${hue}, 100%, 50%)`;
}

const useFetch = (url, pageData, dispatch, field) => {
  const [items, setItems] = useState([]);
  const [outOfContent, setOutOfContent] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (outOfContent) return;
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
          setItems(data[field]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchList(pageData.page);
  }, [dispatch, pageData.page]);

  useEffect(() => {
    setItems([]);
    setOutOfContent(false);
  }, [location]);

  useEffect(() => {
    if (outOfContent || !items.length) return;
    dispatch({ type: 'FETCHING', payload: true });
    dispatch({ type: 'LOAD', payload: items });
    dispatch({ type: 'FETCHING', payload: false });
  }, [items, outOfContent]);
}

export default function ProductList({ type }) {
  const [pageData, pageDispatch] = useReducer(pageReducer, { page: 1 })
  const [productsList, productsDispatch] = useReducer(
    productsReducer,
    { data: [], fetching: true }
  );
  let bottomRef = useRef(null);
  const imgRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    pageDispatch({ type: 'CLEAR' });
    productsDispatch({ type: 'CLEAR' });
  }, [location]);

  const bottomObserverClb = node => {
    new IntersectionObserver(elements => elements.forEach(e => {
      if (e.intersectionRatio > 0)
        pageDispatch({ type: 'ADVANCE' });
      })
    ).observe(node);
  };

  const bottomObserver = useCallback(
    bottomObserverClb,
    [pageDispatch]
  );

  const imgObserverClb = node => {
    const observer = new IntersectionObserver(elements => {
      elements.forEach(e => {
        if (e.intersectionRatio > 0) {
          const currentImg = e.target;
          const newImgSrc = currentImg.dataset.src;
          if (newImgSrc) currentImg.src = newImgSrc;
          observer.unobserve(node);
        }
      });
    })
    observer.observe(node);
  }

  const imgObserver = useCallback(imgObserverClb, []);

  const onProductClick = id =>
    navigate(`/${type.slice(0, type.length - 1)}/${id}`)

  useEffect(() => {
    imgRef.current = document.querySelectorAll('.' + mediaImg);
    if (imgRef.current)
      imgRef.current.forEach(img => imgObserver(img));
  }, [imgObserver, imgRef, productsList.data]);

  useEffect(() => {
    if (bottomRef.current) bottomObserver(bottomRef.current);
  }, [bottomObserver, bottomRef]);

  useFetch(
    `${process.env.REACT_APP_SERVER}/${type}`,
    pageData,
    productsDispatch,
    'products'
  );
  return (
    <div>
      <div className={mediaContainer}>
        {productsList.data.map((p, i) => {
          const { id, title, img_path, release, rating } = p;
          return (
            <div key={i} className={mediaProduct} onClick={() => onProductClick(id)}>
              <img className={mediaImg} data-src={img_path}/>
              <div class={ratingArea} style={{backgroundColor: calculateColor(rating)}} >
                <span>{rating >= 0 ? rating : 'TBD'}</span>
              </div>
              <p class={mediaTitle}>{title}</p>
              <p class={mediaRelease}>{release.slice(0, 4)}</p>
            </div>
          )
        })}
      </div>
      {productsList.fetching && (
        <div>
          <p>Loading...</p>
        </div>
      )}
      <div ref={bottomRef}></div>
    </div>
  )
}
