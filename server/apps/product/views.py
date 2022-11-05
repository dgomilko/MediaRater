from urllib.request import Request
from flask import request, Blueprint
from dao.product_daos import BookDao, MovieDao, ProductDao, ShowDao
from http import HTTPStatus
from apps.utils import err_response
from apps.routes_writer import register_routes

product = Blueprint('product', __name__)

def description(request: Request, dao: ProductDao):
  data = request.get_json()
  if not 'id' in data.keys():
    return err_response('Invalid data', HTTPStatus.BAD_REQUEST)
  found_product = dao.get_by_id(data['id'])
  valid_res = found_product, HTTPStatus.OK
  return valid_res if found_product is not None else err_response(
    'Couldn\'t find this content',
    HTTPStatus.NOT_FOUND
  )

def reviews(request: Request, dao: ProductDao):
  data = request.get_json()
  if not 'id' in data.keys():
    return err_response('Invalid data', HTTPStatus.BAD_REQUEST)
  reviews = dao.get_reviews(data['id'])
  valid_res = {'reviews': reviews}, HTTPStatus.OK
  return valid_res if reviews is not None else err_response(
    'Couldn\'t find any reviews',
    HTTPStatus.NOT_FOUND
  )

routes_fns = {
  '/product/movie-desc': lambda: description(request, MovieDao),
  '/product/book-desc': lambda: description(request, BookDao),
  '/product/show-desc': lambda: description(request, ShowDao),
  '/product/movie-reviews': lambda: reviews(request, MovieDao),
  '/product/book-reviews': lambda: reviews(request, BookDao),
  '/product/show-reviews': lambda: reviews(request, ShowDao)
}

register_routes(product, routes_fns)
