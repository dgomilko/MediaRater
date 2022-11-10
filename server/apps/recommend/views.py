from http import HTTPStatus
from extensions import celery
from flask import Blueprint, request
from dao.user.userDao import UserDao
from apps.decorators import *
from apps.err_messages import *
from apps.recommend.recommender_task import get_recommendations
from apps.routes_writer import register_routes

recommend = Blueprint('recommend', __name__)

@authorization_needed
@expected_fields(['id'])
def recommend_products(p_type: str) -> tuple[dict, int]:
  uid = request.get_json()['id']
  user_exists = UserDao.get_by_id(uid) is not None
  if not user_exists:
    return err_response(ErrMsg.NO_USER, HTTPStatus.NOT_FOUND)
  reviews = UserDao.get_reviews(uid, p_type)
  if not reviews:
    return err_response(ErrMsg.NO_RECS, HTTPStatus.NO_CONTENT)
  task = get_recommendations.apply_async(args=[p_type, uid])
  return {'task_id': task.id }, HTTPStatus.OK

@recommend.route('/recommend/get-result/<task_id>')
@authorization_needed
def get_result(task_id: str) -> tuple[dict, int]:
  task = celery.AsyncResult(task_id)
  state = {'status': task.state}
  if task.state != 'SUCCESS':
    failed = task.state == 'FAILURE'
    st = HTTPStatus.INTERNAL_SERVER_ERROR if failed else HTTPStatus.OK
    return state, st
  return {**state, 'result': task.get()}, HTTPStatus.OK

routes_fns = {
  '/recommend/rec-movies': lambda: recommend_products('movie'),
  '/recommend/rec-books': lambda: recommend_products('book'),
  '/recommend/rec-shows': lambda: recommend_products('show'),
}

register_routes(recommend, routes_fns)
