import React, { useRef, useState, useEffect } from 'react';
import {
  horizontalWrapper
} from '../../styles/components/home/Scrollable.module.scss';

export default function Scrollable({ data }) {
  const ref = useRef();
  const [scrollX, setScrollX] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(false);

  const scrollCheck = (val) => {
    setScrollX(val);
    const diff = Math.floor(ref.current.scrollWidth - ref.current.scrollLeft);
    const reachedLimit = diff <= ref.current.offsetWidth;
    if (scrollEnd !== reachedLimit) setScrollEnd(reachedLimit);
  };

  const scroll = delta => {
    ref.current.scrollLeft += delta;
    scrollCheck(scrollX + delta)
  };

  useEffect(() => {
    if (!ref.current) return;
    const scrollEnded = ref?.current?.scrollWidth === ref?.current?.offsetWidth
    if (scrollEnded !== scrollEnd) setScrollEnd(scrollEnded);
  }, [ref?.current?.scrollWidth, ref?.current?.offsetWidth]);

  return (
    <div>
      {scrollX && (<button onClick={() => scroll(-50)} className='left'>
        left
      </button>)}
      <div ref={ref} onScroll={() => scrollCheck(ref.current.scrollLeft)} className={horizontalWrapper}>
        {data.map(p => (
          <div>{p.title}</div>
        ))}
      </div>
      {!scrollEnd && (<button onClick={() => scroll(50)} className='right'>
        right
      </button>)}
    </div>
  );
};
