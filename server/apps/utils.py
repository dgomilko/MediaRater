from http import HTTPStatus

err_response = lambda msg, status: ({ 'message': msg }, status)

def check_missing_fields(data: dict, expected: list[str]) -> bool:
  if not data: return True
  includes_all_data = all([field in data.keys() for field in expected])
  return not includes_all_data

def date_formater(func):
  def wrapped(*args, **kwargs):
    res = func(*args, **kwargs)
    if res[1] in [HTTPStatus.OK, HTTPStatus.CREATED]:
      res[0]['birthday'] = res[0]['birthday'].strftime('%d.%m.%Y')
    return res
  return wrapped
