from dataclasses import dataclass
from sqlalchemy.exc import IntegrityError
from dao.dao import Dao
from db.database import db
from db.models import Book, MediaProduct, Movie, Genre, Show, product_genres
from db.structs import BookType, MovieType, ShowType

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
  def get_reviews(pid: str, model: db.Model, attr: str):
    result = super(ProductDao, ProductDao).get_by_id(model, pid)
    if result is None: return result
    return [{
      'text': r.text,
      'rate': r.rate,
      'author': r.user.name,
      'author_id': r.user_id,
      'product': getattr(r, attr).product.title,
      'product_id': getattr(r, f'{attr}_id')
    } for r in result.reviews]
    
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

class MovieDao(ProductDao):
  @staticmethod
  def add_new(film_data: MovieType) -> bool:
    specific_args = {
      'runtime': film_data.runtime,
      'director': film_data.director
    }
    return super(MovieDao, MovieDao) \
      .add_product(film_data, Movie, specific_args)

  @staticmethod
  def get_by_id(pid: str) -> dict:
    result, common = super(MovieDao, MovieDao) \
      .get_product_by_id(pid, Movie)
    return result if result is None else {
      'runtime': result.runtime,
      'director': result.director,
      **common
    }

class BookDao(ProductDao):
  @staticmethod
  def add_new(book_data: BookType) -> bool:
    specific_args = {
      'pages': book_data.pages,
      'author': book_data.author
    }
    return super(BookDao, BookDao) \
      .add_product(book_data, Book, specific_args)

  @staticmethod
  def get_by_id(pid: str) -> dict:
    result, common = super(BookDao, BookDao) \
      .get_product_by_id(pid, Book)
    return result if result is None else {
      'pages': result.pages,
      'author': result.author,
      **common
    }

class ShowDao(ProductDao):
  @staticmethod
  def add_new(show_data: ShowType) -> bool:
    specific_args = {
      'seasons': show_data.seasons,
      'episodes': show_data.episodes
    }
    return super(ShowDao, ShowDao) \
      .add_product(show_data, Show, specific_args)

  @staticmethod
  def get_by_id(pid: str) -> ShowType:
    result, common = super(ShowDao, ShowDao) \
      .get_product_by_id(pid, Show)
    return result if result is None else {
      'seasons': result.seasons,
      'episodes': result.episodes,
      **common
    }
