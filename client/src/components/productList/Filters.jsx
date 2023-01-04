import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useFetchGenres from '../../hooks/useFetchGenres';
import ExpandableOptions from '../filter/ExpandableOptions';
import FilterBtn from '../filter/FilterBtn';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import RatingSlider from '../filter/RatingSlider';
import Sort from '../filter/Sort';
import {
  filterAndLabel,
  mainWrapper,
  yearFilter,
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
        'Release year': 'date',
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

  return (
    <div className={mainWrapper}>
      <Sort sortOptions={sortOptions} onChange={onChange} options={options} />
      <ExpandableOptions title='Filter'>
        <RatingSlider setOptions={setOptions} options={options} />
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
      <FilterBtn
        onClick={onClick}
        options={options}
        prevOptions={prevOptions}
        setPrevOptions={setPrevOptions}
      />
    </div>
  );
};
