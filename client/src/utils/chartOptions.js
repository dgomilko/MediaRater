export default function chartOptions(stats, ageGaps, labels) {
  const {
    genderLabels,
    ratingLabels,
    countries
  } = labels;
  const ageLabels = ageGaps.map(gap => gap.join('-'));
  
  return {
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
};

const generateColor = () => `rgba(${[...Array(3)]
  .map(() => Math.floor(Math.random() * 255))}, 0.7)`;
