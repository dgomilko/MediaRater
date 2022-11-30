from http import HTTPStatus
from flask import request, Blueprint
from dao.product.product_daos import *
from dao.product.ProductDao import ProductDao
from apps.routes_writer import register_routes
from apps.decorators import expected_fields
from apps.err_messages import *

products_list = Blueprint('products_list', __name__)

@expected_fields(['page'])
def load(dao: ProductDao):
  data = request.get_json()
  page = data['page']
  options = {
    'order': ['asc', 'desc'],
    'filter': ['title', 'rating', 'popular']
  }
  kwargs = {
    k: data[k] for k, v in options.items()
      if k in data.keys() and data[k] in v
  }
  res = dao.load(page, **kwargs)
  valid = {'products': res}, HTTPStatus.OK
  return valid if res else err_response(
    ErrMsg.NO_PAGE,
    HTTPStatus.NOT_FOUND
  )

routes_fns = {
  '/movies': lambda: load(MovieDao),
  '/shows': lambda: load(ShowDao),
  '/books': lambda: load(BookDao)
}

register_routes(products_list, routes_fns)