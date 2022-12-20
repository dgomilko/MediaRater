from services.stats_analyzer.utils import *
from itertools import groupby

def process_stats(stats):
  gender_labels = ['female', 'male']
  rating_labels = list(range(6))
  countries = get_top_countries(stats)
  age_gaps = get_age_groups()
  age_labels = ['-'.join([str(y) for y in gap]) for gap in age_gaps]

  date_grouped = [({
      'x': key,
      'y': list(group),
    }) for key, group in groupby(stats, key=lambda x: x['created'])]

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

    'Average rating over time': {
      'chartData': {
        'labels': [],
        'datasets': [{
          'label': 'Average rating',
          'data': [{
            **g,
            'y': round(sum([x['rate'] for x in g['y']]) / len(g['y']), 2)
          } for g in date_grouped],
          'borderColor': gen_color()
        }]
      }
    },

    'Ratings over time': {
      'chartData': {
        'labels': [],
        'datasets': [{
          'label': rate,
          'data': [{**g, 'y': len([x for x in g['y'] if rate_fn(rate, x)])} for g in date_grouped],
          'borderColor': gen_color()
        } for rate in rating_labels]
      }
    },

    'Popularity over time': {
      'chartData': {
        'labels': [],
        'datasets': [{
          'label': 'Reviews count',
          'data': [{**g, 'y': len(g['y'])} for g in date_grouped],
          'borderColor': gen_color()
        }]
      }
    },
  }
