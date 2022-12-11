import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useFetchGenres from '../../hooks/useFetchGenres';
import ExpandableOptions from './ExpandableOptions';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
  filterAndLabel,
  mainWrapper,
  searchBtn,
  yearFilter,
  range,
  genre
} from '../../styles/components/productsList/Filters.module.scss';

export default function Filters({ setOptions, options, onClick }) {
  const [minRate, maxRate] = [0, 5];
  const location = useLocation();
  const initialVals = {
    filter: 'popular',
    order: 'desc',
    min_rate: minRate,
    max_rate: maxRate,
    genres: [],
    min_year: '',
    max_year: '',
  };
  const [prevOptions, setPrevOptions] = useState(initialVals);
  const { error, loading, data } = useFetchGenres();

  useEffect(() => setPrevOptions(initialVals), [location]);

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

  const yearFilters = {
    from: 'min_year',
    to: 'max_year',
  };

  if (!Object.keys(options).length) {
    const initial = sortOptions.reduce((obj, x) => (
      { ...obj, [x.field]: x.options[Object.keys(x.options)[0]] }
    ), {});
    const { min_rate, max_rate, min_year, max_year, genres }
      = initialVals;
    setOptions({
      ...initial, min_rate, max_rate, genres, min_year, max_year
    });
  }

  const onChange = (e, op) => setOptions(
    { ...options, [op.field]: op.options[e.target.value]}
  );

  const onSearchClick = () => {
    setPrevOptions({ ...options });
    onClick();
  };

  const handleRangeChange = (e, newValue) => {
    const [min, max] = newValue;
    if (min === options.min_rate && max === options.max_rate)
      return;
    setOptions({ ...options, min_rate: min, max_rate: max });
  };

  return (
    <div className={mainWrapper}>
      <ExpandableOptions title='Sort'>
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
      </ExpandableOptions>
      <ExpandableOptions title='Filter'>
        <div className={filterAndLabel}>
          <span>Average rating</span>
          <Slider
            className={range}
            value={[options.min_rate, options.max_rate]}
            max={maxRate}
            step={1}
            marks={[...Array(6)].map(x => ({ value: x, label: x }))}
            onChange={handleRangeChange}
            valueLabelDisplay='auto'
          />
        </div>
        <div className={filterAndLabel}>
          <span>Release year</span>
            {Object.entries(yearFilters).map(([label, field]) => (
              <div className={yearFilter}>
                <span>{label}</span>
                <input
                  type='number'
                  value={options[field]}
                  onChange={(e) => setOptions(
                    { ...options, [field]: e.target.value })}
                />
            </div>
          ))}
        </div>
        {!(error || loading) &&
        <div className={filterAndLabel}>
          <span>Product genres</span>
          <Autocomplete
            className={genre}
            multiple
            value={options?.genres || []}
            options={data.genres}
            getOptionLabel={option => option}
            onChange={(e, val) => setOptions({ ...options, genres: val })}
            filterSelectedOptions
            renderInput={params =>
              <TextField {...params} placeholder='Genres'/>}
          />
        </div>}
      </ExpandableOptions>
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
