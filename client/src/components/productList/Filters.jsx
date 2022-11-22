import React, { useState } from 'react';
import {
  filterWrapper,
  header,
  filterAndLabel,
  filters,
  mainWrapper,
  searchBtn,
} from '../../styles/components/productsList/Filters.module.scss';

export default function Filters({ setOptions, options, onClick }) {
  const [expanded, setExpanded] = useState({ sort: false });
  const [prevOptions, setPrevOptions] = useState(
    { 'filter': 'popular', 'order': 'desc' }
  );

  const sortOptions = [
    {
      label: 'Sort products by',
      options: {
        'Popularity': 'popular',
        'Product title': 'title',
        'Rating': 'rating',
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
    setOptions(initial);
  }

  const onChange = (e, op) => setOptions(
    { ...options, [op.field]: op.options[e.target.value]}
  );

  const onSearchClick = () => {
    setPrevOptions({ ...options });
    onClick();
    console.log({options, prevOptions});
  }

  return (
    <div className={mainWrapper}>
      <div className={filterWrapper}>
        <div className={header}>
          <p>Sort</p>
          <span onClick={() => setExpanded(!expanded)}>
            {expanded ? '︽' : '︾'}
          </span>
        </div>
        <div className={filters} style={{'display': expanded ? 'block' : 'none'}}>
          {sortOptions.map(op => (
            <div className={filterAndLabel}>
              <span>{op.label}</span>
              <select
                value={Object.keys(op.options)
                  .find(k => op.options[k] === options[op.field])}
                onChange={e => onChange(e, op)}
              >
                {Object.keys(op.options).map(val => (
                  <option value={val}>{val}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      <button
        className={searchBtn}
        disabled={!Object.keys(options).length ||
          JSON.stringify(options) === JSON.stringify(prevOptions)}
        onClick={onSearchClick}
      >
        Search
      </button>
    </div>
  );
};
