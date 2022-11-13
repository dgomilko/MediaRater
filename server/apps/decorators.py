import functools
from http import HTTPStatus
from flask import request
from dao.token.tokenDao import TokenDao
from security_utils.tokens import decode_token
from apps.err_messages import err_response, ErrMsg

def date_formater(func: callable) -> callable:
  @functools.wraps(func)
  def wrapped(*args, **kwargs):
    res = func(*args, **kwargs)
    if res[1] in [HTTPStatus.OK, HTTPStatus.CREATED]:
      res[0]['birthday'] = res[0]['birthday'].strftime('%d.%m.%Y')
    return res
  return wrapped

def expected_fields(expected: list[str]) -> callable:
  def actual_decorator(func: callable) -> callable:
    @functools.wraps(func)
    def wrapped(*args, **kwargs):
      data = request.get_json()
      err = err_response(ErrMsg.INVALID, HTTPStatus.BAD_REQUEST)
      if not data: return err
      includes_all_data = all([field in data.keys() for field in expected])
      if not includes_all_data: return err
      return func(*args, **kwargs)
    return wrapped
  return actual_decorator

def authorization_needed(func: callable) -> callable:
  @functools.wraps(func)
  def wrapped(*args, **kwargs):
    auth_header = request.headers.get('Authorization')
    err = err_response(ErrMsg.AUTH_REQUIRED, HTTPStatus.FORBIDDEN)
    if not auth_header: return err
    header_split = auth_header.split(' ')
    if len(header_split) < 2: return err
    token = header_split[1]
    alredy_blacklisted = TokenDao.check(token)
    if alredy_blacklisted:
      return err_response(ErrMsg.BLACKLIST, HTTPStatus.BAD_REQUEST)
    success, val = decode_token(token)
    if not success:
      return err_response(val, HTTPStatus.BAD_REQUEST)
    return func(*args, **kwargs)
  return wrapped
