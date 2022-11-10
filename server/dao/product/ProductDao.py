from dataclasses import dataclass
from sqlalchemy.exc import IntegrityError
from dao.dao import Dao
from extensions import db
from db.models import *
from dao.model_mappers import *
from dao.reviews_loader import limit_per_page

class ProductDao(Dao):
  @staticmethod
  def add_product(
    product_data: dataclass,
    model: db.Model,
    args: dict
  ) -> bool:
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
    if not result: return (None, None)
    common = product_mapper(result)
    return (result, common)
  
  @staticmethod
  @limit_per_page(10)
  def get_product_reviews(
    pid: str,
    page: int,
    model: db.Model
  ) -> tuple[list[dict], bool]:
    result = super(ProductDao, ProductDao).get_by_id(model, pid)
    return result.reviews if result else None

  @staticmethod
  def get_all_ids(model: db.Model) -> list[str]:
    return model.query.with_entities(model.id).all()

  @staticmethod
  def load_products(page: int, model: db.Model) -> list[dict]:
    results_per_page = 20
    offset = results_per_page * (page - 1)
    limit = results_per_page * page
    result = model.query.slice(offset, limit).all()
    if not result: return None
    return [product_short_mapper(r) for r in result]

  @staticmethod
  def get_stats(pid: str, model: db.Model) -> list[dict]:
    result = super(ProductDao, ProductDao).get_by_id(model, pid)
    return stats_mapper(result.reviews) if result else None

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
