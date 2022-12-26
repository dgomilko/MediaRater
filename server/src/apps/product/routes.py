from flask import Blueprint
from dao.product.product_daos import *
from apps.routes_writer import register_routes
from controllers.product_controller import description, reviews, get_stats, add_review

product = Blueprint('product', __name__)
routes_fns = {
  '/product/movie-desc': lambda: description('movie', MovieDao),
  '/product/book-desc': lambda: description('book', BookDao),
  '/product/show-desc': lambda: description('show', ShowDao),

  '/product/movie-reviews': lambda: reviews(MovieDao),
  '/product/book-reviews': lambda: reviews(BookDao),
  '/product/show-reviews': lambda: reviews(ShowDao),

  '/product/movie-stats': lambda: get_stats(MovieDao),
  '/product/book-stats': lambda: get_stats(BookDao),
  '/product/show-stats': lambda: get_stats(ShowDao),

  '/product/new-movie-review': lambda: add_review('movie', MovieDao),
  '/product/new-book-review': lambda: add_review('book', BookDao),
  '/product/new-show-review': lambda: add_review('show', ShowDao),
}

register_routes(product, routes_fns)
