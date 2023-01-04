import re
from http import HTTPStatus
from flask import request
from dao.user.userDao import UserDao
from dao.review.ReviewDao import ReviewDao 
from dao.product.ProductDao import ProductDao
from constants.err_messages import *
from dao.product.product_daos import *
from controllers.utils import get_kwargs
from services.stats_analyzer.stats import process_stats
from services.recommender.recommender_task import update_model
from controllers.decorators import authorization_needed, expected_fields

@expected_fields(['id', 'user_id'])
def description(
  review_type: str,
  product_dao: ProductDao
) -> tuple[dict, int]:
  data = request.get_json()
  pid = data['id']
  found_product = product_dao.get_by_id(pid)
  if not found_product:
    return err_response(ErrMsg.NO_CONTENT, HTTPStatus.NOT_FOUND)
  reviewed = ReviewDao.reviewed(data['user_id'], pid, review_type)
  rate = reviewed['rate'] if reviewed else None
  valid_res = {**found_product, 'reviewed': rate}, HTTPStatus.OK
  return valid_res

@expected_fields(['id'])
def get_stats(dao: ProductDao) -> tuple[dict, int]:
  pid = request.get_json()['id']
  stats = dao.stats(pid)
  valid_res = {'stats': process_stats(stats)}, HTTPStatus.OK
  return valid_res if reviews else err_response(
    ErrMsg.NO_STATS,
    HTTPStatus.NOT_FOUND
  )

@expected_fields(['id', 'page'])
def reviews(dao: ProductDao) -> tuple[dict, int]:
  data = request.get_json()
  kwargs = get_kwargs(data)
  result = dao.get_reviews(data['id'], data['page'], **kwargs)
  if not result:
    return err_response(ErrMsg.NO_REVIEWS, HTTPStatus.NOT_FOUND)
  reviews, next_available = result
  return {'reviews': reviews, 'next_available': next_available} 

@expected_fields(['rate', 'user_id', 'product_id'])
@authorization_needed
def add_review(review_type: str, product_dao: ProductDao):
  data = request.get_json()
  uid = data['user_id']
  pid = data['product_id']
  user_exists = UserDao.get_by_id(uid)
  min_reviews = 5
  if not user_exists:
    return err_response(ErrMsg.NO_USER, HTTPStatus.NOT_FOUND)
  product_exists = product_dao.get_by_id(pid)
  if not product_exists:
    return err_response(ErrMsg.NO_PRODUCT, HTTPStatus.NOT_FOUND)
  already_reviewed = ReviewDao.reviewed(uid, pid, review_type)
  if already_reviewed:
    return err_response(ErrMsg.REVIEWED, HTTPStatus.FORBIDDEN)
  added = ReviewDao.add_new(data, review_type)
  name_str = re.findall(
    '[A-Z][^A-Z]*', product_dao.__name__
  )[0].lower()
  reviews_count = UserDao.count_reviews(uid, name_str)
  if reviews_count == min_reviews:
    update_model.apply_async(args=[name_str])
  return (added, HTTPStatus.CREATED) if added else err_response(
    ErrMsg.INVALID,
    HTTPStatus.BAD_REQUEST
  )

@expected_fields(['page'])
def load(dao: ProductDao):
  data = request.get_json()
  page = data['page']
  options = {
    'order': ['asc', 'desc'],
    'filter': ['title', 'rating', 'popular', 'date'],
    'min_rate': list(range(0, 6)),
    'max_rate': list(range(0, 6)),
  }
  kwargs = {
    k: data[k] for k, v in options.items()
      if k in data.keys() and data[k] in v
  }
  params = ['genres', 'max_year', 'min_year']
  for param in params:
    if param in data.keys(): kwargs[param] = data[param]
  res = dao.load(page, **kwargs)
  valid = {'products': res}, HTTPStatus.OK
  return valid if res else err_response(
    ErrMsg.NO_PAGE,
    HTTPStatus.NOT_FOUND
  )

def genres(dao: ProductDao):
  res = dao.genres()
  valid = {'genres': res}, HTTPStatus.OK
  return valid if res else err_response(
    ErrMsg.NO_CONTENT,
    HTTPStatus.NOT_FOUND
  )
