from urllib.request import Request
from flask import request, Blueprint
from dao.userDao import UserDao
from http import HTTPStatus
from apps.utils import err_response, date_formater, check_missing_fields

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

@user.route('/user/profile', methods=['POST'])
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

@user.route('/user/movie-reviews', methods=['POST'])
def movie_reviews() -> tuple[dict, int]:
  return get_reviews(request, 'movie')

@user.route('/user/book-reviews', methods=['POST'])
def book_reviews() -> tuple[dict, int]:
  return get_reviews(request, 'book')

@user.route('/user/show-reviews', methods=['POST'])
def show_reviews() -> tuple[dict, int]:
  return get_reviews(request, 'show')
