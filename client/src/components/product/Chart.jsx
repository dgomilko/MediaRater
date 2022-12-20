import React, { useEffect, useState } from 'react';
import 'chartjs-adapter-moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Bar,
  Pie,
  Doughnut,
  PolarArea,
  Radar,
  Line
} from 'react-chartjs-2';
import {
  chartWrapper,
  optionsWrapper,
  optionsSelect
} from '../../styles/components/product/Chart.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function ChartComponent({ data, chartOptions }) {
  const [chartType, setChartType] = useState('Bar');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!chartOptions) return;
    if (!chartOptions.includes(chartType))
      setChartType(chartOptions[0]);
  }, [chartOptions]);

  const chartTypes = {
    'Bar': { Chart: Bar },
    'Pie': { Chart: Pie },
    'Doughnut': { Chart: Doughnut },
    'Polar': { Chart: PolarArea },
    'Radar': { Chart: Radar },
    'Grouped bar': { Chart: Bar },
    'Stacked bar': {
      Chart: Bar,
      options: {
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        }
      }
    },
    'Time': {
      Chart: Line,
      options: {
        scales: {
          x: {
            type: 'time',
            time: { parser: 'DD.MM.YYYY', unit: 'day' }
          },
        }
      }
    }
  };

  const defaultOptions = {
    plugins: {
      legend: { display: chartType !== 'Bar' },
      tooltip: {
        callbacks: {
          label: context => {
            const { label, formattedValue: value} = context;
            const dataArr = context.chart.data.datasets[0].data;
            const sum = dataArr.reduce((a, b) => a + b, 0);
            const val = (value * 100 / sum).toFixed(2);
            return isNaN(val) || val == Infinity ?
              label : `${label}: ${val}%`;
          }
        }
      }
    }
  };

  const { Chart, options } = chartTypes[chartType];
  return (chartOptions && (
    <div className={chartWrapper}>
      <div className={optionsWrapper}>
        <select
          className={optionsSelect}
          value={chartType}
          onChange={e => setChartType(e.target.value)}
        >
          {chartOptions.map(val => <option value={val}>{val}</option>)}
        </select>
        <input
          type='button'
          value={expanded ? 'collapse' : 'expand'}
          onClick={() => setExpanded(!expanded)}
        />
      </div>
      <div style={{width: expanded ? '100%' : '600px'}}>
        <Chart
          options={Object.assign(defaultOptions, options || {})}
          data={data}
        />
      </div>
    </div>
  ));
};
