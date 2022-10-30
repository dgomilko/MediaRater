from flask import Flask
from db.models import db
from db_populate import populate_db
from recommend import *
from dao.review_daos import MovieReviewDao
from dao.userDao import UserDao
from dao.product_daos import MovieDao
from apps.authenticate.views import authenticate
from apps.user.views import user
from apps.product.views import product

# @app.route('/')
# def index():
#   return jsonify({"message":"Welcome to my site"})

def create_app() -> Flask:
  apps = [authenticate, user, product]
  app = Flask(__name__)
  app.config.from_object('config.DevelopmentConfig')
  db.app = app
  db.init_app(app)
  db.create_all()
  # populate_db()
  for bp in apps: app.register_blueprint(bp)
  return app

create_app().run()
