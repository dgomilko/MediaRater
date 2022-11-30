from http import HTTPStatus
from flask import request, Blueprint
from dao.user.userDao import UserDao
from apps.routes_writer import register_routes
from apps.err_messages import *
from apps.decorators import *

user = Blueprint('user', __name__)

@expected_fields(['id', 'page'])
def get_reviews(prod_type: str) -> tuple[dict, int]:
  data = request.get_json()
  correct_type = prod_type in ['movie', 'book', 'show']
  if not correct_type:
    return err_response(ErrMsg.INVALID, HTTPStatus.BAD_REQUEST)
  result = UserDao.get_reviews(data['id'], data['page'], prod_type)
  if not result: return err_response(
    ErrMsg.NO_REVIEWS,
    HTTPStatus.NOT_FOUND
  )
  reviews, next_available = result
  return {'reviews': reviews, 'next_available': next_available}

@date_formater
@expected_fields(['my_id', 'id'])
def profile() -> tuple[dict, int]:
  data = request.get_json()
  uid = data['id']
  my_page = data['my_id'] == uid
  user = UserDao.get_by_id(uid)
  if not user:
    return err_response(ErrMsg.NO_USER, HTTPStatus.NOT_FOUND)
  del user['password']
  return {**user, 'my_page': my_page}, HTTPStatus.OK

routes_fns = {
  '/user/profile': profile,
  '/user/movie-reviews': lambda: get_reviews('movie'),
  '/user/book-reviews': lambda: get_reviews('book'),
  '/user/show-reviews': lambda: get_reviews('show')
}

register_routes(user, routes_fns)
