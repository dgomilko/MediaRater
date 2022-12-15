from services.stats_analyzer.utils import *


def process_stats(stats):
  gender_labels = ['female', 'male']
  rating_labels = list(range(6))
  countries = get_top_countries(stats)
  age_gaps = get_age_groups()
  print([gape for gape in age_gaps])
  age_labels = ['-'.join([str(y) for y in gap]) for gap in age_gaps]

  age_fn = lambda gap, x: x['age'] >= gap[0] and x['age'] <= gap[1]
  gen_fn = lambda gen, x: x['gender'] == gen[0]
  rate_fn = lambda r, x: x['rate'] == r
  filtered_len = lambda fn: len(list(filter(fn, stats)))

  fns = {
    'age': age_fn,
    'gender': gen_fn,
    'gen_rate': lambda r, g, x: gen_fn(g, x) and rate_fn(r, x),
    'age_rate': lambda r, age, x: age_fn(age, x) and rate_fn(r, x),
    'rate': rate_fn
  }

  return {
    'Viewers by age': {
      'chartData': {
        'labels': age_labels,
        'datasets': [{
          'label': 'Count of ages',
          'data': [filtered_len(lambda x: fns['age'](gap, x))
            for gap in age_gaps],
          'backgroundColor': [gen_color() for _ in age_labels]
        }]
      }
    },

    'Viewers by gender': {
      'chartData': {
        'labels': gender_labels,
        'datasets': [{
          'label': 'Count of genders',
          'data': [filtered_len(lambda x: fns['gender'](gen, x))
            for gen in gender_labels],
          'backgroundColor': [gen_color() for _ in gender_labels]
        }]
      }
    },

    'Viewers by country': {
      'chartData': {
        'labels': [c['country'] for c in countries],
        'datasets': [{
          'label': 'Count of viewers',
          'data': [c['count'] for c in countries],
          'backgroundColor': [gen_color() for _ in countries]
        }]
      }
    },

    'Rating by gender': {
      'chartData': {
        'labels': rating_labels,
        'datasets': [{
          'label': gen,
          'data': [filtered_len(lambda x: fns['gen_rate'](r, gen, x))
            for r in rating_labels],
          'backgroundColor': gen_color()
        } for gen in gender_labels]
      }
    },

    'Rating by age': {
      'chartData': {
        'labels': age_labels,
        'datasets': [{
          'label': r,
          'data': [filtered_len(lambda x: fns['age_rate'](r, age, x))
            for age in age_gaps],
          'backgroundColor': gen_color()
        } for r in rating_labels]
      }
    },

    'Rating distribution': {
      'chartData': {
        'labels': rating_labels,
        'datasets': [{
          'label': 'Count of ratings',
          'data': [filtered_len(lambda x: fns['rate'](r, x))
            for r in rating_labels],
          'backgroundColor': [gen_color() for _ in rating_labels]
        }]
      }
    },
  }
