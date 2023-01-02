from flask import Blueprint
from dao.product.product_daos import *
from apps.routes_writer import register_routes
from controllers.product_controller import description, reviews, get_stats, add_review

product = Blueprint('product', __name__)
routes_fns = {
  '/api/product/movie-desc': lambda: description('movie', MovieDao),
  '/api/product/book-desc': lambda: description('book', BookDao),
  '/api/product/show-desc': lambda: description('show', ShowDao),

  '/api/product/movie-reviews': lambda: reviews(MovieDao),
  '/api/product/book-reviews': lambda: reviews(BookDao),
  '/api/product/show-reviews': lambda: reviews(ShowDao),

  '/api/product/movie-stats': lambda: get_stats(MovieDao),
  '/api/product/book-stats': lambda: get_stats(BookDao),
  '/api/product/show-stats': lambda: get_stats(ShowDao),

  '/api/product/new-movie-review': lambda: add_review('movie', MovieDao),
  '/api/product/new-book-review': lambda: add_review('book', BookDao),
  '/api/product/new-show-review': lambda: add_review('show', ShowDao),
}

register_routes(product, routes_fns)
