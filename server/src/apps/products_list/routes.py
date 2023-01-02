from flask import Blueprint
from dao.product.product_daos import *
from apps.routes_writer import register_routes
from controllers.product_controller import load, genres

products_list = Blueprint('products_list', __name__)

routes_fns = {
  '/api/movies': lambda: load(MovieDao),
  '/api/shows': lambda: load(ShowDao),
  '/api/books': lambda: load(BookDao),
  '/api/movie-genres': lambda: genres(MovieDao),
  '/api/show-genres': lambda: genres(ShowDao),
  '/api/book-genres': lambda: genres(BookDao),
}

register_routes(products_list, routes_fns)
