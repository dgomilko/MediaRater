import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../Loading';
import ErrorWrapper from '../ErrorWrapper';
import defaultOptions from '../../hooks/defaultOptions';
import { post } from '../../utils/request';
import { getAgeGaps, generateColor, getTopCountries } from './productStatsUtils';
import Chart from './Chart';
import {
  statsWrapper,
  optionsSelect
} from '../../styles/components/product/ProductStats.module.scss'

export default function ProductStats({ type }) {
  const params = useParams();
  const [options, setOptions] = useState({});
  const { options: handleOptions, error, loading, data: stats  } =
    defaultOptions();
  const [chartOption, setChartOption] = useState('Viewers by age');
  const { id } = params;

  useEffect(() => {
    if (!id) return;
    post(`${type}-stats`, { id }, handleOptions);
  }, [id]);
  
  useEffect(() => {
    if (!stats?.length) return;
    const ageGaps = getAgeGaps();
    const ageLabels = ageGaps.map(gap => gap.join('-'));
    const genderLabels = ['female', 'male'];
    const ratingLabels = [...Array(6)].map((_, i) => i);
    const countries = getTopCountries(stats);

    const optionsDict = {
      'Viewers by age': {
        chartData: {
          labels: ageLabels,
          datasets: [{
            label: 'Count of ages',
            data: ageGaps.map(gap => stats
              ?.filter(x => x.age >= gap[0] && x.age <= gap[1])
              .length),
            backgroundColor: ageGaps.map(generateColor),
          }],
        },
        chartTypes: ['Bar', 'Pie', 'Doughnut', 'Polar', 'Radar'],
      },
      'Viewers by gender': {
        chartData: {
          labels: genderLabels,
          datasets: [{
            label: 'Count of genders',
            data: genderLabels.map(g => stats
              ?.filter(x => x.gender === g.charAt(0))
              .length),
            backgroundColor: genderLabels.map(generateColor),
            }],
          },
        chartTypes: ['Bar', 'Pie', 'Doughnut', 'Polar'],
      },
      'Viewers by country': {
        chartData: {
          labels: countries.map(x => x.country),
          datasets: [{
            label: 'Count of viewers',
            data: countries.map(x => x.count),
            backgroundColor: countries.map(generateColor),
            }],
          },
        chartTypes: ['Bar', 'Pie', 'Doughnut', 'Polar', 'Radar'],
      },
      'Rating by gender': {
        chartData: {
          labels: ratingLabels,
          datasets: genderLabels.map(g => ({
            label: g,
            data: ratingLabels.map(i => stats
              .filter(x => x.gender === g.charAt(0) && x.rate == i).length),
            backgroundColor: generateColor(),
          })),
        },
        chartTypes: ['Grouped bar', 'Stacked bar', 'Radar'],
      },
      'Rating by age': {
        chartData: {
          labels: ageLabels,
          datasets: ratingLabels.map(i => ({
            label: i,
            data: ageGaps.map(age => stats
              .filter(x => x.age >= age[0] && x.age <= age[1] && x.rate == i)
              .length),
            backgroundColor: generateColor(),
          })),
        },
        chartTypes: ['Stacked bar', 'Grouped bar'],
      },
      'Rating distribution': {
        chartData: {
          labels: ratingLabels,
          datasets: [{
            label: 'Count of ratings',
            data: ratingLabels.map(i => stats
              ?.filter(x => x.rate === i)
              .length),
            backgroundColor: ratingLabels.map(generateColor),
            }],
          },
        chartTypes: ['Bar', 'Pie', 'Doughnut', 'Polar', 'Radar'],
      },
    };

    setOptions(optionsDict);
  }, [stats]);
  
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
