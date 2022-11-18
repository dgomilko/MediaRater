from dao.product.product_factory import product_dao_factory
from db.models import Movie, Book, Show, MovieReview, BookReview, ShowReview

MovieDao = product_dao_factory(
  'MovieDao',
  ['runtime', 'director'],
  Movie,
  MovieReview
)
BookDao = product_dao_factory(
  'BookDao',
  ['pages', 'author'],
  Book,
  BookReview
)
ShowDao = product_dao_factory(
  'ShowDao',
  ['seasons', 'episodes'],
  Show,
  ShowReview
)
