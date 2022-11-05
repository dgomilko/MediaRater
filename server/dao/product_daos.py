from dataclasses import dataclass
from sqlalchemy.exc import IntegrityError
from dao.dao import Dao
from extensions import db
from db.models import *
from dao.review_mapper import get_reviews

class ProductDao(Dao):
  @staticmethod
  def add_product(product_data: dataclass, model: db.Model, args: dict) -> bool:
    product = MediaProduct(
      title=product_data.title,
      release=product_data.release,
      synopsis=product_data.synopsis,
      img_path=product_data.img_path
    )
    subproduct = model(product=product, **args)
    if not product_data.genres:
      db.session.add(subproduct)
      return super(ProductDao, ProductDao).commit()
    genres = ProductDao.__insert_new_genres(product_data.genres)
    db.session.add(subproduct)
    db.session.flush()
    for genre in genres:
      statement = product_genres.insert().values(
        product_id=subproduct.product.id,
        genre_id=genre['id']
      )
      db.session.execute(statement)
      res = super(ProductDao, ProductDao).commit()
      if not res: return False
    return True
  
  @staticmethod
  def get_product_by_id(pid: str, model: db.Model) -> tuple[any, dict]:
    result = super(ProductDao, ProductDao).get_by_id(model, pid)
    if result is None: return (None, None)
    common = {
      'title': result.product.title,
      'release': result.product.release,
      'img_path': result.product.img_path,
      'synopsis': result.product.synopsis,
      'genres': [genre.name for genre in result.product.genres],
    }
    return (result, common)
  
  @staticmethod
  def get_product_reviews(pid: str, model: db.Model) -> list[dict]:
    result = super(ProductDao, ProductDao).get_by_id(model, pid)
    if result is None: return result
    return get_reviews(result.reviews)

  def __insert_new_genres(genres: list[str]) -> list[dict]:
    result = list()
    for genre_name in genres:
      db.session.begin_nested()
      genre = Genre(name=genre_name)
      db.session.add(genre)
      try:
        db.session.flush()
      except IntegrityError:
        db.session.rollback()
        genre = Genre.query.filter_by(name=genre_name).first()
      result.append({'name': genre.name, 'id': genre.id})
    return result

# import types
# import functools

# def copy_func(f):
#     """Based on http://stackoverflow.com/a/6528148/190597 (Glenn Maynard)"""
#     g = types.FunctionType(f.__code__, f.__globals__, name=f.__name__,
#                            argdefs=f.__defaults__,
#                            closure=f.__closure__)
#     g = functools.update_wrapper(g, f)
#     g.__kwdefaults__ = f.__kwdefaults__
#     return g

def product_dao_factory(
  name: str,
  specific_args: list[str],
  model: db.Model
):
  def add_new(data: dataclass) -> bool:
    speial_values = {key: getattr(data, key) for key in specific_args}
    return ProductDao.add_product(data, model, speial_values)

  def get_by_id(pid: str) -> dict:
    result, common = ProductDao.get_product_by_id(pid, model)
    return result if result is None else {
      **{key: getattr(result, key) for key in specific_args},
      **common
    }

  def get_reviews(pid: str) -> list[dict]:
    return ProductDao.get_product_reviews(pid, model)

  methods = {
    'add_new': staticmethod(add_new),
    'get_by_id': staticmethod(get_by_id),
    'get_reviews': staticmethod(get_reviews)
  }
  return type(name, (ProductDao,), methods)

MovieDao = product_dao_factory('MovieDao', ['runtime', 'director'], Movie)
BookDao = product_dao_factory('BookDao', ['pages', 'author'], Book)
ShowDao = product_dao_factory('ShowDao', ['seasons', 'episodes'], Show)
