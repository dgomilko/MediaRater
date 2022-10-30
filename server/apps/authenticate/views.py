import bcrypt
from http import HTTPStatus
from flask import request, Blueprint
from db.structs import UserType
from dao.userDao import UserDao
from apps.utils import err_response, date_formater, check_missing_fields

authenticate = Blueprint('authenticate', __name__)

@authenticate.route("/register", methods=['POST'])
def register() -> tuple[dict, int]:
  user_data = request.get_json()
  err = err_response('Invalid data', HTTPStatus.BAD_REQUEST)
  expected_fields = ['name', 'email', 'password', 'birthday', 'country', 'gender']
  missing_fields = check_missing_fields(user_data, expected_fields)
  if missing_fields: return err
  email_taken = UserDao.get_by_email(user_data['email']) is not None
  if email_taken:
    return err_response('Email alredy taken', HTTPStatus.BAD_REQUEST)
  added_user = UserDao.add_user(UserType(**user_data))
  return added_user, HTTPStatus.CREATED if added_user is not None else err

@authenticate.route('/login', methods = ['POST'])
@date_formater
def login() -> tuple[dict, int]:
  user_data = request.get_json()
  expected_fields = ['email', 'password']
  missing_fields = check_missing_fields(user_data, expected_fields)
  if missing_fields:
    return err_response('Invalid data', HTTPStatus.BAD_REQUEST)
  found_user = UserDao.get_by_email(user_data['email'])
  if found_user is None:
    return err_response('User does not exist', HTTPStatus.NOT_FOUND)
  print(user_data['password'], found_user['password'])
  passwd_encoded = [p['password'].encode('utf-8') for p in [user_data, found_user]]
  password_correct = bcrypt.checkpw(*passwd_encoded)
  if not password_correct:
    return err_response('Invalid password', HTTPStatus.BAD_REQUEST)
  del found_user['password']
  return found_user, HTTPStatus.OK
