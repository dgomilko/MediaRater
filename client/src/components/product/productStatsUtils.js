export const getAgeGaps = () => {
  let maxAge = 14;
  const res = [[0, maxAge]];
  while (maxAge + 5 <= 100) {
    const nextBoundary = maxAge + 5;
    res.push([maxAge + 1, nextBoundary]);
    maxAge = nextBoundary;
  }
  return res;
}

export const generateColor = () => `rgba(${[...Array(3)]
  .map(() => Math.floor(Math.random() * 255))}, 0.7)`

export const getTopCountries = (stats) => {
  const allCountries = new Set(stats.map(x => x.country));
  const count = [...allCountries].map(country => ({
    country,
    count: stats.filter(x => x.country === country)
    .length
  })).sort((a, b) => b.count - a.count);
  const top = count.slice(0, 20);
  const other = count.slice(20).reduce((a, b) => a.count + b.count, 0);
  return !other ? top : [
    ...top,
    { country: 'other', count: other }
  ];
};
