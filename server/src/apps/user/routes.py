from flask import Blueprint
from apps.routes_writer import register_routes
from controllers.user_controller import get_reviews, profile

user = Blueprint('user', __name__)

routes_fns = {
  '/api/user/profile': profile,
  '/api/user/movie-reviews': lambda: get_reviews('movie'),
  '/api/user/book-reviews': lambda: get_reviews('book'),
  '/api/user/show-reviews': lambda: get_reviews('show')
}

register_routes(user, routes_fns)
