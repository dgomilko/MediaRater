from urllib.request import Request
from flask import request, Blueprint
from dao.userDao import UserDao
from http import HTTPStatus
from apps.utils import err_response, date_formater, check_missing_fields
from apps.routes_writer import register_routes

user = Blueprint('user', __name__)

def get_reviews(request: Request, type: str) -> tuple[dict, int]:
  data = request.get_json()
  correct_type = type in ['movie', 'book', 'show']
  if not (correct_type and 'id' in data.keys()):
    return err_response('Invalid data', HTTPStatus.BAD_REQUEST)
  reviews = UserDao.get_reviews(data['id'], type)
  valid_res = {'reviews': reviews}, HTTPStatus.OK
  return valid_res if reviews is not None else err_response(
    f'Couldn\'t find {type} reviews',
    HTTPStatus.NOT_FOUND
  )

@date_formater
def profile() -> tuple[dict, int]:
  data = request.get_json()
  expected_fields = ['my_id', 'id']
  missing_fields = check_missing_fields(data, expected_fields)
  if missing_fields:
    return err_response('Invalid data', HTTPStatus.BAD_REQUEST)
  uid = data['id']
  my_page = data['my_id'] == uid
  user = UserDao.get_by_id(uid)
  if user is None:
    return err_response('User not found', HTTPStatus.NOT_FOUND)
  del user['password']
  return {**user, 'my_page': my_page}, HTTPStatus.OK

routes_fns = {
  '/user/profile': profile,
  '/user/movie-reviews': lambda: get_reviews(request, 'movie'),
  '/user/book-reviews': lambda: get_reviews(request, 'book'),
  '/user/show-reviews': lambda: get_reviews(request, 'show')
}

register_routes(user, routes_fns)
