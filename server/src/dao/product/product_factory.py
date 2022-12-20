from extensions import db
from dao.product.ProductDao import ProductDao

def product_dao_factory(
  name: str,
  specific_args: list[str],
  model: db.Model,
  review_model: db.Model
):
  def add_new(data: dict) -> bool:
    speial_values = {key: data[key] for key in specific_args}
    return ProductDao.add_product(data, model, speial_values)

  def get_by_id(pid: str) -> dict:
    result, common = ProductDao.get_product_by_id(pid, model)
    return None if not result else {
      **{key: getattr(result, key) for key in specific_args},
      **common
    }

  def get_reviews(
    pid: str,
    page: int,
    **kwargs
  ) -> tuple[list[dict], bool]:
    return ProductDao.get_product_reviews(pid, page, model, **kwargs)

  def get_ids() -> list[dict]:
    return [x[0] for x in ProductDao.get_all_ids(model)]

  def load(page: int, **kwargs) -> list[dict]:
    return ProductDao \
      .load_products(page, model, review_model, **kwargs)

  def stats(pid: str) -> list[dict]:
    return ProductDao.get_stats(pid, model)

  def genres() -> list[str]:
    return ProductDao.get_all_genres(model)

  methods = {
    'add_new': staticmethod(add_new),
    'get_by_id': staticmethod(get_by_id),
    'get_reviews': staticmethod(get_reviews),
    'get_ids': staticmethod(get_ids),
    'load': staticmethod(load),
    'stats': staticmethod(stats),
    'genres': staticmethod(genres),
  }
  return type(name, (ProductDao,), methods)
