import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sort from '../filter/Sort';
import FilterBtn from '../filter/FilterBtn';
import RatingSlider from '../filter/RatingSlider';
import ExpandableOptions from '../filter/ExpandableOptions';
import {
  wrapper
} from '../../styles/components/reviews/Filter.module.scss';

export default function Filter({ options, setOptions, onClick }) {
  const [minRate, maxRate] = [0, 5];
  const location = useLocation();
  const initialVals = {
    filter: 'date',
    order: 'desc',
    min_rate: minRate,
    max_rate: maxRate,
  };
  const [prevOptions, setPrevOptions] = useState(initialVals);

  useEffect(() => setPrevOptions(initialVals), [location]);

  const onChange = (e, op) => setOptions(
    { ...options, [op.field]: op.options[e.target.value]}
  );

  const sortOptions = [
    {
      label: 'Sort reviews by',
      options: {
        'Creation date': 'date',
        'Rating value': 'rating',
      },
      field: 'filter'
    },
    {
      label: 'Order results',
      options: {
        'Descending': 'desc',
        'Ascending': 'asc',
      },
      field: 'order'
    }
  ];

  if (!Object.keys(options).length) {
    const initial = sortOptions.reduce((obj, x) => (
      { ...obj, [x.field]: x.options[Object.keys(x.options)[0]] }
    ), {});
    const { min_rate, max_rate } = initialVals;
    setOptions({ ...initial, min_rate, max_rate });
  }

  return (
    <div className={wrapper}>
      <Sort sortOptions={sortOptions} options={options} onChange={onChange} />
      <ExpandableOptions title='Filter'>
          <RatingSlider options={options} setOptions={setOptions} />
      </ExpandableOptions>
      <FilterBtn
        onClick={onClick}
        options={options}
        prevOptions={prevOptions}
        setPrevOptions={setPrevOptions}
      />
    </div>
  );
};
