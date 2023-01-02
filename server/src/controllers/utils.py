def get_kwargs(data):
  options = {
    'order': ['asc', 'desc'],
    'filter': ['date', 'rating'],
    'min_rate': list(range(0, 6)),
    'max_rate': list(range(0, 6)),
  }
  return {
    k: data[k] for k, v in options.items()
      if k in data.keys() and data[k] in v
  }
