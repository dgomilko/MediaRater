from http import HTTPStatus
from flask import request, Blueprint
from dao.product.product_daos import *
from dao.product.ProductDao import ProductDao
from dao.review.ReviewDao import ReviewDao 
from dao.review.review_daos import *
from apps.routes_writer import register_routes
from apps.err_messages import *
from apps.decorators import authorization_needed, expected_fields
from dao.user.userDao import UserDao

product = Blueprint('product', __name__)

@expected_fields(['id', 'user_id'])
def description(
  review_dao: ReviewDao,
  product_dao: ProductDao
) -> tuple[dict, int]:
  data = request.get_json()
  pid = data['id']
  found_product = product_dao.get_by_id(pid)
  if not found_product:
    return err_response(ErrMsg.NO_CONTENT, HTTPStatus.NOT_FOUND)
  reviewed = review_dao.reviewed(data['user_id'], pid)
  rate = reviewed['rate'] if reviewed else None
  valid_res = {**found_product, 'reviewed': rate}, HTTPStatus.OK
  return valid_res

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
@authorization_needed
def add_review(review_dao: ReviewDao, product_dao: ProductDao):
  data = request.get_json()
  uid = data['user_id']
  pid = data['product_id']
  user_exists = UserDao.get_by_id(uid)
  if not user_exists:
    return err_response(ErrMsg.NO_USER, HTTPStatus.NOT_FOUND)
  product_exists = product_dao.get_by_id(pid)
  if not product_exists:
    return err_response(ErrMsg.NO_PRODUCT, HTTPStatus.NOT_FOUND)
  already_reviewed = review_dao.reviewed(uid, pid)
  if already_reviewed:
    return err_response(ErrMsg.REVIEWED, HTTPStatus.FORBIDDEN)
  added = review_dao.add_new(data)
  return (added, HTTPStatus.CREATED) if added else err_response(
    ErrMsg.INVALID,
    HTTPStatus.BAD_REQUEST
  )

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
