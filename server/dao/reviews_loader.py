import functools
from dao.model_mappers import review_mapper

def limit_per_page(res_per_page: int) -> callable:
  def actual_decorator(func: callable):
    @functools.wraps(func)
    def wrapped(*args, **kwargs):
      page, attr = args[1:]
      offset = res_per_page * (page - 1)
      limit = res_per_page * page
      result = func(*args, **kwargs)
      if not result: return None
      limited = result.slice(offset, limit).all()
      if not limited: return None
      next_available = bool(result
        .slice(limit, limit + res_per_page).all())
      mapped = [review_mapper(r) for r in limited]
      return mapped, next_available
    return wrapped
  return actual_decorator
