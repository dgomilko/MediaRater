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
  const { options, error, loading } = useFetchStats(type);

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
