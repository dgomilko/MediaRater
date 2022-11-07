from http import HTTPStatus
from urllib.request import Request
from extensions import celery
from flask import Blueprint, request
from dao.userDao import UserDao
from apps.utils import err_response
from apps.recommend.recommender_task import get_recommendations
from apps.routes_writer import register_routes

recommend = Blueprint('recommend', __name__)

def recommend_products(request: Request, p_type: str) -> tuple[dict, int]:
  data = request.get_json()
  if not 'id' in data.keys():
    return err_response('Invalid data', HTTPStatus.BAD_REQUEST)
  uid = data['id']
  user_exists = UserDao.get_by_id(uid) is not None
  if not user_exists:
    return err_response('User does not exist', HTTPStatus.NOT_FOUND)
  reviews = UserDao.get_reviews(uid, p_type)
  if reviews is None:
    return err_response('Not enough reviews', HTTPStatus.NO_CONTENT)
  task = get_recommendations.apply_async(args=[p_type, uid])
  return {'task_id': task.id }, HTTPStatus.OK

@recommend.route('/recommend/get-result/<task_id>')
def get_result(task_id: str) -> tuple[dict, int]:
  task = celery.AsyncResult(task_id)
  state = {'status': task.state}
  if task.state != 'SUCCESS':
    failed = task.state == 'FAILURE'
    st = HTTPStatus.INTERNAL_SERVER_ERROR if failed else HTTPStatus.OK
    return state, st
  return {**state, 'result': task.get()}, HTTPStatus.OK

routes_fns = {
  '/recommend/rec-movies': lambda: recommend_products(request, 'movie'),
  '/recommend/rec-books': lambda: recommend_products(request, 'book'),
  '/recommend/rec-shows': lambda: recommend_products(request, 'show'),
}

register_routes(recommend, routes_fns)
