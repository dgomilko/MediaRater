from http import HTTPStatus
from flask import request
from extensions import celery
from dao.user.userDao import UserDao
from controllers.decorators import *
from constants.err_messages import *
from dao.token.tokenDao import TokenDao
from security_utils.tokens import encode_token
from security_utils.passwd_encryption import check_passwd
from recommender.recommender_task import get_recommendations

@expected_fields(['name', 'email', 'password', 'birthday', 'country', 'gender'])
def register() -> tuple[dict, int]:
  user_data = request.get_json()
  email_taken = UserDao.get_by_email(user_data['email']) is not None
  if email_taken:
    return err_response(ErrMsg.EMAIL_TAKEN, HTTPStatus.FORBIDDEN)
  added_user = UserDao.add_user(user_data)
  if not added_user:
    return err_response(ErrMsg.INVALID, HTTPStatus.BAD_REQUEST)
  token = encode_token(added_user['id'])
  return {**added_user, 'token': token}, HTTPStatus.CREATED

@expected_fields(['email', 'password'])
@date_formater
def login() -> tuple[dict, int]:
  user_data = request.get_json()
  found_user = UserDao.get_by_email(user_data['email'])
  if not found_user:
    return err_response(ErrMsg.UNKNOWN_EMAIL, HTTPStatus.NOT_FOUND)
  passwds = [p['password'] for p in [user_data, found_user]]
  password_correct = check_passwd(*passwds)
  if not password_correct:
    return err_response(ErrMsg.WRONG_PASSWD, HTTPStatus.FORBIDDEN)
  del found_user['password']
  token = encode_token(found_user['id'])
  return {**found_user, 'token': token}, HTTPStatus.OK

@authorization_needed
def logout():
  auth_header = request.headers.get('Authorization')
  token = auth_header.split(' ')[1]
  blacklisted = TokenDao.blacklist(token)
  if not blacklisted: return err_response(
    ErrMsg.LOGOUT_ERROR,
    HTTPStatus.INTERNAL_SERVER_ERROR
  )
  return {'status': 'success'}, HTTPStatus.OK

@authorization_needed
def check_token(): return {}, HTTPStatus.OK

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

@authorization_needed
@expected_fields(['id'])
def recommend_products(p_type: str) -> tuple[dict, int]:
  uid = request.get_json()['id']
  min_reviews = 5
  user_exists = UserDao.get_by_id(uid) is not None
  if not user_exists:
    return err_response(ErrMsg.NO_USER, HTTPStatus.NOT_FOUND)
  reviews = UserDao.count_reviews(uid, p_type)
  if reviews < min_reviews:
    return err_response(ErrMsg.NO_RECS, HTTPStatus.NOT_FOUND)
  task = get_recommendations.apply_async(args=[p_type, uid])
  return {'task_id': task.id }, HTTPStatus.OK

@authorization_needed
def get_result(task_id: str) -> tuple[dict, int]:
  task = celery.AsyncResult(task_id)
  state = {'status': task.state}
  if task.state != 'SUCCESS':
    failed = task.state == 'FAILURE'
    st = HTTPStatus.INTERNAL_SERVER_ERROR if failed else HTTPStatus.OK
    return state, st
  return {**state, 'result': task.get()}, HTTPStatus.OK
