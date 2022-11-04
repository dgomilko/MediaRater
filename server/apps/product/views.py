from urllib.request import Request
from flask import request, Blueprint
from dao.product_daos import BookDao, MovieDao, ProductDao, ShowDao
from http import HTTPStatus
from apps.utils import err_response, date_formater, check_missing_fields

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

@product.route('/product/movie-desc', methods=['POST'])
def movie_desc():
  return description(request, MovieDao)
  
@product.route('/product/book-desc', methods=['POST'])
def book_desc():
  return description(request, BookDao)

@product.route('/product/show-desc', methods=['POST'])
def show_desc():
  return description(request, ShowDao)

@product.route('/product/movie-reviews', methods=['POST'])
def movie_reviews():
  return reviews(request, MovieDao)

@product.route('/product/show-reviews', methods=['POST'])
def show_reviews():
  return reviews(request, ShowDao)

@product.route('/product/book-reviews', methods=['POST'])
def book_reviews():
  return reviews(request, BookDao)
