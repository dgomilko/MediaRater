import React, { useState } from 'react';
import Loading from '../Loading';
import ErrorWrapper from '../ErrorWrapper';
import useFetchStats from '../../hooks/useFetchStats';
import Chart from './Chart';
import {
  statsWrapper,
  optionsSelect
} from '../../styles/components/product/ProductStats.module.scss';

export default function ProductStats({ type }) {
  const [chartOption, setChartOption] = useState('Viewers by age');
  const { data, error, loading } = useFetchStats(type);

  const charts = {
    'Viewers by age': ['Bar', 'Pie', 'Doughnut', 'Polar', 'Radar'],
    'Viewers by gender': ['Bar', 'Pie', 'Doughnut', 'Polar'],
    'Viewers by country': ['Bar', 'Pie', 'Doughnut', 'Polar', 'Radar'],
    'Rating by gender': ['Grouped bar', 'Stacked bar', 'Radar'],
    'Rating by age': ['Stacked bar', 'Grouped bar'],
    'Rating distribution': ['Bar', 'Pie', 'Doughnut', 'Polar', 'Radar'],
  };
  console.log(data)
  const options = data.stats ? Object.entries(data.stats)
    .reduce((obj, [type, desc]) => ({
      ...obj,
      [type]: { ...desc, chartTypes: charts[type] }
    }), {}) : [];

  return (loading ? <div style={{'height': '150px'}}><Loading /></div> :
    <ErrorWrapper error={error}>
      <div className={statsWrapper}>
        <select
          className={optionsSelect}
          value={chartOption}
          onChange={e => setChartOption(e.target.value)}
        >
          {Object.keys(options).map(val => (
            <option value={val}>{val}</option>
          ))}
        </select>
        <Chart
          data={options[chartOption]?.chartData}
          chartOptions={options[chartOption]?.chartTypes}
        />
      </div>
    </ErrorWrapper>
  );
};
