from http import HTTPStatus
from flask import request, Blueprint
from dao.user.userDao import UserDao
from apps.decorators import *
from apps.err_messages import *
from dao.token.tokenDao import TokenDao
from security_utils.tokens import encode_token
from security_utils.passwd_encryption import check_passwd

authenticate = Blueprint('authenticate', __name__)
 
@authenticate.route("/register", methods=['POST'])
@expected_fields(['name', 'email', 'password', 'birthday', 'country', 'gender'])
def register() -> tuple[dict, int]:
  user_data = request.get_json()
  email_taken = UserDao.get_by_email(user_data['email']) is not None
  if email_taken:
    return err_response(ErrMsg.EMAIL_TAKEN, HTTPStatus.BAD_REQUEST)
  added_user = UserDao.add_user(user_data)
  if not added_user:
    return err_response(ErrMsg.INVALID, HTTPStatus.BAD_REQUEST)
  token = encode_token(added_user['id'])
  return {**added_user, 'token': token}, HTTPStatus.CREATED

@authenticate.route('/login', methods = ['POST'])
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
    return err_response(ErrMsg.WRONG_PASSWD, HTTPStatus.BAD_REQUEST)
  del found_user['password']
  token = encode_token(found_user['id'])
  return {**found_user, 'token': token}, HTTPStatus.OK

@authenticate.route('/logout', methods = ['POST'])
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
