from http import HTTPStatus
from celery.result import AsyncResult
from flask import Blueprint, request
from apps.utils import err_response
from apps.recommend.recommender_task import get_recommendations

recommend = Blueprint('recommend', __name__)

@recommend.route('/recommend/rec-movies', methods=['POST'])
def rec_movies() -> tuple[dict, int]:
  data = request.get_json()
  if not 'id' in data.keys():
    return err_response('Invalid data', HTTPStatus.BAD_REQUEST)
  # TODO: check user exists
  task = get_recommendations.apply_async(args=[data['id']])
  return {'task_id': task.id, }

@recommend.route('/recommend/get-result/<task_id>')
def get_result(task_id: str) -> tuple[dict, int]:
  task = AsyncResult(task_id)
  if task.state != "SUCCESS":
    print({"status":task.state})
  print({"status":task.state,"result":task.get()})
