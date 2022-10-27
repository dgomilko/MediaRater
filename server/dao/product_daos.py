from dataclasses import dataclass
from sqlalchemy.exc import IntegrityError
from dao.dao import Dao
from db.database import db
from db.models import Book, MediaProduct, Movie, Genre, Show, movie_genres
from db.structs import BookType, MovieType, ShowType

class ProductDao(Dao):
  @staticmethod
  def add_product(product_data: dataclass, model: db.Model, args: dict) -> bool:
    genres = ProductDao.__insert_new_genres(product_data.genres)
    product = MediaProduct(
      title=product_data.title,
      release=product_data.release,
      synopsis=product_data.synopsis,
      img_path=product_data.img_path
    )
    subproduct = model(product=product, **args)
    db.session.add(subproduct)
    db.session.flush()
    for genre in genres:
      statement = movie_genres.insert().values(
        product_id=subproduct.product.id,
        genre_id=genre['id']
      )
      db.session.execute(statement)
    return super(ProductDao, ProductDao).commit()
  
  @staticmethod
  def get_product_by_id(pid: str) -> dict:
    result = super(MovieDao, MovieDao).get_by_id(Movie, pid)
    common = {
      'title': result.product.title,
      'release': result.product.release,
      'img_path': result.product.img_path,
      'synopsis': result.product.synopsis,
      'genres': [genre.name for genre in result.product.genres],
    }
    return (result, common)
  
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
  def get_by_id(pid: str) -> MovieType:
    result, common = super(MovieDao, MovieDao).get_product_by_id(pid)
    return MovieType(
      runtime=result.runtime,
      director=result.director,
      **common
    )

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
  def get_by_id(pid: str) -> BookType:
    result, common = super(BookDao, BookDao).get_product_by_id(pid)
    return BookType(
      pages=result.pages,
      author=result.author,
      **common
    )

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
    result, common = super(BookDao, BookDao).get_product_by_id(pid)
    return BookType(
      pages=result.pages,
      author=result.author,
      **common
    )
