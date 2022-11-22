import React, { useEffect, useRef, useCallback } from 'react';
import Rating from './product/Rating';
import {
  mainWrapper,
  mediaContainer,
  mediaProduct,
  mediaImg,
  mediaTitle,
  mediaRelease,
  ratingArea,
} from '../styles/components/LazyLoadList.module.scss';

export default function LazyLoadList({ loading, data, onClick }) {
  const imgRef = useRef(null);

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

  useEffect(() => {
    imgRef.current = document.querySelectorAll('.' + mediaImg);
    if (imgRef.current)
      imgRef.current.forEach(img => imgObserver(img));
  }, [imgObserver, imgRef, data]);

  return (
    <div className={mainWrapper}>
      <div className={mediaContainer}>
        {data.map(p => {
          const { id, title, img_path, release, rating } = p;
          return (
            <div className={mediaProduct} onClick={() => onClick(id)}>
              <img className={mediaImg} data-src={img_path}/>
              <Rating className={ratingArea} rating={rating} />
              <p class={mediaTitle}>{title}</p>
              <p class={mediaRelease}>{release.slice(0, 4)}</p>
            </div>
          )
        })}
      </div>
      {loading && (
        <div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};
