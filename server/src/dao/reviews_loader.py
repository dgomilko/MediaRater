import functools
from sqlalchemy import and_, desc, asc
from db.models import Review
from dao.model_mappers import review_mapper

def limit_per_page(res_per_page: int) -> callable:
  def actual_decorator(func: callable):
    @functools.wraps(func)
    def wrapped(*args, **kwargs):
      page = args[1]
      offset = res_per_page * (page - 1)
      limit = res_per_page * page
      result = func(*args, **kwargs)
      if not result: return None
      limited = result.slice(offset, limit).all()
      if not limited: return None
      next_available = bool(result
        .slice(limit, limit + res_per_page).all())
      mapped = [{
          **review_mapper(r),
          'product_id': id
        } for (r, id) in limited] if type(args[2]) == str else \
          [{
            **review_mapper(r),
            'product_id': args[0]
          } for r in limited]
      return mapped, next_available
    return wrapped
  return actual_decorator

def filter(func: callable):
  @functools.wraps(func)
  def wrapped(*args, **kwargs):
    defaults = {
      'min_rate': 0,
      'max_rate': 5,
      'filter': 'date',
      'order': 'desc'
    }
    params = {k: kwargs[k] if k in kwargs.keys() else v
      for (k, v) in defaults.items()}
    reviews = func(*args, **kwargs)
    order_fn = globals()[params['order']]
    sorting = {
      'date': Review.created,
      'rating': Review.rate
    }
    return reviews \
      .filter(and_(
        Review.rate <= params['max_rate'],
        Review.rate >= params['min_rate'])) \
      .order_by(order_fn(sorting[params['filter']]))
  return wrapped
