from http import HTTPStatus
from flask import request, Blueprint
from dao.product.product_daos import *
from dao.product.ProductDao import ProductDao
from dao.review.ReviewDao import ReviewDao 
from dao.review.review_daos import *
from apps.routes_writer import register_routes
from apps.err_messages import *
from apps.decorators import expected_fields
from db.structs import ReviewType

product = Blueprint('product', __name__)

@expected_fields(['id'])
def description(dao: ProductDao) -> tuple[dict, int]:
  pid = request.get_json()['id']
  found_product = dao.get_by_id(pid)
  valid_res = found_product, HTTPStatus.OK
  return valid_res if found_product else err_response(
    ErrMsg.NO_CONTENT,
    HTTPStatus.NOT_FOUND
  )

@expected_fields(['id'])
def get_stats(dao: ProductDao) -> tuple[dict, int]:
  pid = request.get_json()['id']
  stats = dao.stats(pid)
  valid_res = {'stats': stats}, HTTPStatus.OK
  return valid_res if reviews else err_response(
    ErrMsg.NO_STATS,
    HTTPStatus.NOT_FOUND
  )

@expected_fields(['id', 'page'])
def reviews(dao: ProductDao) -> tuple[dict, int]:
  data = request.get_json()
  result = dao.get_reviews(data['id'], data['page'])
  if not result:
    return err_response(ErrMsg.NO_REVIEWS, HTTPStatus.NOT_FOUND)
  reviews, next_available = result
  return {'reviews': reviews, 'next_available': next_available} 

@expected_fields(['rate', 'user_id', 'product_id'])
def add_review(dao: ReviewDao):
  data = request.get_json()
  added = dao.add_new(ReviewType(**data))
  print(added, HTTPStatus.CREATED if added else err_response(
    ErrMsg.INVALID,
    HTTPStatus.BAD_REQUEST
  ))
  return (added, HTTPStatus.CREATED) if added else err_response(
    ErrMsg.INVALID,
    HTTPStatus.BAD_REQUEST
  )

routes_fns = {
  '/product/movie-desc': lambda: description(MovieDao),
  '/product/book-desc': lambda: description(BookDao),
  '/product/show-desc': lambda: description(ShowDao),

  '/product/movie-reviews': lambda: reviews(MovieDao),
  '/product/book-reviews': lambda: reviews(BookDao),
  '/product/show-reviews': lambda: reviews(ShowDao),

  '/product/movie-stats': lambda: get_stats(MovieDao),
  '/product/book-stats': lambda: get_stats(BookDao),
  '/product/show-stats': lambda: get_stats(ShowDao),

  '/product/new-movie-review': lambda: add_review(MovieReviewDao),
  '/product/new-book-review': lambda: add_review(BookReviewDao),
  '/product/new-show-review': lambda: add_review(ShowReviewDao),
}

register_routes(product, routes_fns)
