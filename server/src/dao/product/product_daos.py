from dao.product.product_factory import product_dao_factory
from db.models import Movie, Book, Show

MovieDao = product_dao_factory(
  'MovieDao',
  ['runtime', 'director'],
  Movie
)
BookDao = product_dao_factory(
  'BookDao',
  ['pages', 'author'],
  Book
)
ShowDao = product_dao_factory(
  'ShowDao',
  ['seasons', 'episodes'],
  Show
)
