from random import randrange

gen_color = lambda: f'rgba({", ".join([str(randrange(256)) for _ in range(3)])}, 0.7)'

def get_age_groups():
  min_age = 14
  max_age = 100
  age_step = 5
  res = list()
  res.append((0, min_age))
  while min_age + age_step <= max_age:
    next = min_age + 5
    res.append((min_age + 1, next))
    min_age = next
  return res

def get_top_countries(stats):
  top_n = 20
  all_countries = list(set([s['country'] for s in stats]))
  count = [{
    'country': c,
    'count': len(list(filter(lambda s: s['country'] == c, stats)))
  } for c in all_countries]
  count.sort(reverse=True, key=lambda c: c['count'])
  top = count[:top_n]
  other = sum([c.count for c in count[top_n:]])
  return top if not other else \
    [*top, {'country': 'other', 'count': other}]
  