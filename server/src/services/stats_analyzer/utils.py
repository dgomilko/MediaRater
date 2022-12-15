from random import randrange

gen_color = lambda: f'rgba({", ".join([str(randrange(256)) for _ in range(3)])}, 0.7)'

def get_age_groups():
  max_age = 14
  res = list()
  res.append((0, max_age))
  while max_age + 5 <= 100:
    next = max_age + 5
    res.append((max_age + 1, next))
    max_age = next
  return res

def get_top_countries(stats):
  top_n = 20
  all_countries = list(set([s['country'] for s in stats]))
  count = [{
    'country': c,
    'count': len(list(filter(lambda s: ['country'] == s, stats)))
  } for c in all_countries]
  count.sort(reverse=True, key=lambda c: c['count'])
  top = count[:top_n]
  other = sum([c.count for c in count[top_n:]])
  return top if not other else \
    [*top, {'country': 'other', 'count': other}]
  