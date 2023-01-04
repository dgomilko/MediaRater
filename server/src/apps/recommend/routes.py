from flask import Blueprint
from apps.routes_writer import register_routes
from controllers.user_controller import recommend_products, get_result

recommend = Blueprint('recommend', __name__)

recommend.route('/api/recommend/get-result/<task_id>')(get_result)

routes_fns = {
  '/api/recommend/rec-movies': lambda: recommend_products('movie'),
  '/api/recommend/rec-books': lambda: recommend_products('book'),
  '/api/recommend/rec-shows': lambda: recommend_products('show'),
}

register_routes(recommend, routes_fns)
