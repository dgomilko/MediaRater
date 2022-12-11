from flask import Blueprint
from dao.product.product_daos import *
from dao.review.review_daos import *
from apps.routes_writer import register_routes
from controllers.product_controller import description, reviews, get_stats, add_review

product = Blueprint('product', __name__)
routes_fns = {
  '/product/movie-desc': lambda: description(MovieReviewDao, MovieDao),
  '/product/book-desc': lambda: description(BookReviewDao, BookDao),
  '/product/show-desc': lambda: description(ShowReviewDao, ShowDao),

  '/product/movie-reviews': lambda: reviews(MovieDao),
  '/product/book-reviews': lambda: reviews(BookDao),
  '/product/show-reviews': lambda: reviews(ShowDao),

  '/product/movie-stats': lambda: get_stats(MovieDao),
  '/product/book-stats': lambda: get_stats(BookDao),
  '/product/show-stats': lambda: get_stats(ShowDao),

  '/product/new-movie-review': lambda: add_review(MovieReviewDao, MovieDao),
  '/product/new-book-review': lambda: add_review(BookReviewDao, BookDao),
  '/product/new-show-review': lambda: add_review(ShowReviewDao, ShowDao),
}

register_routes(product, routes_fns)
