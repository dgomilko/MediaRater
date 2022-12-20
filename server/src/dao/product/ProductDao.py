from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, desc, asc, nullslast, nullsfirst
from sqlalchemy.sql import func
from dao.dao import Dao
import numpy as np
from extensions import db
from db.models import *
from dao.model_mappers import *
from dao.reviews_loader import limit_per_page, filter
from db.models import MediaProduct, Genre, product_genres

class ProductDao(Dao):
  @staticmethod
  def add_product(
    product_data: dict,
    model: db.Model,
    args: dict
  ) -> bool:
    product = MediaProduct(
      title=product_data['title'],
      release=product_data['release'],
      synopsis=product_data['synopsis'],
      img_path=product_data['img_path']
    )
    subproduct = model(product=product, **args)
    genres = product_data['genres']
    if not genres:
      db.session.add(subproduct)
      return super(ProductDao, ProductDao).commit()
    genres = ProductDao.__insert_new_genres(genres)
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
    rating = ProductDao.__get_rating(result)
    common = product_mapper(result)
    common['rating'] = rating
    common['reviews'] = len(result.reviews.all())
    return (result, common)

  @staticmethod
  def get_all_genres(model: db.Model) -> list[str]:
    result = db.session.query(Genre) \
      .join(product_genres).join(MediaProduct) \
      .join(model).distinct().all()
    return [r.name for r in result]
  
  @staticmethod
  @limit_per_page(10)
  @filter
  def get_product_reviews(
    pid: str,
    page: int,
    model: db.Model,
    min_rate: int = 0,
    max_rate: int = 5,
    filter: str = 'date',
    order: str = 'desc'
  ) -> tuple[list[dict], bool]:
    result = super(ProductDao, ProductDao).get_by_id(model, pid)
    return result.reviews if result else None

  @staticmethod
  def get_all_ids(model: db.Model) -> list[str]:
    return model.query.with_entities(model.id).all()

  @staticmethod
  def load_products(
    page: int,
    model: db.Model,
    review_model: db.Model,
    order: str ='desc',
    filter: str = 'popular',
    min_rate: int = 0,
    max_rate: int = 5,
    genres: list[str] = [],
    max_year: str = '',
    min_year: str = ''
  ) -> list[dict]:
    results_per_page = 20
    offset = results_per_page * (page - 1)
    limit = results_per_page * page
    order_fn = globals()[order]
    null_order = nullsfirst if order == 'asc' else nullslast
    rate_filter = and_(
      min_rate <= func.avg(review_model.rate),
      func.avg(review_model.rate) <= max_rate
    )
    year_filter_needed = max_year or min_year
    sorting = {
      'title': order_fn(MediaProduct.title),
      'rating': null_order(order_fn('rating')),
      'popular': null_order(order_fn(func.count(review_model.rate))),
    }
    query = db.session.query(
        model,
        func.avg(review_model.rate).label('rating'),
      ).outerjoin(review_model) \
      .join(MediaProduct)
    if year_filter_needed:
      year_filter = and_(
        MediaProduct.release >= min_year,
        MediaProduct.release <= max_year) \
      if max_year and min_year else \
        MediaProduct.release <= max_year if max_year \
        else MediaProduct.release > min_year
      query = query.filter(year_filter)
    if genres: query = query \
      .filter(MediaProduct.genres.any(Genre.name.in_(genres)))

    result = query.group_by(model.id, MediaProduct.title) \
      .order_by(sorting[filter]) \
      .distinct() \
      .having(rate_filter) \
      .slice(offset, limit) \
      .all()
    if not result: return None
    return [{
      **product_short_mapper(res[0]),
      'rating': round(float(res[1]), 1) if res[1] is not None else -1
    } for res in result]

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

  def __get_rating(product: any) -> float:
    average = np.average([rev.rate for rev in product.reviews])
    filtered = np.nan_to_num(average, nan=-1.0)
    return round(filtered, 1)
