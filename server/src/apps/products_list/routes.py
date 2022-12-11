from flask import Blueprint
from dao.product.product_daos import *
from apps.routes_writer import register_routes
from controllers.product_controller import load, genres

products_list = Blueprint('products_list', __name__)

routes_fns = {
  '/movies': lambda: load(MovieDao),
  '/shows': lambda: load(ShowDao),
  '/books': lambda: load(BookDao),
  '/movie-genres': lambda: genres(MovieDao),
  '/show-genres': lambda: genres(ShowDao),
  '/book-genres': lambda: genres(BookDao),
}

register_routes(products_list, routes_fns)
