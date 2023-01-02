import React from 'react';
import Slider from '@mui/material/Slider';
import {
  range,
  filterAndLabel
} from '../../styles/components/productsList/Filters.module.scss';

export default function RatingSlider({ setOptions, options }) {
  const handleRangeChange = (e, newValue) => {
    const [min, max] = newValue;
    if (min === options.min_rate && max === options.max_rate)
      return;
    setOptions({ ...options, min_rate: min, max_rate: max });
  };

 return (
   <div className={filterAndLabel}>
      <span>Rating</span>
      <Slider
        className={range}
        value={[options.min_rate, options.max_rate]}
        max={5}
        step={1}
        marks={[...Array(6)].map(x => ({ value: x, label: x }))}
        onChange={handleRangeChange}
        valueLabelDisplay='auto'
      />
   </div>
 );
};
