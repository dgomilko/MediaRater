import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import defaultOptions from './defaultOptions';
import chartOptions from '../utils/chartOptions';
import { mainApi } from '../api/mainApi';
import { getAgeGaps, getTopCountries } from '../utils/productStatsUtils';

export default function useFetchStats(type) {
  const { id } = useParams();
  const [options, setOptions] = useState({});
  const { options: handleOptions, error, loading, data } =
    defaultOptions();

  useEffect(() => {
    if (!id) return;
    mainApi[`${type}Stats`]({ id }, handleOptions);
  }, [id]);
  
  useEffect(() => {
    if (!data?.stats?.length) return;
    const ageGaps = getAgeGaps();
    const genderLabels = ['female', 'male'];
    const ratingLabels = [...Array(6)].map((_, i) => i);
    const countries = getTopCountries(data.stats);

    const optionsDict = chartOptions(
      data?.stats,
      ageGaps,
      { genderLabels, ratingLabels, countries }
    );
    setOptions(optionsDict);
  }, [data?.stats]);

  return { options, error, loading };
};
